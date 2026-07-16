import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { HeroParallax } from "@/components/hero-parallax";
import { Reveal } from "@/components/reveal";
import { MethodTimeline } from "@/components/method-timeline";
import { MethodBackdrop } from "@/components/method-backdrop";
import { useSiteContent } from "@/lib/site-content-context";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Home,
  Briefcase,
  Sparkles,
  Users,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProClean Organizers - Tidy is Mighty" },
      {
        name: "description",
        content:
          "Professional organizing, space design, and time management for homes and small businesses in NYC. Schedule your free consultation with ProClean Organizers.",
      },
      { property: "og:title", content: "ProClean Organizers - Tidy is Mighty" },
      {
        property: "og:description",
        content: "Calm, capable organizing for homes and small businesses across NYC & NJ.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const FEATURES = [
  {
    icon: Users,
    title: "A team you can trust in your home",
    body: "Judgment-free, discreet, and professional. Every project is led by our owner with the same standard of care from first walkthrough to final follow-up.",
  },
  {
    icon: Sparkles,
    title: "Cleanliness before organization",
    body: "We start by removing dust, dirt, and clutter so the systems we build sit on a genuinely fresh foundation, not on top of the problem.",
  },
  {
    icon: Home,
    title: "Systems tailored to your space",
    body: "Every home is different. We design storage, labels, and zones around how you actually live so the results hold up long after we leave.",
  },
  {
    icon: Briefcase,
    title: "Homes and small businesses",
    body: "From closets and kitchens to offices and stockrooms, our method scales. Serving NYC & NJ with virtual and in-person consultations.",
  },
];

function HomePage() {
  const { business, serviceCategories, sustainabilityImage } = useSiteContent();
  const topCategories = serviceCategories.slice(0, 3);

  return (
    <SiteShell>
      {/* ============ HERO (scroll parallax) ============ */}
      <HeroParallax />

      {/* ============ TRUST BAND (green) ============ */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
            Trusted across NYC & NJ
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-6 text-center text-sm md:grid-cols-5">
            {[
              "Manhattan",
              "Queens",
              "Brooklyn & Bronx",
              "Westchester & LI",
              "Mercer & surrounding counties",
            ].map((area) => (
              <li key={area} className="border-t border-brand-lime/50 pt-4 font-semibold">
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ SERVICE COLLECTIONS ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Our Service Collections
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete catalog of home, business, and lifestyle organizing services
              built on the same disciplined method.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topCategories.map((cat, i) => (
              <Reveal key={cat.category} index={i} className="h-full">
              <article
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rotate-45 bg-brand-lime"
                    />
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal-text">
                      ProClean
                    </p>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-foreground">{cat.category}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {cat.services.length} service{cat.services.length === 1 ? "" : "s"} designed for
                    lasting order in every part of your space.
                  </p>
                  <Link
                    to="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary hover:text-brand-teal-text hover:underline"
                  >
                    Explore
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary hover:underline"
            >
              View full catalog
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY PROCLEAN (deep teal-navy gradient with accordion) ============ */}
      <section className="bg-gradient-to-br from-primary to-brand-deep-teal text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why ProClean?</h2>
            <p className="mt-4 text-primary-foreground/80">
              As ProClean Organizers, we turn cluttered rooms into calm, functional spaces
              through a disciplined, judgment free method. Every home gets the same standard
              of care we would want in our own.
            </p>
          </div>

          <ul className="mt-10 divide-y divide-primary-foreground/20 border-y border-primary-foreground/20">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title}>
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                        <span className="text-base font-semibold md:text-lg">{f.title}</span>
                      </div>
                      <Icon className="h-6 w-6 shrink-0 text-brand-lime" aria-hidden />
                    </summary>
                    <p className="pb-6 pl-8 pr-2 text-sm leading-relaxed text-primary-foreground/85">
                      {f.body}
                    </p>
                  </details>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <a
              href={business.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-lime px-6 text-sm font-bold uppercase tracking-wide text-primary shadow-lg shadow-black/20 transition-colors hover:bg-brand-lime/90"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ============ THE METHOD (interactive timeline on 3D navy) ============ */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <MethodBackdrop />
        <MethodTimeline />
      </section>

      {/* ============ SUSTAINABILITY / VALUES (green with image feel) ============ */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-primary-foreground/5">
            <img
              src={sustainabilityImage}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Responsible, thoughtful organizing
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              We prioritize donation, recycling, and resale when decluttering, and we build
              systems designed to reduce waste over time. Fewer duplicates. Less landfill.
              Spaces that stay usable for years.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 border-b border-primary-foreground pb-1 text-sm font-semibold uppercase tracking-wide hover:opacity-80"
            >
              Learn more about our approach
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>


      {/* ============ FIND US / CONTACT PROMPT ============ */}
      <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ready to restore order?
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
