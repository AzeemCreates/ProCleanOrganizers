import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { getSiteContent } from "@/lib/site-content";
import { SiteContentProvider } from "@/lib/site-content-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_DESC =
  "Professional organizing, space design, and time management in NYC and the surrounding metro area. Schedule a free consultation with ProClean Organizers.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ loaderData }) => {
    const business = loaderData?.business;
    const SITE_NAME = business?.name ?? "ProClean Organizers";
    const SITE_TAGLINE = business?.slogan ?? "Tidy is Mighty.";
    const LOCAL_BUSINESS_JSONLD = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: SITE_NAME,
      slogan: SITE_TAGLINE,
      description: SITE_DESC,
      telephone: business?.phoneHref?.replace("tel:", "") ?? "+1-609-359-3992",
      email: business?.email ?? "ProCleanOrganizers2020@gmail.com",
      founder: { "@type": "Person", name: business?.owner ?? "Mujahid Ibn Abdellah" },
      foundingDate: String(business?.established ?? "2020"),
      priceRange: "$$",
      areaServed: [
        { "@type": "City", name: "Manhattan" },
        { "@type": "City", name: "Queens" },
        { "@type": "City", name: "Bronx" },
        { "@type": "City", name: "Brooklyn" },
        { "@type": "AdministrativeArea", name: "Westchester County" },
        { "@type": "AdministrativeArea", name: "Long Island" },
        { "@type": "AdministrativeArea", name: "Northern New Jersey" },
        { "@type": "AdministrativeArea", name: "Connecticut" },
      ],
    };

    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} - ${SITE_TAGLINE}` },
      { name: "description", content: SITE_DESC },
      { name: "author", content: "ProClean Organizers" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: `${SITE_NAME} - ${SITE_TAGLINE}` },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: `${SITE_NAME} - ${SITE_TAGLINE}` },
      { name: "twitter:description", content: SITE_DESC },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(LOCAL_BUSINESS_JSONLD),
      },
    ],
    };
  },
  loader: () => getSiteContent(),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function useTranslateLang() {
  const [lang, setLang] = useState<"en" | "es">("en");
  useEffect(() => {
    const m = document.cookie.match(/googtrans=\/en\/(\w+)/);
    setLang(m?.[1] === "es" ? "es" : "en");
  }, []);
  return lang;
}

function RootShell({ children }: { children: ReactNode }) {
  const lang = useTranslateLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <div
          id="google_translate_element"
          style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden" }}
          aria-hidden="true"
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const content = Route.useLoaderData();

  useEffect(() => {
    const w = window as any;
    if (w.google?.translate?.TranslateElement) return;
    w.googleTranslateElementInit = function () {
      new w.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es",
          layout: w.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteContentProvider value={content}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster richColors position="top-center" />
      </SiteContentProvider>
    </QueryClientProvider>
  );
}
