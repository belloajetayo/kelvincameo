import { useEffect, useRef, useState } from "react";
import { ASUNJI_BOOKING_EMBED_URL, ASUNJI_BOOKING_URL } from "./data";

const CACHE_KEY = "asunji-embed-ok";
const TIMEOUT_MS = 12000;

export function BookingFrame({ onUnavailable }: { onUnavailable?: () => void }) {
  // Cached result of a previous successful load in this session — skips the spinner flash.
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cached =
      typeof window !== "undefined" && window.sessionStorage.getItem(CACHE_KEY) === "1";
    if (cached) setLoaded(true);

    timer.current = setTimeout(() => {
      setLoaded((isLoaded) => {
        if (!isLoaded) {
          setFailed(true);
          onUnavailable?.();
        }
        return isLoaded;
      });
    }, TIMEOUT_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [onUnavailable]);

  const handleLoad = () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      window.sessionStorage.setItem(CACHE_KEY, "1");
    } catch {
      /* storage unavailable — non-fatal */
    }
    setLoaded(true);
  };

  if (failed) return null;

  return (
    <div className="relative min-h-[720px]">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card px-6 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading the live booking engine…</p>
          <a
            href={ASUNJI_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#0071C2",
              color: "#fff",
              fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              padding: "11px 22px",
              borderRadius: "6px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            Book Now
          </a>
        </div>
      )}
      <iframe
        src={ASUNJI_BOOKING_EMBED_URL}
        width="100%"
        height={720}
        style={{ border: 0, maxWidth: "100%", display: "block" }}
        loading="lazy"
        title="Headless booking engine"
        onLoad={handleLoad}
        onError={() => {
          setFailed(true);
          onUnavailable?.();
        }}
        allow="payment"
      />
    </div>
  );
}
