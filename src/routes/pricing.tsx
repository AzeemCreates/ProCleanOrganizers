import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content-context";
import { Check } from "lucide-react";

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
        content: "Six Mighty packages plus free consultations and à la carte services.",
      },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { packages } = useSiteContent();
  return (
    <SiteShell>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
            Custom quotes after a free consultation
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Every project is scoped individually. Pricing depends on space size, project scope,
            and travel distance - so we provide a clear estimate only after we've assessed your
            specific situation, never before. Virtual consultations are always free, and in-person
            consultations are free within a reasonable service radius.
          </p>
        </div>
      </section>

      {/* Free consultation callout */}
      <section className="mx-auto max-w-4xl px-4 pt-16 md:px-6">
        <div className="rounded-2xl border-2 border-brand-lime bg-card p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-text">Start here</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Free Consultation</h2>
          <p className="mt-3 text-muted-foreground">
            Complimentary virtual consultations are always available. Free in-person consultations
            are offered within a reasonable service radius. We assess the space, understand your
            goals, and provide a custom estimate before any work begins.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="font-bold">
              <Link to="/contact">Book a Consultation</Link>
            </Button>
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
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <h3 className="text-xl font-bold text-primary">{pkg.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pkg.summary}</p>
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
            </article>
          ))}
        </div>
      </section>

      {/* A la carte */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">À La Carte</h2>
          <p className="mt-3 text-muted-foreground">
            Any individual service from the catalog can be added to a package or booked on its own.
            À la carte work is priced separately following your consultation.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="font-bold">
              <Link to="/services">Browse the full catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio program - small callout */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-lg border border-dashed border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-teal-text">
            Portfolio Development Program
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
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
