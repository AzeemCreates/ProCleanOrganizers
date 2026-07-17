import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Facebook, Globe } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { getCurrentLang, toggleLanguage } from "@/lib/translate";

export function SiteFooter() {
  const { business } = useSiteContent();
  const [lang, setLang] = useState<"en" | "es">("en");
  useEffect(() => {
    setLang(getCurrentLang());
  }, []);
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.35fr_1fr] md:px-6">
        <div>
          <p className="text-xl font-bold">{business.name}</p>
          <p className="mt-1 text-sm opacity-90">{business.slogan}</p>
          <p className="mt-4 text-sm opacity-80">
            Owned and operated by {business.owner}. Established {business.established}.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-teal">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={business.phoneHref} className="hover:underline">
                {business.phone}
              </a>
            </li>
            <li>
              <a href={business.emailHref} className="whitespace-nowrap text-xs hover:underline">
                {business.email}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm opacity-80">{business.serviceAreaSummary}</p>
          <a
            href="https://m.facebook.com/procleanorganizers2020/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ProClean Organizers on Facebook"
            className="mt-4 inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-teal">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/services" className="hover:underline">Services</Link></li>
            <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 px-4 py-4 text-center text-xs opacity-80 md:px-6">
          <span>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </span>
          <span aria-hidden>&middot;</span>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
          <span aria-hidden>&middot;</span>
          <button
            type="button"
            onClick={() => toggleLanguage()}
            className="inline-flex items-center gap-1.5 hover:underline"
            aria-label={lang === "en" ? "Translate to Spanish" : "Translate to English"}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden />
            {lang === "en" ? "Español" : "English"}
          </button>
        </p>
      </div>
    </footer>
  );
}
