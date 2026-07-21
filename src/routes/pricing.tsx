import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { useSiteContent } from "@/lib/site-content-context";
import {
  Check,
  CalendarCheck,
  ArrowRight,
  Home,
  Boxes,
  Sparkles,
  Archive,
  Layers,
  PackageCheck,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - ProClean Organizers" },
      {
        name: "description",
        content:
          "ProClean Organizers packages are consultation-based. Browse the six Mighty packages, free consultation, and à la carte options - then request a custom quote.",
      },
      { property: "og:title", content: "Pricing - ProClean Organizers" },
      {
        property: "og:description",
        content: "Six Mighty packages plus free consultations and à la carte options.",
      },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

// Rotating badge icons for the package cards - generic organizing themes so
// the treatment stays consistent even though package content is data-driven.
const PACKAGE_ICONS = [Home, Boxes, Sparkles, Archive, Layers, PackageCheck];

function PricingPage() {
  const { packages } = useSiteContent();
  return (
    <SiteShell>
      {/* ============ HERO (teal-tinted photo) ============ */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/uploads/proof/proof-02.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-teal/70 via-brand-teal/80 to-brand-teal/90"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-lime">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Custom quotes after a free consultation
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90">
            Every project is scoped individually. Pricing depends on space size, project scope,
            and travel distance - so we provide a clear estimate only after we've assessed your
            specific situation, never before. Virtual consultations are always free, and in-person
            consultations are free within a reasonable service radius.
          </p>
        </div>
      </section>

      {/* Free consultation callout */}
      <section className="mx-auto max-w-4xl px-4 pt-16 md:px-6">
        <div className="overflow-hidden rounded-2xl border-2 border-brand-lime bg-brand-teal-soft">
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal text-primary">
                  <CalendarCheck className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-text">
                  Start here
                </p>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Free Consultation</h2>
              <p className="mt-3 text-muted-foreground">
                Complimentary virtual consultations are always available. Free in-person
                consultations are offered within a reasonable service radius. We assess the
                space, understand your goals, and provide a custom estimate before any work
                begins.
              </p>
              <div className="mt-6">
                <Button asChild size="lg" className="font-bold">
                  <Link to="/contact">Book a Consultation</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden min-h-[220px] md:block">
              <img
                src="/uploads/decluttering.webp"
                alt="Labeled storage totes organized on a shelf"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">The Mighty Packages</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Six scoped packages built around the most common projects. All packages end with a
          request-a-quote step - no fixed prices are listed because every space is different.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => {
            const Icon = PACKAGE_ICONS[i % PACKAGE_ICONS.length];
            return (
              <Reveal key={pkg.name} index={i} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand-teal">
                  <div className="flex items-center gap-3 bg-brand-teal-soft px-6 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-xl font-bold text-primary">{pkg.name}</h3>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-muted-foreground">{pkg.summary}</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-foreground">
                      Includes
                    </p>
                    <ul className="mt-2 flex-1 space-y-2 text-sm text-foreground">
                      {pkg.includes.map((line) => (
                        <li key={line} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal-text" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button asChild className="w-full font-bold">
                        <Link to="/contact">Request a Custom Quote</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ REAL RESULTS (before/after photo break) ============ */}
      <section className="border-t border-border bg-brand-teal-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <Reveal index={0}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <img
                    src="/uploads/bedroom-before.jpeg"
                    alt="Cluttered bedroom before an organizing session"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Before
                </p>
              </div>
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <img
                    src="/uploads/bedroom-after.jpeg"
                    alt="Organized bedroom after a ProClean session"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-brand-teal-text">
                  After
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-teal-text">
              Real Results
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              See the Mighty difference
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every package above is scoped around outcomes like this one - not a fixed menu of
              hours. A free consultation is how we translate your space into the right package
              and an accurate quote.
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary hover:text-brand-teal-text hover:underline"
            >
              See the full service catalog
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* A la carte */}
      <section className="border-t border-border bg-brand-teal-soft">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">À La Carte</h2>
          <p className="mt-3 text-muted-foreground">
            Any individual service from the catalog can be added to a package or booked on its own.
            À la carte work is priced separately following your consultation.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="border-brand-teal font-bold text-brand-teal-text hover:bg-brand-teal hover:text-primary">
              <Link to="/services">Browse the full catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio program - small callout */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-lg border border-dashed border-brand-teal/50 bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal-text">
              <Camera className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-text">
              Portfolio Development Program
            </p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Select clients may qualify for reduced pricing in exchange for written, voluntary
            permission to showcase portions of completed work for marketing and website purposes.
            Client privacy is always respected, and nothing is used without written consent. Ask
            during your consultation if you'd like to learn more.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
