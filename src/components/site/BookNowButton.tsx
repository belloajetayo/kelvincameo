export function openBookingPopup() {
  const url = "https://kelvin-cameo-resort-hotel.asunji.com/book?property=54";
  const w = 1100;
  const h = 800;
  const left = Math.max(0, (window.screen.width - w) / 2);
  const top = Math.max(0, (window.screen.height - h) / 2);
  const popup = window.open(
    url,
    "asunji-booking",
    `popup=yes,width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`,
  );
  if (popup) popup.focus();
  else window.open(url, "_blank", "noopener,noreferrer");
}

export function BookNowButton({
  className = "",
  label = "Book Now",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href="https://kelvin-cameo-resort-hotel.asunji.com/book?property=54"
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
      }}
      className={className || ""}
    >
      {label}
    </a>
  );
}
