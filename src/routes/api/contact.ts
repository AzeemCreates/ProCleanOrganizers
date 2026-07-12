import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sendContactNotification } from "@/lib/mailer";

const submissionSchema = z.object({
  formType: z.enum(["contact", "booking"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().max(160).optional().default(""),
  preferredTimes: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().min(1).max(2000),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = submissionSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const data = parsed.data;

        console.log("[proclean:contact] new submission", {
          formType: data.formType,
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          preferredTimes: data.preferredTimes,
          messagePreview: data.message.slice(0, 120),
          at: new Date().toISOString(),
        });

        // Email delivery is best-effort: a submission is still recorded above
        // (and can be read from server logs) even if SMTP isn't configured or
        // is temporarily unreachable, so the visitor never sees a false error.
        try {
          await sendContactNotification(data);
        } catch (err) {
          console.error("[proclean:contact] email notification failed", err);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
