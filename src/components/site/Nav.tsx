import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ASUNJI_STAFF_URL } from "@/components/site/data";
import { BookNowButton, openBookingPopup } from "@/components/site/BookNowButton";

const links = [
  { href: "#about", label: "About" },
  { href: "#rooms", label: "Rooms" },
  { href: "#amenities", label: "Amenities" },
  { href: "#gallery", label: "Gallery" },
  { href: "#events", label: "Events" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-navy-deep/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        {/* Brand name only — no logo */}
        <a href="#hero" className="flex min-w-0 items-center">
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-semibold tracking-wide text-primary-foreground sm:text-lg">
              Kelvin Cameo <span className="text-gold">Resort Hotel</span>
            </span>
            <span className="block text-[10px] tracking-[0.25em] uppercase text-primary-foreground/60">
              Relax · Recharge · Reconnect
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-primary-foreground/80 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <BookNowButton className="rounded-md bg-linear-to-r from-gold via-gold-soft to-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-md transition-transform hover:scale-[1.03]" />
        </div>

        {/* Mobile menu icon button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-sm p-2 text-primary-foreground hover:text-gold transition-colors lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-primary-foreground/10 bg-navy-deep px-5 pb-6 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-primary-foreground/10 py-3 text-primary-foreground/85"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => { setOpen(false); openBookingPopup(); }}
              className="mt-4 rounded-md bg-linear-to-r from-gold via-gold-soft to-gold px-5 py-3 text-center font-semibold text-navy-deep shadow-md"
            >
              Book Now
            </button>
            <a
              href={ASUNJI_STAFF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-center text-xs tracking-widest uppercase text-primary-foreground/50"
            >
              Staff Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
