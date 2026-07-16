import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { BookingForm, ContactForm } from "@/components/contact-forms";
import { useSiteContent } from "@/lib/site-content-context";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - ProClean Organizers" },
      {
        name: "description",
        content:
          "Reach ProClean Organizers by phone, email, or form. Free consultations across NYC & NJ.",
      },
      { property: "og:title", content: "Contact - ProClean Organizers" },
      {
        property: "og:description",
        content: "Get in touch to schedule a free consultation with ProClean Organizers.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { business } = useSiteContent();
  return (
    <SiteShell>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-teal-text">Contact</p>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
            Tell us about your space
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Send us a message or request a booking below. Virtual consultations are always free,
            and in-person consultations are free within a reasonable service radius.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <a
              href={business.phoneHref}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand-teal"
            >
              <Phone className="mt-1 h-5 w-5 text-brand-teal-text" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</p>
                <p className="text-base font-bold text-foreground">{business.phone}</p>
              </div>
            </a>
            <a
              href={business.emailHref}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand-teal"
            >
              <Mail className="mt-1 h-5 w-5 text-brand-teal-text" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="break-all text-base font-bold text-foreground">{business.email}</p>
              </div>
            </a>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <MapPin className="mt-1 h-5 w-5 text-brand-teal-text" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Area</p>
                <p className="text-base text-foreground">{business.serviceAreaSummary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Send a message</h2>
            <p className="mt-3 text-muted-foreground">
              For questions or general inquiries.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Request a booking</h2>
            <p className="mt-3 text-muted-foreground">
              Share which service you're interested in and when you're available.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
