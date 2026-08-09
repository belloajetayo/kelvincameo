declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY'] as
  | string
  | undefined;

let initialized = false;

export function initAnalytics() {
  if (typeof window === "undefined" || initialized || !measurementId) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

/** Track a conversion click (Book Now, WhatsApp, etc.) with its on-page source. */
export function trackClick(action: string, source: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", action, {
    event_category: "conversion",
    event_label: source,
    source,
  });
  window.dataLayer?.push({ event: action, source });
}
