import { Reveal } from "@/components/reveal";
import { useSiteContent } from "@/lib/site-content-context";

/**
 * "The ProClean Method" — the full nine steps rendered as a single continuous
 * vertical timeline (hairline + nodes + text, no cards) on the dark navy
 * background supplied by the parent section. Each step reveals one-by-one on
 * scroll via <Reveal>, and replays if scrolled out and back.
 */
export function MethodTimeline() {
  const { methodSteps } = useSiteContent();

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-28">
      <p className="text-sm font-bold uppercase tracking-wider text-brand-teal">
        The ProClean Method
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
        Nine steps to lasting <span className="text-brand-lime">order.</span>
      </h2>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-brand-teal/90">
        The same disciplined sequence on every project, from first walkthrough
        to final follow-up.
      </p>

      <ol className="relative mt-16">
        {/* Continuous hairline running the full height behind the nodes */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-brand-teal/40"
          aria-hidden
        />

        {methodSteps.map((step, i) => (
          <Reveal key={step.name} index={i}>
            <li className="group relative flex gap-6 pb-12 last:pb-0">
              {/* Node */}
              <span className="relative z-10 mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-brand-teal/70 bg-primary transition-all duration-300 group-hover:border-brand-lime group-hover:scale-125">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime/70 transition-colors duration-300 group-hover:bg-brand-lime" />
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-bold tabular-nums text-brand-teal transition-colors duration-300 group-hover:text-brand-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-primary-foreground transition-colors duration-300 group-hover:text-brand-lime md:text-xl">
                    {step.name}
                  </h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/70 md:text-base">
                  {step.description}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
