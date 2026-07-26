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

      {/* CONTACT STRIP */}
      <section className="bg-brand-lime text-primary">
        {/* Full-bleed on purpose (no max-w-6xl): the strip reads as a bar, so
            Phone starts flush at the left edge and Service Area runs out to the
            right instead of the trio sitting centered with dead lime on both sides. */}
        <div className="grid items-center gap-x-10 gap-y-3 px-5 py-4 md:grid-cols-[auto_auto] md:px-8 lg:px-12">
          <a href={business.phoneHref} className="flex items-center gap-2.5 hover:underline">
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]">Phone</p>
              <p className="text-sm font-bold">{business.phone}</p>
            </div>
          </a>
          <a href={business.emailHref} className="flex items-center gap-2.5 hover:underline">
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]">Email</p>
              <p className="truncate text-sm font-bold">{business.email}</p>
            </div>
          </a>
          {/* Own full-width row: on its own line it starts at the same left edge
              as Phone and has room for the whole service list without wrapping. */}
          <div className="flex items-center gap-2.5 md:col-span-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]">Service Area</p>
              <p className="text-sm leading-snug text-primary/80">{business.serviceAreaSummary}</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
