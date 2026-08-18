import { createFileRoute } from "@tanstack/react-router";
import { requireAdminSession } from "@/lib/admin-auth";

// Cloudflare Pages Workers have no writable, persistent filesystem, so admin
// uploads can't be saved as files on disk the way local Node dev could. We
// return the photo as a data: URI instead, which the admin editor stores
// directly in the site content record — riding on the same KV persistence
// every other piece of content already uses, with no separate file storage
// (R2, etc.) to provision. Works identically in local dev and production.
const MAX_BYTES = 5 * 1024 * 1024; // 5MB (keeps embedded photos well under KV's 25MB per-value cap)
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await requireAdminSession(request))) {
          return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
        }

        let formData: FormData;
        try {
          formData = await request.formData();
        } catch {
          return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
        }

        const file = formData.get("file");
        if (!(file instanceof File)) {
          return Response.json({ ok: false, error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.has(file.type)) {
          return Response.json(
            { ok: false, error: "Only JPEG, PNG, WEBP, or GIF photos are allowed" },
            { status: 400 },
          );
        }

        if (file.size > MAX_BYTES) {
          return Response.json({ ok: false, error: "Photo is too large (5MB max)" }, { status: 400 });
        }

        const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        return Response.json({ ok: true, url: `data:${file.type};base64,${base64}` });
      },
    },
  },
});
