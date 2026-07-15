import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-triggered reveal. Each element fades + rises into place whenever it
 * enters the viewport, and resets back to hidden when it scrolls out — so
 * scrolling down past it and back up replays the animation. Passing an
 * ascending `index` staggers a group so the items arrive one after another,
 * and gives each a subtly different entrance (per-index drift, tilt, scale,
 * rise distance, and transform-origin) so a row of cards feels like a varied
 * family of entrances while still reading as one flowing sequence.
 *
 * Fully skipped (renders in final position, no motion) when the user prefers
 * reduced motion or IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setShown(entry.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger creates the one-after-another cadence; the per-index variation keeps
  // each card's arrival from feeling mechanically identical to the last, while
  // staying a "family" of entrances (same easing, same cadence) rather than
  // random per-card motion.
  const dir = index % 2 === 0 ? -1 : 1;
  const delay = index * 180;
  const distance = 34 + index * 7;
  const drift = dir * (8 + ((index * 5) % 7));
  const tilt = dir * (0.5 + ((index * 3) % 8) * 0.08);
  const scale = 0.99 - ((index * 2) % 6) * 0.008;
  const duration = 1040 + index * 40;
  const originX = 50 + dir * (10 + ((index * 7) % 20));
  const originY = index % 3 === 0 ? 100 : 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown
          ? "none"
          : `translate3d(${drift}px, ${distance}px, 0) scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: `${originX}% ${originY}%`,
        transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${
          duration - 60
        }ms ease ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
