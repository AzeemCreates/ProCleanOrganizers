import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";

/**
 * Horizontally-scrollable proof gallery on the portfolio page. Reuses the Embla
 * carousel primitive (drag/swipe + one-card-per-click via a circular arrow pinned
 * to the right edge). The headline is the static first item in the track that the
 * cards scroll past. Dark navy band to match the homepage method timeline; sage
 * for accents, lime reserved for the one highlighted word and the arrow hover.
 *
 * Cards are real ProClean spaces (organized results lead, transformation spaces
 * follow) framed in a rounded photo-card mockup with a subtle chrome bar.
 */

const PROOF: { src: string; alt: string }[] = [
  { src: "/uploads/proof/proof-01.webp", alt: "Organized, labeled storage system built by ProClean Organizers" },
  { src: "/uploads/proof/proof-02.webp", alt: "Color-sorted folded shelving in a calm, organized closet" },
  { src: "/uploads/proof/proof-03.webp", alt: "Fully organized walk-in closet with categorized clothing" },
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
        <Carousel opts={{ align: "start", dragFree: false }}>
          {/* Circular arrow pinned to the right edge — advances one card per click */}
          <CarouselNext
            aria-label="Next"
            className="right-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-none bg-[#1a2740] text-white shadow-lg shadow-black/30 transition-colors hover:bg-brand-lime hover:text-primary disabled:opacity-40 md:right-4"
          />

          <CarouselContent className="-ml-5">
            {/* Static first item: headline the cards scroll past */}
            <CarouselItem className="basis-[85%] pl-5 sm:basis-3/5 lg:basis-1/3">
              <div className="flex h-full min-h-64 flex-col justify-center pr-2">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-teal">
                  Proof of work
                </p>
                <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
                  Trust the <span className="text-brand-lime">results</span>
                </h2>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
                  Real spaces across NYC and NJ, transformed with the ProClean method.
                  Drag or use the arrow to move through the work.
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
