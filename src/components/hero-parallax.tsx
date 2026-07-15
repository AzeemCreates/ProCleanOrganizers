import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

/**
 * Homepage hero with a scroll-driven parallax effect.
 *
 * Three layers move at different speeds within the first viewport of scroll so
 * the separation is obvious:
 *   - background photo  ~0.35x (slow downward drift + slight zoom-out)
 *   - accent shape      ~0.65x (mid-depth)
 *   - foreground text   ~1.15x (moves up faster than the page, then fades)
 *
 * All transforms are applied via a single rAF-batched scroll handler and are
 * skipped entirely when the user prefers reduced motion (the layout stays put,
 * fully legible). Works for wheel, trackpad, and touch since it reads
 * window.scrollY rather than any pointer events.
 */
export function HeroParallax() {
  const { business } = useSiteContent();
  const bgRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      // Only do work while the hero is still on screen.
      if (y > window.innerHeight) return;

      const zoom = 1.15 - Math.min(y, 700) / 700 * 0.15; // 1.15 -> 1.0

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${zoom})`;
      }
      if (accentRef.current) {
        accentRef.current.style.transform = `translate3d(0, ${y * 0.65}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        contentRef.current.style.opacity = String(Math.max(0, 1 - y / 480));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative -mt-16 flex min-h-[92vh] items-center overflow-hidden bg-primary md:min-h-screen">
      {/* Layer 1 — background photo (oversized so parallax translation never reveals an edge) */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute left-0 h-[160%] w-full -top-[30%] will-change-transform"
        aria-hidden
      >
        <img
          src="/uploads/hero-closet.png"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>

      {/* Navy tint: light over the photo (left), heavy behind the text (right) for strong contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/45 to-primary/90"
        aria-hidden
      />
      {/* Vertical darkening to seat the sticky header and blend into the next section */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/60"
        aria-hidden
      />

      {/* Layer 2 — lime accent bar, mid-depth */}
      <div
        ref={accentRef}
        className="pointer-events-none absolute right-[6%] top-[14%] hidden h-40 w-1.5 rounded-full bg-brand-lime/80 will-change-transform md:block lg:right-[10%]"
        aria-hidden
      />

      {/* Layer 3 — foreground text */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 md:px-6">
        <div
          ref={contentRef}
          className="ml-auto max-w-xl text-right will-change-transform md:pr-2"
        >
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.55)] md:text-7xl">
            Organized
            <br />
            Spaces.
            <br />
            Restored <span className="text-brand-lime">Calm.</span>
          </h1>

          {/* Subhead */}
          <div className="mt-8 flex justify-end">
            <p className="max-w-md text-base leading-relaxed text-brand-teal drop-shadow-[0_1px_6px_rgba(15,23,42,0.6)] md:text-lg">
              Free virtual consultations are always available, plus free
              in-person visits within our service radius.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-brand-lime bg-brand-lime px-7 text-sm font-bold uppercase tracking-wide text-primary shadow-lg shadow-black/25 transition-colors hover:bg-transparent hover:text-brand-lime"
            >
              Book Your Free Consultation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={business.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-white/40 px-6 text-sm font-bold tracking-wide text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {business.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
