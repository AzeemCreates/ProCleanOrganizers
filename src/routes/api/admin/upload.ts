import { createFileRoute } from "@tanstack/react-router";
import { requireAdminSession } from "@/lib/admin-auth";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

        const ext = ALLOWED_TYPES[file.type];
        if (!ext) {
          return Response.json(
            { ok: false, error: "Only JPEG, PNG, WEBP, or GIF photos are allowed" },
            { status: 400 },
          );
        }

        if (file.size > MAX_BYTES) {
          return Response.json({ ok: false, error: "Photo is too large (8MB max)" }, { status: 400 });
        }

        const { randomUUID } = await import("node:crypto");
        const { mkdir, writeFile } = await import("node:fs/promises");
        const { join } = await import("node:path");

        const uploadsDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const filename = `${randomUUID()}.${ext}`;
        const bytes = Buffer.from(await file.arrayBuffer());
        await writeFile(join(uploadsDir, filename), bytes);

        return Response.json({ ok: true, url: `/uploads/${filename}` });
      },
    },
  },
});
