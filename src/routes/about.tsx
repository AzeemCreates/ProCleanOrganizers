import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content-context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - ProClean Organizers" },
      {
        name: "description",
        content:
          "Meet Mujahid Ibn Abdellah, owner of ProClean Organizers. IAP Career College certified professional organizer serving NYC & NJ since 2020.",
      },
      { property: "og:title", content: "About - ProClean Organizers" },
      {
        property: "og:description",
        content:
          "About ProClean Organizers and the nine-step ProClean Method for lasting order.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { business, mission, methodSteps } = useSiteContent();
  return (
    <SiteShell>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">About</p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
            Meet the organizer behind {business.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {business.owner} is the Independent Owner and Operator of {business.name}, a
            professional organizing, space design, and time management company established in {business.established}.
            Certified through IAP Career College and backed by years of hands-on experience, he
            specializes in building clean, functional, and sustainable organizing systems that help
            clients reduce stress, save time, and improve their quality of life. He is driven by
            a passion for helping people create environments that support productivity, clarity,
            and peace of mind.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary to-brand-deep-teal text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-lime">Mission Statement</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Why we do this</h2>
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">{mission}</p>
        </div>
      </section>

      {/* Method full */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">The ProClean Method</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            Nine steps, in order, every time
          </h2>
          <ol className="mt-10 space-y-4">
            {methodSteps.map((step, i) => (
              <li
                key={step.name}
                className="flex gap-6 rounded-lg border border-border bg-card p-6"
              >
                <span className="shrink-0 text-2xl font-bold text-brand-teal-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{step.name}</h3>
                  <p className="mt-1 text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Service area */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">Service Area</p>
        <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Where we work</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-lg font-bold text-primary">Primary service area</p>
            <p className="mt-2 text-muted-foreground">
              New York City - focused on Manhattan and Queens, with availability in select areas
              of the Bronx and Brooklyn depending on scope and scheduling.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-lg font-bold text-primary">Secondary service area</p>
            <p className="mt-2 text-muted-foreground">
              Westchester County, Long Island, Northern New Jersey, and Connecticut. Additional
              travel fees may apply. We are actively expanding across the broader NY metro region.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Button asChild size="lg" className="font-bold">
            <Link to="/contact">Schedule Your Free Consultation</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
