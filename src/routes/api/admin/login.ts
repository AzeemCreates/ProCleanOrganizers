import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { checkPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/admin-auth";

const loginSchema = z.object({ password: z.string().min(1) });

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
        }

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "Password required" }, { status: 400 });
        }

        let valid: boolean;
        try {
          valid = await checkPassword(parsed.data.password);
        } catch (err) {
          console.error("[admin:login]", err);
          return Response.json(
            { ok: false, error: "Admin login is not configured. Set ADMIN_PASSWORD in .env." },
            { status: 500 },
          );
        }

        if (!valid) {
          return Response.json({ ok: false, error: "Incorrect password" }, { status: 401 });
        }

        const token = await createSessionToken();
        const maxAge = 30 * 24 * 60 * 60;
        return Response.json(
          { ok: true },
          {
            headers: {
              "set-cookie": `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
            },
          },
        );
      },
    },
  },
});
