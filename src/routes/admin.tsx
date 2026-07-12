import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Loader2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Site Admin - ProClean Organizers" }],
  }),
  component: AdminPage,
});

type LoadState = "checking" | "login" | "loading" | "ready";

function AdminPage() {
  const [state, setState] = useState<LoadState>("checking");
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/session");
      const data = (await res.json()) as { authenticated: boolean };
      setState(data.authenticated ? "loading" : "login");
    })();
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    (async () => {
      const res = await fetch("/api/admin/content");
      if (res.status === 401) {
        setState("login");
        return;
      }
      const data = (await res.json()) as { ok: boolean; content?: SiteContent };
      if (data.ok && data.content) {
        setContent(data.content);
        setState("ready");
      } else {
        toast.error("Could not load site content");
      }
    })();
  }, [state]);

  if (state === "checking" || state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "login") {
    return <LoginScreen onSuccess={() => setState("loading")} />;
  }

  if (!content) return null;

  return <Editor initial={content} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-lg font-bold text-foreground">Site Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to edit the site.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
              });
              const data = (await res.json()) as { ok: boolean; error?: string };
              if (!res.ok || !data.ok) {
                toast.error(data.error ?? "Login failed");
                return;
              }
              onSuccess();
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <Button type="submit" className="w-full font-bold" disabled={busy}>
            {busy ? "Checking..." : "Log In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Editor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function update(updater: (c: SiteContent) => SiteContent) {
    setContent((c) => updater(c));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Saved. Your site is now updated.");
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-6">
        <div>
          <h1 className="text-base font-bold text-foreground">Site Admin</h1>
          <p className="text-xs text-muted-foreground">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={logout} type="button">
            Log Out
          </Button>
          <Button onClick={save} disabled={saving || !dirty} className="font-bold">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Tabs defaultValue="business">
          <TabsList className="flex-wrap">
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Packages</TabsTrigger>
            <TabsTrigger value="method">Method Steps</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Photos</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <BusinessTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="mission">
            <MissionTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="method">
            <MethodTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="portfolio">
            <PortfolioTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="homepage">
            <HomepageTab content={content} update={update} />
          </TabsContent>
          <TabsContent value="logo">
            <LogoTab content={content} update={update} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

type TabProps = {
  content: SiteContent;
  update: (updater: (c: SiteContent) => SiteContent) => void;
};

function BusinessTab({ content, update }: TabProps) {
  const b = content.business;
  const field = (key: keyof SiteContent["business"]) => ({
    value: String(b[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      update((c) => ({
        ...c,
        business: {
          ...c.business,
          [key]: key === "established" ? Number(e.target.value) || 0 : e.target.value,
        },
      })),
  });

  return (
    <Card className="mt-4 space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <Input {...field("name")} />
        </div>
        <div className="space-y-2">
          <Label>Slogan</Label>
          <Input {...field("slogan")} />
        </div>
        <div className="space-y-2">
          <Label>Owner Name</Label>
          <Input {...field("owner")} />
        </div>
        <div className="space-y-2">
          <Label>Established Year</Label>
          <Input type="number" {...field("established")} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input {...field("phone")} placeholder="(609) 359-3992" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...field("email")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Service Area Summary</Label>
        <Textarea
          rows={3}
          value={b.serviceAreaSummary}
          onChange={(e) =>
            update((c) => ({
              ...c,
              business: { ...c.business, serviceAreaSummary: e.target.value },
            }))
          }
        />
      </div>
    </Card>
  );
}

function MissionTab({ content, update }: TabProps) {
  return (
    <Card className="mt-4 space-y-2 p-6">
      <Label>Mission Statement</Label>
      <p className="text-xs text-muted-foreground">Shown on the About page.</p>
      <Textarea
        rows={6}
        value={content.mission}
        onChange={(e) => update((c) => ({ ...c, mission: e.target.value }))}
      />
    </Card>
  );
}

function MethodTab({ content, update }: TabProps) {
  return (
    <Card className="mt-4 space-y-4 p-6">
      <p className="text-sm text-muted-foreground">
        The step-by-step method shown on the Home and About pages.
      </p>
      {content.methodSteps.map((step, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-4">
          <div className="flex items-center justify-between">
            <Label>Step {i + 1}</Label>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                update((c) => ({
                  ...c,
                  methodSteps: c.methodSteps.filter((_, idx) => idx !== i),
                }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Input
            value={step.name}
            placeholder="Step name"
            onChange={(e) =>
              update((c) => ({
                ...c,
                methodSteps: c.methodSteps.map((s, idx) =>
                  idx === i ? { ...s, name: e.target.value } : s,
                ),
              }))
            }
          />
          <Textarea
            rows={2}
            value={step.description}
            placeholder="Description"
            onChange={(e) =>
              update((c) => ({
                ...c,
                methodSteps: c.methodSteps.map((s, idx) =>
                  idx === i ? { ...s, description: e.target.value } : s,
                ),
              }))
            }
          />
        </div>
      ))}
      <Button
        variant="outline"
        type="button"
        onClick={() =>
          update((c) => ({
            ...c,
            methodSteps: [...c.methodSteps, { name: "New Step", description: "" }],
          }))
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Step
      </Button>
    </Card>
  );
}

function ServicesTab({ content, update }: TabProps) {
  return (
    <div className="mt-4 space-y-4">
      {content.serviceCategories.map((cat, ci) => (
        <Card key={ci} className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-2">
            <Input
              className="max-w-sm text-lg font-bold"
              value={cat.category}
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  serviceCategories: c.serviceCategories.map((cc, idx) =>
                    idx === ci ? { ...cc, category: e.target.value } : cc,
                  ),
                }))
              }
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                update((c) => ({
                  ...c,
                  serviceCategories: c.serviceCategories.filter((_, idx) => idx !== ci),
                }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <PhotoUploadField
              label={ci < 3 ? "Category Photo (shown on homepage)" : "Category Photo"}
              url={cat.image}
              onChange={(url) =>
                update((c) => ({
                  ...c,
                  serviceCategories: c.serviceCategories.map((cc, idx) =>
                    idx === ci ? { ...cc, image: url } : cc,
                  ),
                }))
              }
            />
          </div>

          {cat.services.map((s, si) => (
            <div key={si} className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr_1fr_140px_auto]">
              <Input
                value={s.name}
                placeholder="Service name"
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    serviceCategories: c.serviceCategories.map((cc, idx) =>
                      idx === ci
                        ? {
                            ...cc,
                            services: cc.services.map((ss, sidx) =>
                              sidx === si ? { ...ss, name: e.target.value } : ss,
                            ),
                          }
                        : cc,
                    ),
                  }))
                }
              />
              <Input
                value={s.description}
                placeholder="Description"
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    serviceCategories: c.serviceCategories.map((cc, idx) =>
                      idx === ci
                        ? {
                            ...cc,
                            services: cc.services.map((ss, sidx) =>
                              sidx === si ? { ...ss, description: e.target.value } : ss,
                            ),
                          }
                        : cc,
                    ),
                  }))
                }
              />
              <Input
                value={s.session}
                placeholder="e.g. 2 to 4 hours"
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    serviceCategories: c.serviceCategories.map((cc, idx) =>
                      idx === ci
                        ? {
                            ...cc,
                            services: cc.services.map((ss, sidx) =>
                              sidx === si ? { ...ss, session: e.target.value } : ss,
                            ),
                          }
                        : cc,
                    ),
                  }))
                }
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() =>
                  update((c) => ({
                    ...c,
                    serviceCategories: c.serviceCategories.map((cc, idx) =>
                      idx === ci
                        ? { ...cc, services: cc.services.filter((_, sidx) => sidx !== si) }
                        : cc,
                    ),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() =>
              update((c) => ({
                ...c,
                serviceCategories: c.serviceCategories.map((cc, idx) =>
                  idx === ci
                    ? {
                        ...cc,
                        services: [
                          ...cc.services,
                          { name: "New Service", description: "", session: "2 to 4 hours" },
                        ],
                      }
                    : cc,
                ),
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </Card>
      ))}

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          update((c) => ({
            ...c,
            serviceCategories: [
              ...c.serviceCategories,
              { category: "New Category", image: "/uploads/placeholder-photo.svg", services: [] },
            ],
          }))
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </Button>
    </div>
  );
}

function PricingTab({ content, update }: TabProps) {
  return (
    <div className="mt-4 space-y-4">
      {content.packages.map((pkg, pi) => (
        <Card key={pi} className="space-y-3 p-6">
          <div className="flex items-center justify-between gap-2">
            <Input
              className="max-w-sm text-lg font-bold"
              value={pkg.name}
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  packages: c.packages.map((p, idx) =>
                    idx === pi ? { ...p, name: e.target.value } : p,
                  ),
                }))
              }
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => update((c) => ({ ...c, packages: c.packages.filter((_, idx) => idx !== pi) }))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            rows={2}
            value={pkg.summary}
            placeholder="Summary"
            onChange={(e) =>
              update((c) => ({
                ...c,
                packages: c.packages.map((p, idx) =>
                  idx === pi ? { ...p, summary: e.target.value } : p,
                ),
              }))
            }
          />
          <Label className="text-xs text-muted-foreground">Includes</Label>
          {pkg.includes.map((line, li) => (
            <div key={li} className="flex gap-2">
              <Input
                value={line}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    packages: c.packages.map((p, idx) =>
                      idx === pi
                        ? { ...p, includes: p.includes.map((l, lidx) => (lidx === li ? e.target.value : l)) }
                        : p,
                    ),
                  }))
                }
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() =>
                  update((c) => ({
                    ...c,
                    packages: c.packages.map((p, idx) =>
                      idx === pi ? { ...p, includes: p.includes.filter((_, lidx) => lidx !== li) } : p,
                    ),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() =>
              update((c) => ({
                ...c,
                packages: c.packages.map((p, idx) =>
                  idx === pi ? { ...p, includes: [...p.includes, "New line item"] } : p,
                ),
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Line
          </Button>
        </Card>
      ))}
      <Button
        variant="outline"
        type="button"
        onClick={() =>
          update((c) => ({
            ...c,
            packages: [...c.packages, { name: "New Package", summary: "", includes: [] }],
          }))
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Package
      </Button>
    </div>
  );
}

function PhotoUploadField({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      onChange(data.url);
      toast.success("Photo uploaded");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <img
          src={url}
          alt=""
          className="h-20 w-20 rounded-md border border-border object-cover"
        />
        <label htmlFor={inputId}>
          <span className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
            {uploading ? "Uploading..." : "Change Photo"}
          </span>
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

function PortfolioTab({ content, update }: TabProps) {
  return (
    <div className="mt-4 space-y-4">
      {content.portfolioProjects.map((p, i) => (
        <Card key={i} className="space-y-3 p-6">
          <div className="flex items-center justify-between gap-2">
            <Input
              className="max-w-sm text-lg font-bold"
              value={p.title}
              placeholder="Project title"
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                    idx === i ? { ...pp, title: e.target.value } : pp,
                  ),
                }))
              }
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.filter((_, idx) => idx !== i),
                }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={p.location}
              placeholder="Location"
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                    idx === i ? { ...pp, location: e.target.value } : pp,
                  ),
                }))
              }
            />
            <Input
              value={p.scope}
              placeholder="Scope (e.g. Bed, floor zone, closet)"
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                    idx === i ? { ...pp, scope: e.target.value } : pp,
                  ),
                }))
              }
            />
          </div>

          <Textarea
            rows={3}
            value={p.notes}
            placeholder="Notes shown under the photos"
            onChange={(e) =>
              update((c) => ({
                ...c,
                portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                  idx === i ? { ...pp, notes: e.target.value } : pp,
                ),
              }))
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoUploadField
              label="Before Photo"
              url={p.before}
              onChange={(url) =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                    idx === i ? { ...pp, before: url } : pp,
                  ),
                }))
              }
            />
            <PhotoUploadField
              label="After Photo"
              url={p.after}
              onChange={(url) =>
                update((c) => ({
                  ...c,
                  portfolioProjects: c.portfolioProjects.map((pp, idx) =>
                    idx === i ? { ...pp, after: url } : pp,
                  ),
                }))
              }
            />
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        type="button"
        onClick={() =>
          update((c) => ({
            ...c,
            portfolioProjects: [
              ...c.portfolioProjects,
              {
                title: "New Project",
                location: "ProClean Project",
                scope: "",
                before: "/uploads/placeholder-photo.svg",
                after: "/uploads/placeholder-photo.svg",
                notes: "",
              },
            ],
          }))
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}

function HomepageTab({ content, update }: TabProps) {
  return (
    <Card className="mt-4 space-y-4 p-6">
      <PhotoUploadField
        label={'"Responsible, thoughtful organizing" Section Photo'}
        url={content.sustainabilityImage}
        onChange={(url) => update((c) => ({ ...c, sustainabilityImage: url }))}
      />
    </Card>
  );
}

function LogoTab({ content, update }: TabProps) {
  return (
    <Card className="mt-4 space-y-4 p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <PhotoUploadField
          label="Header Logo"
          url={content.images.logo}
          onChange={(url) => update((c) => ({ ...c, images: { ...c.images, logo: url } }))}
        />
        <PhotoUploadField
          label="Full Logo"
          url={content.images.logoFull}
          onChange={(url) => update((c) => ({ ...c, images: { ...c.images, logoFull: url } }))}
        />
      </div>
    </Card>
  );
}
