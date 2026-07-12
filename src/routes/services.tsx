import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteContent } from "@/lib/site-content-context";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - ProClean Organizers" },
      {
        name: "description",
        content:
          "Full service catalog from ProClean Organizers: home organization, decluttering, downsizing, moving, specialized organizing, and follow up maintenance across NYC.",
      },
      { property: "og:title", content: "Services - ProClean Organizers" },
      {
        property: "og:description",
        content: "Browse the complete catalog of organizing services offered across the NYC metro area.",
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
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">Services</p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
            A complete catalog, grouped by where we work
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Any individual service can be added to a package or booked on its own. Typical session
            length is shown for planning purposes; the exact scope and price are confirmed after
            your free consultation.
          </p>
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
