import { useState } from "react";
import { z } from "zod";
import { allRoomNames } from "./data";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(255),
  checkIn: z.string().min(1, "Select a check-in date"),
  checkOut: z.string().min(1, "Select a check-out date"),
  roomType: z.string().min(1, "Select a room type"),
  message: z.string().trim().max(1000).optional(),
});

const empty = {
  name: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  roomType: "",
  message: "",
};

const field =
  "w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-hidden transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

export function BookingForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof empty, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
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
    setSent(true);
    setValues(empty);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-sm bg-card p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-2xl font-medium">Booking Inquiry</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Send us your details and our reception team will confirm availability.
      </p>

      {sent && (
        <p
          role="status"
          className="mt-5 rounded-sm border border-gold/40 bg-secondary px-4 py-3 text-sm text-foreground"
        >
          Thank you — your inquiry has been received. We will contact you shortly to confirm your
          reservation.
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
        <div className="sm:col-span-2">
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
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Message</label>
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
        className="mt-6 w-full rounded-sm bg-navy px-6 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-navy-deep"
      >
        Send Inquiry
      </button>
    </form>
  );
}
