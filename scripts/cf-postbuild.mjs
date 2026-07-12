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

// Create _worker.js — Cloudflare Pages picks this up automatically
writeFileSync(
  join(clientDir, "_worker.js"),
  `import worker from './_server/server.js';\nexport default worker;\n`,
);

console.log("✓ Cloudflare Pages _worker.js written to dist/client/");
