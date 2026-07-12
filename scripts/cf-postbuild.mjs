/**
 * Post-build step for Cloudflare Pages deployment.
 *
 * Cloudflare Pages expects:
 *   dist/client/            ← static assets (pages_build_output_dir)
 *   dist/client/_worker.js  ← Worker entry point for SSR
 *
 * TanStack Start outputs the SSR bundle to dist/server/. We copy it into
 * dist/client/_server/ and create a thin _worker.js that re-exports it.
 * The relative imports inside server.js (./assets/...) still resolve
 * correctly because the assets folder travels with it.
 */

import { cpSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = "dist/client";
const serverDir = "dist/server";
const serverDest = join(clientDir, "_server");

if (!existsSync(serverDir)) {
  console.error("dist/server not found — run vite build first");
  process.exit(1);
}

// Copy the entire server bundle into dist/client/_server/
cpSync(serverDir, serverDest, { recursive: true });

// Create _worker.js — Cloudflare Pages picks this up automatically.
// Static asset requests (JS/CSS/images) are delegated to Cloudflare's
// built-in asset server (env.ASSETS) first; only unmatched requests
// (page routes, API routes) fall through to the SSR handler. Without this,
// a custom _worker.js disables Pages' automatic static file serving and
// every asset request 404s/500s through the SSR handler instead.
writeFileSync(
  join(clientDir, "_worker.js"),
  `import worker from './_server/server.js';

export default {
  async fetch(request, env, ctx) {
    // Expose Cloudflare bindings (secrets like ADMIN_PASSWORD, KV namespaces
    // like SITE_CONTENT) to the app. Cloudflare hands them to us here as 'env';
    // the app reads them back via globalThis in src/lib/cloudflare-env.ts.
    // These bindings are identical for every request in a deployment, so
    // stashing them on the global is safe (not request-specific data).
    globalThis.__CF_ENV__ = env;

    // Only GET/HEAD requests can be static files. POST/PUT/etc (API routes,
    // form submissions) always go straight to SSR. Cloudflare's asset server
    // returns 405 (not 404) for non-GET methods, so routing those through it
    // first would incorrectly short-circuit before ever reaching the app.
    if (env.ASSETS && (request.method === "GET" || request.method === "HEAD")) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }
    return worker.fetch(request, env, ctx);
  },
};
`,
);

console.log("✓ Cloudflare Pages _worker.js written to dist/client/");
