import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { allRoomNames, WHATSAPP_NUMBER } from "./data";
import { WhatsAppIcon } from "./WhatsAppIcon";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(255),
  checkIn: z.string().min(1, "Select a check-in date"),
  checkOut: z.string().min(1, "Select a check-out date"),
  roomType: z.string().min(1, "Select a room type"),
  guests: z.string().min(1, "Select number of guests"),
  message: z.string().trim().max(1000).optional(),
});

const ROOM_PRICES: Record<string, number> = {
  "Deluxe": 25000,
  "Executive": 35000,
  "Sunset": 40000,
  "Prestige": 45000,
  "Classic Suite": 55000,
  "Royal Retreat": 75000,
  "Presidential Suite": 95000,
  "Studio Apartment": 60000,
  "One-Bedroom Apartment": 80000,
  "Two-Bedroom Apartment": 110000,
  "Banquet Hall / Event": 850000,
};

const empty = {
  name: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  roomType: "",
  guests: "1",
  message: "",
};

const field =
  "w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-hidden transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function BookingForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof empty, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const nights = getNights(values.checkIn, values.checkOut);
  const pricePerNight = ROOM_PRICES[values.roomType] ?? 0;
  const totalAmount = pricePerNight * nights;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    if (new Date(values.checkOut) <= new Date(values.checkIn)) {
      setErrors({ checkOut: "Check-out must be after check-in" });
      return;
    }
    setErrors({});

    // Generate reference and save booking data to sessionStorage
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();

    sessionStorage.setItem("kelvin_booking", JSON.stringify({
      ...values,
      nights,
      pricePerNight,
      totalAmount,
      reference: ref,
    }));

    // Navigate to payment page
    navigate({ to: "/payment" });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-sm bg-card p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-2xl font-medium">Book your room</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in your details — you'll confirm and pay on the next page.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Full name</label>
          <input className={field} value={values.name} onChange={(e) => set("name", e.target.value)} maxLength={100} />
          {errors['name'] && <p className="mt-1 text-xs text-destructive">{errors['name']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Phone</label>
          <input className={field} value={values.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} />
          {errors['phone'] && <p className="mt-1 text-xs text-destructive">{errors['phone']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Email</label>
          <input className={field} value={values.email} onChange={(e) => set("email", e.target.value)} maxLength={255} />
          {errors['email'] && <p className="mt-1 text-xs text-destructive">{errors['email']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Check-in</label>
          <input type="date" className={field} value={values.checkIn} min={new Date().toISOString().split('T')[0]} onChange={(e) => set("checkIn", e.target.value)} />
          {errors['checkIn'] && <p className="mt-1 text-xs text-destructive">{errors['checkIn']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Check-out</label>
          <input type="date" className={field} value={values.checkOut} min={values.checkIn || new Date().toISOString().split('T')[0]} onChange={(e) => set("checkOut", e.target.value)} />
          {errors['checkOut'] && <p className="mt-1 text-xs text-destructive">{errors['checkOut']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Room type</label>
          <select className={field} value={values.roomType} onChange={(e) => set("roomType", e.target.value)}>
            <option value="">Select a room or apartment</option>
            {allRoomNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
            <option value="Banquet Hall / Event">Banquet Hall / Event</option>
          </select>
          {errors['roomType'] && <p className="mt-1 text-xs text-destructive">{errors['roomType']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Guests</label>
          <select className={field} value={values.guests} onChange={(e) => set("guests", e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Special requests</label>
          <textarea rows={3} maxLength={1000} className={field} value={values.message} onChange={(e) => set("message", e.target.value)} />
        </div>
      </div>

      {/* Live price preview */}
      {values.roomType && values.checkIn && values.checkOut && (
        <div className="mt-4 rounded-sm border border-gold/30 bg-secondary/60 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">₦{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span className="font-display font-medium text-navy">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-5 w-full rounded-sm bg-gold px-6 py-3.5 text-sm font-medium tracking-wide text-navy-deep transition-opacity hover:opacity-90"
      >
        Continue to Payment →
      </button>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Kelvin Cameo Resort Hotel, I have an inquiry.")}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90"
      >
        <WhatsAppIcon className="h-5 w-5" /> Inquire on WhatsApp
      </a>
    </form>
  );
}
