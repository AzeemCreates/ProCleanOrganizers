import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    // Redirect TanStack Start's bundled server entry to src/server.ts
    // (our SSR error wrapper). nitro builds the server from this.
    tanstackStart({
      server: { entry: "server" },
      target: "cloudflare-pages",
    }),
    viteReact(),
  ],
});
