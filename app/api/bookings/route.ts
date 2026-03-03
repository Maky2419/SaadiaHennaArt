import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const eventType = String(body.eventType || "").trim(); // "Event" | "Private"
    const location = String(body.location || "").trim();
    const notes = String(body.notes || "").trim();
    const startIso = String(body.startIso || "").trim();
    const endIso = String(body.endIso || "").trim();
    const timezone = String(body.timezone || "America/Vancouver").trim();

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

    // Send notification email to Saadia (you)
    const sendResult = await resend.emails.send({
      from,
      to: notifyTo,
      subject: `New booking request: ${booking.fullName} (${booking.eventType})`,
      replyTo: booking.email, // so you can reply directly to the client
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.4">
          <h2>New Booking Request</h2>
          <p><b>Name:</b> ${escapeHtml(booking.fullName)}</p>
          <p><b>Email:</b> ${escapeHtml(booking.email)}</p>
          ${booking.phone ? `<p><b>Phone:</b> ${escapeHtml(booking.phone)}</p>` : ""}
          <p><b>Type:</b> ${escapeHtml(booking.eventType)}</p>
          ${booking.location ? `<p><b>Location:</b> ${escapeHtml(booking.location)}</p>` : ""}
          <p><b>Start:</b> ${escapeHtml(booking.startIso)}</p>
          <p><b>End:</b> ${escapeHtml(booking.endIso)}</p>
          ${booking.notes ? `<p><b>Notes:</b> ${escapeHtml(booking.notes)}</p>` : ""}
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

    // If Resend returns an error object, surface it
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

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}