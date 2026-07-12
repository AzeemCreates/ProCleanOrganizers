// Sends the contact/booking form notification email via SMTP (nodemailer).
// Configure with env vars - see .env.example. Defaults to Gmail's SMTP when
// only SMTP_USER/SMTP_PASS are set (the common case: a Gmail address + an
// App Password), or uses an explicit SMTP_HOST for any other provider.

import { getRawSiteContent } from "@/lib/site-content";

type ContactSubmission = {
  formType: "contact" | "booking";
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredTimes: string;
  message: string;
};

async function getTransport() {
  const nodemailer = await import("nodemailer");
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP_USER / SMTP_PASS are not set - contact form emails are disabled. See .env.example.",
    );
  }

  if (SMTP_HOST) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  // No host configured - assume Gmail (SMTP_USER is a gmail address with an
  // App Password, per https://myaccount.google.com/apppasswords).
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactNotification(submission: ContactSubmission) {
  const transport = await getTransport();
  const content = await getRawSiteContent();
  const to = process.env.CONTACT_TO_EMAIL || content.business.email;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const subject =
    submission.formType === "booking"
      ? `New booking request from ${submission.name}`
      : `New contact message from ${submission.name}`;

  const lines = [
    `Type: ${submission.formType}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone && `Phone: ${submission.phone}`,
    submission.service && `Service: ${submission.service}`,
    submission.preferredTimes && `Preferred times: ${submission.preferredTimes}`,
    "",
    submission.message,
  ].filter(Boolean);

  await transport.sendMail({
    to,
    from,
    replyTo: submission.email,
    subject,
    text: lines.join("\n"),
  });
}
