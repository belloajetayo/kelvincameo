import { useState } from "react";
import { ASUNJI_BOOKING_EMBED_URL } from "./data";
import { openBookingPopup } from "./BookNowButton";

export function BookingFrame() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative min-h-[720px]">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card px-6 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading the live booking engine…</p>
          <button
            type="button"
            onClick={openBookingPopup}
            className="rounded-md border border-gold px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold hover:text-navy-deep"
          >
            Taking too long? Open booking in a new window
          </button>
        </div>
      )}
      <iframe
        src={ASUNJI_BOOKING_EMBED_URL}
        width="100%"
        height={720}
        style={{ border: 0, maxWidth: "100%" }}
        loading="lazy"
        title="Headless booking engine"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
