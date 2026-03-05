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

export async function POST(req: Request) {
  try {
    // ---- Parse either JSON (old) or multipart FormData (new) ----
    const contentType = req.headers.get("content-type") || "";

    let fullName = "";
    let email = "";
    let phone = "";
    let eventType = "";
    let location = "";
    let notes = "";
    let startIso = "";
    let endIso = "";
    let timezone = "America/Vancouver";

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
    } else {
      // New: multipart/form-data
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

    if (!process.env.RESEND_API_KEY) return bad("Missing RESEND_API_KEY", 500);
    if (!process.env.APP_URL) return bad("Missing APP_URL", 500);

    const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER; // fallback
    if (!notifyTo) return bad("Missing BOOKING_NOTIFY_EMAIL", 500);

    const from = process.env.RESEND_FROM || "Saadia's Henna Art <onboarding@resend.dev>";

    // ---- Create booking (still saved) ----
    const confirmToken = crypto.randomBytes(24).toString("hex");

    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        eventType,
        location: location || null,
        notes: notes || null,
        startIso,
        endIso,
        timezone,
        confirmToken,
      },
    });

    const confirmLink = `${process.env.APP_URL}/api/bookings/confirm?token=${confirmToken}`;

    // ---- Build optional attachment (NOT saved anywhere) ----
    let attachments:
      | Array<{ filename: string; content: string; contentType?: string }>
      | undefined = undefined;

    if (referenceFile) {
      // Safety checks
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

    // ---- Email admin (with optional image attachment) ----
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
          ${booking.phone ? `<p><b>Phone:</b> ${escapeHtml(booking.phone)}</p>` : ""}
          <p><b>Type:</b> ${escapeHtml(booking.eventType)}</p>
          ${booking.location ? `<p><b>Location:</b> ${escapeHtml(booking.location)}</p>` : ""}
          <p><b>Start:</b> ${escapeHtml(booking.startIso)} (${escapeHtml(booking.timezone)})</p>
          <p><b>End:</b> ${escapeHtml(booking.endIso)} (${escapeHtml(booking.timezone)})</p>
          ${booking.notes ? `<p><b>Notes:</b> ${escapeHtml(booking.notes).replace(/\n/g, "<br/>")}</p>` : ""}
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