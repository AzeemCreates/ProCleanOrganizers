import { useEffect, useRef } from "react";

/**
 * MethodBackdrop
 *
 * Purely decorative background layer for a navy section. Renders a
 * perspective grid ("floor" plane) receding toward a vanishing point,
 * plus a soft center vignette/glow, to give the section a subtle sense
 * of 3D depth. Built entirely with CSS gradients/transforms — no
 * external libraries, no canvas.
 *
 * Usage:
 *   <section className="relative overflow-hidden bg-primary">
 *     <MethodBackdrop />
 *     <div className="relative z-10">...real content...</div>
 *   </section>
 */
export function MethodBackdrop() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference: skip the drift animation entirely.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const el = gridRef.current;
    if (!el) return;

    let rafId = 0;
    let latestY = 0;
    let ticking = false;

    const applyDrift = () => {
      ticking = false;
      // Extremely slow, subtle vertical drift of the grid tied loosely to
      // scroll position, wrapped in a small sine easing so it never races.
      const offset = (Math.sin(latestY / 2400) * 8).toFixed(2);
      el.style.setProperty("--drift", `${offset}px`);
    };

    const onScroll = () => {
      latestY = window.scrollY;
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(applyDrift);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Set an initial value in case the page loads mid-scroll.
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base tonal wash: darker navy pooling at the edges, deeper navy
          radiating from the center, so the grid has something to sit on. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, #22334d 0%, #2c4160 45%, #1a2740 100%)",
        }}
      />

      {/* Perspective floor grid, receding toward a vanishing point below
          center. Two layers (fine + coarse) give a sense of scale. */}
      <div
        className="absolute inset-0 flex items-end justify-center"
        style={{ perspective: "600px", perspectiveOrigin: "50% 30%" }}
      >
        <div
          ref={gridRef}
          className="method-backdrop-grid absolute left-1/2 h-[140%] w-[220%]"
          style={{
            bottom: "-15%",
            transform:
              "translateX(-50%) translateY(var(--drift, 0px)) rotateX(72deg)",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(109,187,156,0.16) 0px, rgba(109,187,156,0.16) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(109,187,156,0.16) 0px, rgba(109,187,156,0.16) 1px, transparent 1px, transparent 64px)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 85%)",
          }}
        />
        <div
          className="method-backdrop-grid absolute left-1/2 h-[140%] w-[220%]"
          style={{
            bottom: "-15%",
            transform: "translateX(-50%) rotateX(72deg)",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(34,51,77,0.5) 0px, rgba(34,51,77,0.5) 1px, transparent 1px, transparent 320px), repeating-linear-gradient(90deg, rgba(34,51,77,0.5) 0px, rgba(34,51,77,0.5) 1px, transparent 1px, transparent 320px)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 88%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 88%)",
          }}
        />
      </div>

      {/* Layered translucent navy panels floating above the grid, at
          different scales/offsets, to suggest depth without a canvas. */}
      <div
        className="absolute -left-24 -top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(26,39,64,0.55)" }}
      />
      <div
        className="absolute -right-32 top-1/3 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(44,65,96,0.45)" }}
      />

      {/* Sage edge glow, very faint, framing the grid area. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 60%, transparent 55%, rgba(109,187,156,0.08) 78%, transparent 100%)",
        }}
      />

      {/* Single sparing lime accent line, near the vanishing point. */}
      <div
        className="absolute left-1/2 h-px w-40 -translate-x-1/2"
        style={{
          bottom: "34%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(183,207,70,0.35) 50%, transparent 100%)",
        }}
      />

      {/* Center vignette so the middle reads deeper/darker than the edges,
          and top/bottom fades to keep edges calm for overlaid text. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 50% 42%, rgba(26,39,64,0.35) 0%, transparent 70%), linear-gradient(to bottom, rgba(34,51,77,0.35) 0%, transparent 20%, transparent 75%, rgba(26,39,64,0.4) 100%)",
        }}
      />

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .method-backdrop-grid {
            transition: transform 1.2s linear;
          }
        }
      `}</style>
    </div>
  );
}
