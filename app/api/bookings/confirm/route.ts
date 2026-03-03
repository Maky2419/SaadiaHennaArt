import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeIcs } from "@/lib/ics";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { confirmToken: token } });
    if (!booking) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
    }

    // If already confirmed, just redirect
    if (booking.status === "CONFIRMED") {
      return NextResponse.redirect(new URL(`/book/confirmed?id=${booking.id}`, req.url));
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    });

    // Build ICS
    const ics = makeIcs({
      uid: updated.id,
      title: "Henna Appointment - Saadia Henna Art",
      description: `Booking confirmed for ${updated.fullName} (${updated.eventType}).`,
      location: updated.location || "TBD",
      startIso: updated.startIso,
      endIso: updated.endIso,
    });

    const commonHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.4">
        <h2>Booking Confirmed ✅</h2>
        <p><b>Name:</b> ${escapeHtml(updated.fullName)}</p>
        <p><b>Type:</b> ${escapeHtml(updated.eventType)}</p>
        ${updated.location ? `<p><b>Location:</b> ${escapeHtml(updated.location)}</p>` : ""}
        <p><b>Start:</b> ${escapeHtml(updated.startIso)}</p>
        <p><b>End:</b> ${escapeHtml(updated.endIso)}</p>
        <p>Attached is an “Add to Calendar” invite (.ics).</p>
      </div>
    `;

    // Redirect URL (we will always return this even if email fails)
    const redirectUrl = new URL(`/book/confirmed?id=${updated.id}`, req.url);

    // Send emails (don’t block the redirect if something goes wrong)
    try {
      if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
      const from = process.env.RESEND_FROM || "Saadia's Henna Art <onboarding@resend.dev>";
      const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER;

      // Resend attachments must be base64
      const icsBase64 = Buffer.from(ics, "utf8").toString("base64");

      // Email the requester
      await resend.emails.send({
        from,
        to: updated.email,
        subject: "Your henna booking is confirmed ✅",
        html: commonHtml,
        attachments: [
          {
            filename: "saadia-henna-booking.ics",
            content: icsBase64,
          },
        ],
      });

      // Email Saadia too
      if (notifyTo) {
        await resend.emails.send({
          from,
          to: notifyTo,
          subject: `Confirmed: ${updated.fullName} (${updated.eventType}) ✅`,
          html: commonHtml,
          attachments: [
            {
              filename: "saadia-henna-booking.ics",
              content: icsBase64,
            },
          ],
        });
      }
    } catch (emailErr) {
      console.error("Confirm email failed:", emailErr);
      // still redirect
    }

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}