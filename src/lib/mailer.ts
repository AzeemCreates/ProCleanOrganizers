// Sends the contact/booking form notification email over real SMTP.
//
// Cloudflare Workers cannot use nodemailer's SMTP transport (it depends on
// Node's raw `net`/`tls` sockets in a way `nodejs_compat` does not polyfill -
// see https://github.com/nodemailer/nodemailer/issues/1621). Instead we use
// `worker-mailer`, which speaks SMTP directly over Cloudflare's native TCP
// Sockets API (`cloudflare:sockets`), gated behind the same `nodejs_compat`
// flag already set in wrangler.toml. This only runs in a real Workers
// runtime (deployed, or `wrangler pages dev`) - plain `vite dev` (Node) has
// no `cloudflare:sockets` and cannot send mail locally.
//
// Configure with env vars - see .env.example. Defaults to Gmail's SMTP
// (smtp.gmail.com:587) when only SMTP_USER/SMTP_PASS are set (the common
// case: a Gmail address + an App Password from
// https://myaccount.google.com/apppasswords), or uses an explicit SMTP_HOST
// for any other provider.

import { getRawSiteContent } from "@/lib/site-content";
import { getEnvVar } from "@/lib/cloudflare-env";

type ContactSubmission = {
  formType: "contact" | "booking";
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredTimes: string;
  message: string;
};

export async function sendContactNotification(submission: ContactSubmission) {
  const SMTP_USER = getEnvVar("SMTP_USER");
  const SMTP_PASS = getEnvVar("SMTP_PASS");

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP_USER / SMTP_PASS are not set - contact form emails are disabled. See .env.example.",
    );
  }

  const SMTP_HOST = getEnvVar("SMTP_HOST") || "smtp.gmail.com";
  const SMTP_PORT = Number(getEnvVar("SMTP_PORT") || "587");
  const from = getEnvVar("SMTP_FROM") || SMTP_USER;

  const content = await getRawSiteContent();
  const to = getEnvVar("CONTACT_TO_EMAIL") || content.business.email;

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

  // Dynamic import, not a top-level one: worker-mailer's own module touches
  // `cloudflare:sockets` as soon as it's loaded, which doesn't exist under
  // plain Node (`vite dev`). A top-level import crashed EVERY route in local
  // dev, not just the contact form, because the whole module graph got
  // evaluated on server start. Deferring the import until a submission
  // actually needs to send keeps local dev working for everything else;
  // real sending still only works under a real Workers runtime (deployed,
  // or `wrangler pages dev`), which is the documented limitation above.
  const { WorkerMailer } = await import("worker-mailer");

  const implicitTls = SMTP_PORT === 465;
  const mailer = await WorkerMailer.connect({
    credentials: { username: SMTP_USER, password: SMTP_PASS },
    authType: "plain",
    host: SMTP_HOST,
    port: SMTP_PORT,
    // Port 465 uses TLS from the start of the connection; port 587 (Gmail's
    // default, and most providers') connects in plaintext and upgrades via
    // STARTTLS - only one of these should be set, not both.
    secure: implicitTls,
    startTls: !implicitTls,
  });

  try {
    await mailer.send({
      from: { email: from },
      to: { email: to },
      reply: { email: submission.email },
      subject,
      text: lines.join("\n"),
    });
  } finally {
    await mailer.close();
  }
}
