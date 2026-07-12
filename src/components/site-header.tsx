import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Globe } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { getCurrentLang, toggleLanguage } from "@/lib/translate";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { business, images } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    setLang(getCurrentLang());
  }, []);

  const LogoLink = () => (
    <Link
      to="/"
      className="flex items-center gap-2"
      aria-label={`${business.name} home`}
    >
      <img
        src={images.logo}
        alt=""
        className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
        width={64}
        height={64}
      />
      <span className="text-base font-bold tracking-tight text-primary md:text-xl">
        {business.name}
      </span>
    </Link>
  );

  const DesktopNav = () => (
    <nav className="flex items-center gap-1" aria-label="Primary">
      {NAV.slice(1).map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeProps={{ className: "text-brand-teal-text font-semibold border-b-2 border-brand-teal" }}
          className="rounded px-3 py-2 text-sm font-medium uppercase tracking-wide text-foreground hover:text-brand-teal-text"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-3 md:grid-cols-[1fr_auto] md:px-6">
        {/* Mobile: hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop: leftmost logo + nav */}
        <div className="hidden items-center gap-4 md:flex">
          <LogoLink />
          <DesktopNav />
        </div>

        {/* Mobile: centered logo */}
        <div className="flex items-center justify-center md:hidden">
          <LogoLink />
        </div>

        {/* Right: language toggle + contact CTA */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => toggleLanguage()}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-semibold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary md:px-4"
            aria-label={lang === "en" ? "Translate to Spanish" : "Translate to English"}
          >
            <Globe className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{lang === "en" ? "Español" : "English"}</span>
            <span className="sm:hidden">{lang === "en" ? "ES" : "EN"}</span>
          </button>
          <a
            href={business.phoneHref}
            aria-label={`Call ${business.phone}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:px-4"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{business.phone}</span>
          </a>
        </div>
      </div>

      {/* Drawer nav */}
      {open && (
        <nav className="border-t border-border bg-background" aria-label="Mobile">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-brand-teal-text font-semibold" }}
                  className="block rounded px-2 py-3 text-base uppercase tracking-wide text-foreground hover:text-brand-teal-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2">
              <button
                type="button"
                onClick={() => toggleLanguage()}
                className="flex w-full items-center gap-2 rounded px-2 py-3 text-base uppercase tracking-wide text-foreground hover:text-primary"
                aria-label={lang === "en" ? "Translate to Spanish" : "Translate to English"}
              >
                <Globe className="h-5 w-5" aria-hidden />
                {lang === "en" ? "Español" : "English"}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
