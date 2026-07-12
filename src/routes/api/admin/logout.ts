import { createFileRoute } from "@tanstack/react-router";
import { SESSION_COOKIE_NAME } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { ok: true },
          {
            headers: {
              "set-cookie": `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
            },
          },
        );
      },
    },
  },
});
