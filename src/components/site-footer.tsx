import { Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content-context";

export function SiteFooter() {
  const { business } = useSiteContent();
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
              <a href={business.emailHref} className="hover:underline whitespace-nowrap">
                {business.email}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm opacity-80">{business.serviceAreaSummary}</p>
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
        </p>
      </div>
    </footer>
  );
}
