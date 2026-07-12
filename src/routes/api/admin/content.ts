import { createFileRoute } from "@tanstack/react-router";
import { requireAdminSession } from "@/lib/admin-auth";
import { getRawSiteContent, siteContentSchema, writeSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/api/admin/content")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await requireAdminSession(request))) {
          return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
        }
        const content = await getRawSiteContent();
        return Response.json({ ok: true, content });
      },
      POST: async ({ request }) => {
        if (!(await requireAdminSession(request))) {
          return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = siteContentSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        await writeSiteContent({ data: parsed.data });
        return Response.json({ ok: true });
      },
    },
  },
});
