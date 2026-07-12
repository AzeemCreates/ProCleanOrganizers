import { createFileRoute } from "@tanstack/react-router";
import { requireAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authenticated = await requireAdminSession(request);
        return Response.json({ authenticated });
      },
    },
  },
});
