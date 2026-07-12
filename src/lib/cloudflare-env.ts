// Reads env vars/bindings from the Cloudflare Worker context when deployed
// there, falling back to process.env for local Node dev. Cloudflare Pages
// does not reliably populate process.env from dashboard-configured
// variables/secrets, so this reads them from the request event's
// context.cloudflare.env instead (the same object that carries KV bindings).

export async function getCloudflareEnv(): Promise<Record<string, unknown> | null> {
  try {
    const { getEvent } = await import("vinxi/http");
    const event = getEvent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event?.context as any)?.cloudflare?.env ?? null;
  } catch {
    return null;
  }
}

export async function getEnvVar(name: string): Promise<string | undefined> {
  const cfEnv = await getCloudflareEnv();
  if (cfEnv && typeof cfEnv[name] === "string") return cfEnv[name] as string;
  return process.env[name];
}
