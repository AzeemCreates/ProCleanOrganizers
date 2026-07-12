// Single source of truth for ProClean Organizers site copy, prices, and photos.
// The owner edits this content through /admin - no code changes needed.
//
// Storage is environment-aware:
//   - Cloudflare (production): content lives in a KV namespace bound as SITE_CONTENT.
//     Reads: kv.get("site-content"). Writes: kv.put("site-content", json).
//     Seed the KV once with: wrangler kv:key put --namespace-id=<id> "site-content" --path=data/site-content.seed.json
//   - Local dev (Node): falls back to the filesystem.
//     data/site-content.seed.json is the committed starting point.
//     data/site-content.runtime.json (gitignored) is created on first admin save.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import seedJson from "../../data/site-content.seed.json";
import { getCloudflareEnv } from "./cloudflare-env";

const serviceSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  session: z.string().trim().min(1).max(60),
});

const serviceCategorySchema = z.object({
  category: z.string().trim().min(1).max(120),
  image: z.string().trim().min(1).default("/uploads/placeholder-photo.svg"),
  services: z.array(serviceSchema).min(1),
});

const methodStepSchema = z.object({
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().min(1).max(300),
});

const packageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(300),
  includes: z.array(z.string().trim().min(1).max(200)).min(1),
});

const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(120),
  scope: z.string().trim().min(1).max(200),
  before: z.string().trim().min(1),
  after: z.string().trim().min(1),
  notes: z.string().trim().min(1).max(600),
});

export const siteContentSchema = z.object({
  business: z.object({
    name: z.string().trim().min(1).max(120),
    slogan: z.string().trim().min(1).max(120),
    owner: z.string().trim().min(1).max(120),
    established: z.number().int().min(1900).max(2100),
    phone: z.string().trim().min(1).max(40),
    email: z.string().trim().email().max(255),
    serviceAreaSummary: z.string().trim().min(1).max(500),
  }),
  mission: z.string().trim().min(1).max(1000),
  images: z.object({
    logo: z.string().trim().min(1),
    logoFull: z.string().trim().min(1),
  }),
  sustainabilityImage: z.string().trim().min(1).default("/uploads/placeholder-photo.svg"),
  methodSteps: z.array(methodStepSchema).min(1),
  serviceCategories: z.array(serviceCategorySchema).min(1),
  packages: z.array(packageSchema).min(1),
  portfolioProjects: z.array(portfolioProjectSchema),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

// Derived, computed fields that used to be hand-maintained in the old static
// file (tel:/mailto: hrefs, flat service name list). Kept as helpers so the
// owner only ever edits the plain phone/email/service fields.
export function withDerived(content: SiteContent) {
  return {
    ...content,
    business: {
      ...content.business,
      phoneHref: `tel:+1${content.business.phone.replace(/\D/g, "")}`,
      emailHref: `mailto:${content.business.email}`,
    },
    allServiceNames: content.serviceCategories.flatMap((c) => c.services.map((s) => s.name)),
  };
}

export type DerivedSiteContent = ReturnType<typeof withDerived>;

const RUNTIME_PATH = "data/site-content.runtime.json";
const KV_KEY = "site-content";

// ---------------------------------------------------------------------------
// Storage adapter: Cloudflare KV when available, Node filesystem otherwise.
// ---------------------------------------------------------------------------

/** Returns the SITE_CONTENT KV namespace if running on Cloudflare, else null. */
async function getKV(): Promise<{ get(k: string): Promise<string | null>; put(k: string, v: string): Promise<void> } | null> {
  const cfEnv = await getCloudflareEnv();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cfEnv?.SITE_CONTENT as any) ?? null;
}

// Bundled at build time — always available, even on Cloudflare Workers where
// there is no filesystem to read data/site-content.seed.json from at runtime.
const BUNDLED_SEED = seedJson as unknown;

/** Reads data/site-content.runtime.json from disk. Only works in Node (local dev). */
async function readRuntimeFromDisk(): Promise<unknown | null> {
  try {
    const { access, readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const { constants } = await import("node:fs");
    const runtimeAbs = join(process.cwd(), RUNTIME_PATH);
    const hasRuntime = await access(runtimeAbs, constants.F_OK).then(() => true, () => false);
    if (!hasRuntime) return null;
    const raw = await readFile(runtimeAbs, "utf-8");
    return JSON.parse(raw);
  } catch {
    // No filesystem access (e.g. Cloudflare Workers) — caller falls back to bundled seed.
    return null;
  }
}

async function loadContent(): Promise<SiteContent> {
  const kv = await getKV();
  if (kv) {
    const raw = await kv.get(KV_KEY);
    if (raw) return siteContentSchema.parse(JSON.parse(raw));
    // KV is empty (first deploy before seeding) — fall back to bundled seed.
    return siteContentSchema.parse(BUNDLED_SEED);
  }

  // No KV binding: local Node dev uses the on-disk runtime file if present,
  // otherwise (including Cloudflare with no KV configured yet) use the bundled seed.
  const runtime = await readRuntimeFromDisk();
  return siteContentSchema.parse(runtime ?? BUNDLED_SEED);
}

async function saveContent(data: SiteContent): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.put(KV_KEY, JSON.stringify(data));
    return;
  }
  // Local Node dev: write runtime file. On Cloudflare without KV, this is a
  // no-op fs write that fails silently — admin saves won't persist until KV is wired up.
  try {
    const { writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    await writeFile(join(process.cwd(), RUNTIME_PATH), JSON.stringify(data, null, 2) + "\n", "utf-8");
  } catch {
    // No filesystem access — nothing we can do until SITE_CONTENT KV is bound.
  }
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

/** Reads the live site content fresh on every call — no rebuild needed to see edits. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const content = await loadContent();
  return withDerived(content);
});

/** Raw content (no derived hrefs) — used to seed the admin edit form. */
export const getRawSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  return loadContent();
});

/** Overwrites the live site content. Callers must have already checked the admin session. */
export const writeSiteContent = createServerFn({ method: "POST" })
  .validator((data: unknown) => siteContentSchema.parse(data))
  .handler(async ({ data }) => {
    await saveContent(data);
    return withDerived(data);
  });
