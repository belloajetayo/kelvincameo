import { useEffect, useState } from "react";

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
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
        <a href="#hero" className="min-w-0">
          <span className="block truncate font-display text-base font-semibold tracking-wide text-primary-foreground sm:text-lg">
            Kelvin Cameo <span className="text-gold">Resort Hotel</span>
          </span>
          <span className="block text-[10px] tracking-[0.25em] uppercase text-primary-foreground/60">
            Suleja · Niger State
          </span>
        </a>

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
          <a
            href="#contact"
            className="rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90"
          >
            Book Now
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-sm border border-primary-foreground/25 px-3 py-2 text-sm text-primary-foreground lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

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
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-sm bg-gold px-5 py-3 text-center font-medium text-navy-deep"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
