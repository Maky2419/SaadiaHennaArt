import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function safeStr(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

function safeInt(v: FormDataEntryValue | null) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fullName = "";
    let email = "";
    let phone = ""; // instagram handle in UI, but we keep field name
    let eventType = "";
    let location = "";
    let notes = "";
    let startIso = "";
    let endIso = "";
    let timezone = "America/Vancouver";

    // NEW
    let attendees: number | null = null;
    let boothDetails = ""; // Event only
    let privateLocation = ""; // Private only

    // Optional file (only available in multipart)
    let referenceFile: File | null = null;

    if (contentType.includes("application/json")) {
      // Backwards compatible: JSON requests still work (but no image)
      const body = await req.json();

      fullName = String(body.fullName || "").trim();
      email = String(body.email || "").trim();
      phone = String(body.phone || "").trim();
      eventType = String(body.eventType || "").trim();
      location = String(body.location || "").trim();
      notes = String(body.notes || "").trim();
      startIso = String(body.startIso || "").trim();
      endIso = String(body.endIso || "").trim();
      timezone = String(body.timezone || "America/Vancouver").trim();

      // NEW JSON fields (optional if someone still posts JSON)
      attendees = body.attendees != null ? Math.floor(Number(body.attendees)) : null;
      boothDetails = String(body.boothDetails || "").trim();
      privateLocation = String(body.privateLocation || "").trim();
    } else {
      // multipart/form-data
      const fd = await req.formData();

      fullName = safeStr(fd.get("fullName"));
      email = safeStr(fd.get("email"));
      phone = safeStr(fd.get("phone"));
      eventType = safeStr(fd.get("eventType"));
      location = safeStr(fd.get("location"));
      notes = safeStr(fd.get("notes"));
      startIso = safeStr(fd.get("startIso"));
      endIso = safeStr(fd.get("endIso"));
      timezone = safeStr(fd.get("timezone")) || "America/Vancouver";

      // NEW
      attendees = safeInt(fd.get("attendees"));
      boothDetails = safeStr(fd.get("boothDetails"));
      privateLocation = safeStr(fd.get("privateLocation"));

      const f = fd.get("referenceImage");
      if (f instanceof File && f.size > 0) {
        referenceFile = f;
      }
    }

    // ---- Validation ----
    if (!fullName) return bad("Full name is required");
    if (!email || !email.includes("@")) return bad("Valid email is required");
    if (!eventType) return bad("Event type is required");
    if (!startIso || isNaN(Date.parse(startIso))) return bad("Valid start time required");
    if (!endIso || isNaN(Date.parse(endIso))) return bad("Valid end time required");
    if (new Date(endIso) <= new Date(startIso)) return bad("End must be after start");

    // NEW: conditional validation
    const isEvent = eventType === "Event";
    const isPrivate = eventType === "Private";

    if (!isEvent && !isPrivate) return bad("Invalid type selected");

    if (attendees == null || attendees < 1) return bad("Number of attendees is required");

    if (isEvent) {
      // Event requires free-text location + booth details
      if (!location) return bad("Location is required for events");
      if (!boothDetails) return bad("Booth arrangement details are required for events");
    }

    if (isPrivate) {
      // Private requires dropdown location
      if (!privateLocation) return bad("Location is required for private appointments");
      const allowed = new Set(["Commons", "Kelowna Islamic Centre"]);
      if (!allowed.has(privateLocation)) return bad("Invalid private location selected");
      // Store into location field so DB stays same
      location = privateLocation;
    }

    if (!process.env.RESEND_API_KEY) return bad("Missing RESEND_API_KEY", 500);
    if (!process.env.APP_URL) return bad("Missing APP_URL", 500);

    const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER; // fallback
    if (!notifyTo) return bad("Missing BOOKING_NOTIFY_EMAIL", 500);

    const from = process.env.RESEND_FROM || "Saadia's Henna Art <onboarding@resend.dev>";

    // ---- Normalize notes (store new fields inside notes to avoid Prisma schema change) ----
    const metaLines: string[] = [];
    metaLines.push(`Attendees: ${attendees}`);

    if (isEvent) {
      metaLines.push(`Booth setup details: ${boothDetails}`);
    }

    const combinedNotes = [metaLines.join("\n"), notes].filter(Boolean).join("\n\n").trim();

    // ---- Create booking ----
    const confirmToken = crypto.randomBytes(24).toString("hex");

    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        eventType,
        location: location || null,
        notes: combinedNotes || null,
        startIso,
        endIso,
        timezone,
        confirmToken,
      },
    });

    const confirmLink = `${process.env.APP_URL}/api/bookings/confirm?token=${confirmToken}`;

    // ---- Optional attachment (NOT saved anywhere) ----
    let attachments:
      | Array<{ filename: string; content: string; contentType?: string }>
      | undefined = undefined;

    if (referenceFile) {
      if (!referenceFile.type.startsWith("image/")) {
        return bad("Reference image must be an image file");
      }

      const MAX = 5 * 1024 * 1024; // 5MB
      if (referenceFile.size > MAX) {
        return bad("Reference image is too large (max 5MB)");
      }

      const buf = Buffer.from(await referenceFile.arrayBuffer());
      attachments = [
        {
          filename: referenceFile.name || "reference-image",
          content: buf.toString("base64"),
          contentType: referenceFile.type,
        },
      ];
    }

    // ---- Email admin ----
    const sendResult = await resend.emails.send({
      from,
      to: notifyTo,
      subject: `New booking request: ${booking.fullName} (${booking.eventType})`,
      replyTo: booking.email,
      attachments,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.4">
          <h2>New Booking Request</h2>
          <p><b>Name:</b> ${escapeHtml(booking.fullName)}</p>
          <p><b>Email:</b> ${escapeHtml(booking.email)}</p>
          ${booking.phone ? `<p><b>Instagram:</b> ${escapeHtml(booking.phone)}</p>` : ""}
          <p><b>Type:</b> ${escapeHtml(booking.eventType)}</p>

          ${booking.location ? `<p><b>Location:</b> ${escapeHtml(booking.location)}</p>` : ""}

          <p><b>Number of attendees:</b> ${attendees}</p>

          ${
            isEvent
              ? `<p><b>Booth setup details:</b><br/>${escapeHtml(boothDetails).replace(/\n/g, "<br/>")}</p>`
              : ""
          }

          <p><b>Start:</b> ${escapeHtml(booking.startIso)} (${escapeHtml(booking.timezone)})</p>
          <p><b>End:</b> ${escapeHtml(booking.endIso)} (${escapeHtml(booking.timezone)})</p>

          ${
            booking.notes
              ? `<p><b>Notes:</b><br/>${escapeHtml(booking.notes).replace(/\n/g, "<br/>")}</p>`
              : ""
          }

          <p><b>Reference image:</b> ${attachments ? "Attached ✅" : "None"}</p>
          <hr/>
          <p>Click to confirm this booking:</p>
          <p>
            <a href="${confirmLink}"
               style="display:inline-block;padding:12px 16px;background:#3f2119;color:#f6ead2;border-radius:10px;text-decoration:none;font-weight:bold">
              Confirm Booking
            </a>
          </p>
          <p style="font-size:12px;color:#666">If you didn’t expect this email, ignore it.</p>
        </div>
      `,
    });

    // @ts-ignore
    if (sendResult?.error) {
      // @ts-ignore
      throw new Error(sendResult.error.message || "Failed to send email");
    }

    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e: any) {
    console.error(e);
    return bad(e?.message || "Server error", 500);
  }
}