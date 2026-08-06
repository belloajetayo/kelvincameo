import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
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

export function BookingForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState("");
  const [reference, setReference] = useState("");

  const set = (k: keyof typeof empty, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setSent(false);
      return;
    }
    if (new Date(values.checkOut) <= new Date(values.checkIn)) {
      setErrors({ checkOut: "Check-out must be after check-in" });
      return;
    }
    setErrors({});
    setFailed("");
    setSaving(true);

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        full_name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        room_type: result.data.roomType,
        check_in: result.data.checkIn,
        check_out: result.data.checkOut,
        guests: Number(result.data.guests),
        message: result.data.message || null,
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      setFailed("We couldn't save your booking just now. Please try again or reach us on WhatsApp.");
      return;
    }

    setReference((data?.id ?? "").slice(0, 8).toUpperCase());
    setSent(true);
    setValues(empty);
  };

  const waConfirm = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Kelvin Cameo Resort Hotel, I just booked on your website. My booking reference is ${reference}.`,
  )}`;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-sm bg-card p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-2xl font-medium">Book your room</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reserve directly on this website — your booking goes straight to our reception team.
      </p>

      {sent && (
        <div
          role="status"
          className="mt-5 rounded-sm border border-gold/40 bg-secondary px-4 py-4 text-sm text-foreground"
        >
          <p className="font-medium">Booking received — reference #{reference}</p>
          <p className="mt-1 text-muted-foreground">
            Our reception team will confirm your reservation shortly.
          </p>
          <a
            href={waConfirm}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2.5 text-sm font-medium text-navy-deep"
          >
            <WhatsAppIcon className="h-4 w-4" /> Confirm on WhatsApp
          </a>
        </div>
      )}

      {failed && (
        <p role="alert" className="mt-5 rounded-sm border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {failed}
        </p>
      )}

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
          <input type="date" className={field} value={values.checkIn} onChange={(e) => set("checkIn", e.target.value)} />
          {errors['checkIn'] && <p className="mt-1 text-xs text-destructive">{errors['checkIn']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Check-out</label>
          <input type="date" className={field} value={values.checkOut} onChange={(e) => set("checkOut", e.target.value)} />
          {errors['checkOut'] && <p className="mt-1 text-xs text-destructive">{errors['checkOut']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Room type</label>
          <select className={field} value={values.roomType} onChange={(e) => set("roomType", e.target.value)}>
            <option value="">Select a room or apartment</option>
            {allRoomNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="Banquet Hall / Event">Banquet Hall / Event</option>
          </select>
          {errors['roomType'] && <p className="mt-1 text-xs text-destructive">{errors['roomType']}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Guests</label>
          <select className={field} value={values.guests} onChange={(e) => set("guests", e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={String(n)}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
          {errors['guests'] && <p className="mt-1 text-xs text-destructive">{errors['guests']}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Special requests</label>
          <textarea
            rows={4}
            maxLength={1000}
            className={field}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full rounded-sm bg-navy px-6 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-navy-deep disabled:opacity-60"
      >
        {saving ? "Sending your booking…" : "Book Now"}
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
