import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/**
 * Horizontally-scrollable proof gallery on the portfolio page. Reuses the Embla
 * carousel primitive, navigated by two circular arrow buttons only (drag/swipe
 * is disabled via `watchDrag: false`). The intro line is the static first item
 * in the track that the cards scroll past. Dark navy band to match the homepage
 * method timeline; sage for accents, lime reserved for the arrow hover state.
 *
 * Cards are real ProClean spaces (organized results lead, transformation spaces
 * follow) framed in a rounded photo-card mockup with a subtle chrome bar.
 */

// Hoisted to a stable reference: passing a fresh object literal as `opts` on
// every render causes embla-carousel-react to reInit (and snap back to the
// first slide) each time this component re-renders, which it does on every
// scroll (the Carousel primitive re-renders to update canScrollPrev/Next).
const CAROUSEL_OPTS = { align: "start" as const, dragFree: false, watchDrag: false };

const PROOF: { src: string; alt: string }[] = [
  { src: "/uploads/proof/proof-02.webp", alt: "Color-sorted folded shelving in a calm, organized closet" },
  { src: "/uploads/proof/proof-01.webp", alt: "Organized, labeled storage system built by ProClean Organizers" },
  { src: "/uploads/proof/proof-04.webp", alt: "Cleared and cleaned basement utility room" },
  { src: "/uploads/proof/proof-05.webp", alt: "A cluttered home office corner before organizing" },
  { src: "/uploads/proof/proof-06.webp", alt: "Boxes and clutter in a room before the ProClean method" },
  { src: "/uploads/proof/proof-07.webp", alt: "An overfilled closet packed with boxes and bags before organizing" },
  { src: "/uploads/proof/proof-08.webp", alt: "A desk piled with papers before organizing" },
];

export function ProofCarousel() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Carousel opts={CAROUSEL_OPTS}>
          {/* Two circular arrows, pinned to the edges — the only way to navigate */}
          <CarouselPrevious
            aria-label="Previous"
            className="left-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-none bg-[#1a2740] text-white shadow-lg shadow-black/30 transition-colors hover:bg-brand-lime hover:text-primary disabled:opacity-40 md:left-4"
          />
          <CarouselNext
            aria-label="Next"
            className="right-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-none bg-[#1a2740] text-white shadow-lg shadow-black/30 transition-colors hover:bg-brand-lime hover:text-primary disabled:opacity-40 md:right-4"
          />

          <CarouselContent className="-ml-5">
            {/* Static first item: headline the cards scroll past */}
            <CarouselItem className="basis-[85%] pl-5 sm:basis-3/5 lg:basis-1/3">
              <div className="flex h-full min-h-64 flex-col justify-center pl-10 pr-2 md:pl-12">
                <p className="max-w-xs text-2xl font-bold leading-snug text-primary-foreground md:text-3xl">
                  Spaces across NYC and NJ, transformed with the ProClean method.
                </p>
              </div>
            </CarouselItem>

            {PROOF.map((p) => (
              <CarouselItem
                key={p.src}
                className="basis-[80%] pl-5 sm:basis-1/2 lg:basis-[24%]"
              >
                <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" aria-hidden />
                    <span className="ml-3 text-[11px] font-semibold uppercase tracking-wider text-brand-teal">
                      ProClean Organizers
                    </span>
                  </div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/20">
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
