import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ProofCarousel } from "@/components/proof-carousel";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio - Proof of Work | ProClean Organizers" },
      {
        name: "description",
        content:
          "Before and after transformations from ProClean Organizers. Real spaces across NYC & NJ, organized with our nine-step method.",
      },
      { property: "og:title", content: "Portfolio - Proof of Work | ProClean Organizers" },
      {
        property: "og:description",
        content: "Before and after transformations from real ProClean Organizers projects.",
      },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { portfolioProjects: PROJECTS } = useSiteContent();
  return (
    <SiteShell>
      {/* HERO */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal-text">
            Portfolio
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Proof of <span className="text-primary">Work.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Real spaces across NYC & NJ, before and after the ProClean method.
            No staging, no props, just the same rooms our clients live in every day.
          </p>
        </div>
      </section>

      {/* TRUST BAND */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <ul className="grid grid-cols-2 gap-6 text-center text-sm md:grid-cols-3">
            {[
              { k: "Projects shown", v: "Multiple" },
              { k: "Method steps", v: "9" },
              { k: "Rooms transformed", v: "All Types" },
            ].map((s) => (
              <li key={s.k} className="border-t border-primary-foreground/20 pt-4">
                <p className="text-2xl font-bold md:text-3xl">{s.v}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] opacity-80">
                  {s.k}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROOF CAROUSEL */}
      <ProofCarousel />

      {/* PROJECTS */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Selected Transformations
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every project below started with an assessment, followed our nine-step
              sequence, and finished with a system built for how the client actually lives.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24">
            {PROJECTS.map((p, i) => (
              <article key={p.title} className="grid gap-8 md:gap-10">
                <header className="flex flex-col gap-2">
                  <span className="text-xs font-semibold tracking-widest text-brand-teal-text">
                    {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {p.scope}
                    </p>
                  </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <figure className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                      <img
                        src={p.before}
                        alt={`${p.title} before`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-sm bg-background/95 px-2 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                        Before
                      </span>
                    </div>
                  </figure>
                  <figure className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                      <img
                        src={p.after}
                        alt={`${p.title} after`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-sm bg-brand-lime px-2 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        After
                      </span>
                    </div>
                  </figure>
                </div>

                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                  {p.notes}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ready for your before and after?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Free virtual consultations are always available, and free in-person
            consultations are offered within a reasonable service radius.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
            >
              Schedule Your Free Consultation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
