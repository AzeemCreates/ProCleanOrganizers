import { createContext, useContext, type ReactNode } from "react";
import type { DerivedSiteContent } from "@/lib/site-content";

const SiteContentReactContext = createContext<DerivedSiteContent | null>(null);

export function SiteContentProvider({
  value,
  children,
}: {
  value: DerivedSiteContent;
  children: ReactNode;
}) {
  return (
    <SiteContentReactContext.Provider value={value}>{children}</SiteContentReactContext.Provider>
  );
}

export function useSiteContent(): DerivedSiteContent {
  const ctx = useContext(SiteContentReactContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
