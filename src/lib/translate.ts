// Client-only translation helpers using Google Translate

export function getCurrentLang(): "en" | "es" {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return m?.[1] === "es" ? "es" : "en";
}

function setCookie(name: string, value: string, domain?: string) {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=${value}; expires=${expires}; path=/${domainPart}`;
}

function clearCookie(name: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
}

function parentDomain(): string | undefined {
  if (typeof location === "undefined") return undefined;
  const host = location.hostname;
  const parts = host.split(".");
  if (parts.length < 2) return undefined; // localhost
  return "." + parts.slice(-2).join(".");
}

export function toggleLanguage() {
  if (typeof document === "undefined") return;
  const current = getCurrentLang();
  const next = current === "en" ? "es" : "en";
  const value = `/en/${next}`;
  const parent = parentDomain();

  // Clear any stale cookies first (both host + parent domain scopes)
  clearCookie("googtrans");
  if (parent) clearCookie("googtrans", parent);

  if (next === "es") {
    setCookie("googtrans", value);
    if (parent) setCookie("googtrans", value, parent);
  }
  window.location.reload();
}
