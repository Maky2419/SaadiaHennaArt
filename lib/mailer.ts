import nodemailer from "nodemailer";

export function getTransport() {
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || "465");
  const secure = (process.env.SMTP_SECURE || "true") === "true";
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function fromAddress() {
  return process.env.MAIL_FROM || process.env.SMTP_USER!;
}
