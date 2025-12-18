import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTransport, fromAddress } from "@/lib/mailer";
import { makeIcs } from "@/lib/ics";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { confirmToken: token } });
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
  }

  if (booking.status === "CONFIRMED") {
    // Already confirmed; show a friendly page
    return NextResponse.redirect(new URL(`/book/confirmed?id=${booking.id}`, req.url));
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });

  const transporter = getTransport();

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

  // Email the requester
  await transporter.sendMail({
    from: fromAddress(),
    to: updated.email,
    subject: "Your henna booking is confirmed ✅",
    html: commonHtml,
    attachments: [
      {
        filename: "saadia-henna-booking.ics",
        content: ics,
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  });

  // Email Saadia too
  await transporter.sendMail({
    from: fromAddress(),
    to: process.env.SMTP_USER,
    subject: `Confirmed: ${updated.fullName} (${updated.eventType}) ✅`,
    html: commonHtml,
    attachments: [
      {
        filename: "saadia-henna-booking.ics",
        content: ics,
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  });

  // Redirect Saadia to a nice “confirmed” page
  return NextResponse.redirect(new URL(`/book/confirmed?id=${updated.id}`, req.url));
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
