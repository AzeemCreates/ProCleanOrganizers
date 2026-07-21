import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, Boxes, ArrowRight, CalendarCheck, Check } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

const CLEAN_STEPS = [
  "Dusting",
  "Wiping surfaces",
  "Vacuuming",
  "Sweeping",
  "Mopping",
  "Sanitizing",
  "Identifying problem areas",
];

const ORGANIZE_STEPS = [
  "Decluttering",
  "Consolidating",
  "Creating zones",
  "Building systems",
  "Labeling",
  "Color coding",
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - ProClean Organizers" },
      {
        name: "description",
        content:
          "Full service catalog from ProClean Organizers: home organization, decluttering, downsizing, moving, specialized organizing, and follow up maintenance across NYC & NJ.",
      },
      { property: "og:title", content: "Services - ProClean Organizers" },
      {
        property: "og:description",
        content: "Browse the complete catalog of organizing services offered across NYC & NJ.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { serviceCategories } = useSiteContent();
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/uploads/services-hero-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/75 via-primary/85 to-primary/95"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-lime">Services</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            A complete catalog, grouped by where we work
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Any individual service can be added to a package or booked on its own. Typical session
            length is shown for planning purposes; the exact scope and price are confirmed after
            your free consultation.
          </p>
        </div>
      </section>

      {/* ============ METHODOLOGY: Clean First, Organize Second ============ */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-teal-text">
              The ProClean Standard
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Why we <span className="text-brand-lime">clean</span> before we organize
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Most organizers build systems on top of the mess. We work in two phases,
              in order, so the results sit on a genuinely clean foundation.
            </p>
          </div>

          {/* Two phases */}
          <div className="mt-16 grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-6">
            {/* Phase 1 — Clean First */}
            <Reveal index={0} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-brand-teal/30 bg-brand-teal-soft p-8 md:p-10">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-teal text-primary">
                    <Sparkles className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-teal-text">
                      Phase 01
                    </p>
                    <h3 className="text-2xl font-bold text-primary">Clean First</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-brand-deep-teal">
                  Before any organizing begins, Mujahid prepares the space so the systems
                  we build sit on a fresh, sanitary foundation. This is what separates
                  ProClean from generic organizers.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {CLEAN_STEPS.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-brand-teal-text" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Connector */}
            <div className="flex items-center justify-center" aria-hidden>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-brand-teal-text shadow-sm">
                <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
              </span>
            </div>

            {/* Phase 2 — Organize Second */}
            <Reveal index={1} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-lime text-primary">
                    <Boxes className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-lime">
                      Phase 02
                    </p>
                    <h3 className="text-2xl font-bold">Organize Second</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-primary-foreground/80">
                  Once the environment is clean and sanitary, the organizing work begins,
                  built around how you actually live and how you want the space to function.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {ORGANIZE_STEPS.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-primary-foreground/90">
                      <Check className="h-4 w-4 shrink-0 text-brand-lime" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Pull quote */}
          <div className="mx-auto mt-16 max-w-3xl text-center">
            <span className="mx-auto mb-6 block h-1 w-12 rounded bg-brand-lime" aria-hidden />
            <p className="text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">
              Clean first. Organize second.{" "}
              <span className="text-brand-teal-text">That's the standard.</span>
            </p>
          </div>

          {/* Post-service follow-up trust card */}
          <Reveal index={0}>
            <div className="mt-16 rounded-2xl border border-border bg-muted/50 p-8 md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-6 w-6 shrink-0 text-brand-teal-text" aria-hidden />
                    <h3 className="text-xl font-bold text-foreground">Post-service follow-up</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Your systems should keep working long after we leave. Every client
                    receives scheduled check-ins to fine tune and maintain what we built
                    together.
                  </p>
                </div>
                <div className="grid w-full grid-cols-3 gap-3 md:w-auto">
                  {["3", "6", "9"].map((m) => (
                    <div
                      key={m}
                      className="flex flex-col items-center gap-1 rounded-xl border border-brand-teal/30 bg-card px-4 py-5 text-center md:min-w-24"
                    >
                      <span className="text-3xl font-bold text-primary">{m}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal-text">
                        Month check-in
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <Accordion type="multiple" defaultValue={[serviceCategories[0].category]}>
          {serviceCategories.map((cat) => (
            <AccordionItem key={cat.category} value={cat.category}>
              <AccordionTrigger className="text-left">
                <span className="flex flex-col">
                  <span className="text-xl font-bold text-primary">{cat.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {cat.services.length} service{cat.services.length === 1 ? "" : "s"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="mt-2 space-y-4">
                  {cat.services.map((s) => (
                    <li
                      key={s.name}
                      className="rounded-md border border-border bg-card p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                        <span className="rounded-full bg-brand-teal-soft px-3 py-1 text-xs font-bold text-brand-teal-text">
                          {s.session}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Not sure where to start?</h2>
          <p className="mt-4 opacity-90">
            Free consultations help you map out the right scope before committing to anything.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link to="/contact">Schedule Your Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
