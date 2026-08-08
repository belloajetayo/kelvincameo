import { ASUNJI_BOOKING_URL } from "./data";

export function openBookingPopup() {
  const w = 1100;
  const h = 800;
  const left = Math.max(0, (window.screen.width - w) / 2);
  const top = Math.max(0, (window.screen.height - h) / 2);
  const popup = window.open(
    ASUNJI_BOOKING_URL,
    "asunji-booking",
    `popup=yes,width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`,
  );
  if (popup) popup.focus();
  else window.open(ASUNJI_BOOKING_URL, "_blank", "noopener,noreferrer");
}

export function BookNowButton({
  className = "",
  label = "Book Now",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={openBookingPopup}
      className={
        className ||
        "rounded-md bg-linear-to-r from-gold via-gold-soft to-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-navy-deep shadow-lg transition-transform hover:scale-[1.02]"
      }
    >
      {label}
    </button>
  );
}
