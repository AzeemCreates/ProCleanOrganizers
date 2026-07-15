import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

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

  const LogoLink = () => (
    <Link
      to="/"
      className="flex items-center gap-2"
      aria-label={`${business.name} home`}
    >
      <img
        src={images.logo}
        alt=""
        className="h-10 w-10 shrink-0 object-contain md:h-11 md:w-11"
        width={64}
        height={64}
      />
      <span className="text-base font-bold tracking-tight text-primary md:text-xl">
        {business.name}
      </span>
    </Link>
  );

  const DesktopNav = () => (
    <nav className="flex items-center justify-center gap-1" aria-label="Primary">
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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
        {/* Cell 1: mobile hamburger / desktop logo */}
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex">
            <LogoLink />
          </div>
        </div>

        {/* Cell 2: mobile centered logo / desktop centered nav */}
        <div className="flex items-center justify-self-center">
          <div className="flex md:hidden">
            <LogoLink />
          </div>
          <div className="hidden md:flex">
            <DesktopNav />
          </div>
        </div>

        {/* Cell 3: contact CTA */}
        <div className="flex items-center justify-self-end gap-2">
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
          </ul>
        </nav>
      )}
    </header>
  );
}
