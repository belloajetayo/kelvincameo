import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { allRoomNames, WHATSAPP_NUMBER } from "./data";
import { WhatsAppIcon } from "./WhatsAppIcon";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const PAYSTACK_PUBLIC_KEY = "pk_test_fe42fdcfcdb27f36b88b7ebe39ec910bedcda0a7";

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
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState("");
  const [reference, setReference] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);

  const set = (k: keyof typeof empty, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const nights = getNights(values.checkIn, values.checkOut);
  const pricePerNight = ROOM_PRICES[values.roomType] ?? 0;
  const totalAmount = pricePerNight * nights;

  const saveBooking = async (ref: string, paid: boolean) => {
    const result = schema.safeParse(values);
    if (!result.success) return;

    const { error } = await supabase
      .from("bookings")
      .insert({
        reference: ref,
        full_name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        room_type: result.data.roomType,
        check_in: result.data.checkIn,
        check_out: result.data.checkOut,
        guests: Number(result.data.guests),
        message: result.data.message || null,
      });

    if (error) {
      setFailed("We couldn't save your booking. Please try WhatsApp.");
      setSaving(false);
      return;
    }

    setReference(ref);
    setSent(true);
    setSaving(false);
    setPaymentStep(false);
    setValues(empty);
  };

  const handlePaystack = () => {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: values.email,
      amount: totalAmount * 100, // kobo
      currency: "NGN",
      ref,
      metadata: {
        name: values.name,
        phone: values.phone,
        room_type: values.roomType,
        check_in: values.checkIn,
        check_out: values.checkOut,
      },
      callback: async (response) => {
        setSaving(true);
        await saveBooking(response.reference, true);
      },
      onClose: () => {
        setSaving(false);
      },
    });
    handler.openIframe();
  };

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
    setPaymentStep(true);
  };

  const waConfirm = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Kelvin Cameo Resort Hotel, I just booked on your website. My booking reference is ${reference}.`,
  )}`;

  return (
    <>
      {/* Paystack script */}
      <script src="https://js.paystack.co/v1/inline.js" async />

      <form onSubmit={onSubmit} noValidate className="rounded-sm bg-card p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-2xl font-medium">Book your room</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Reserve directly — secure Paystack payment accepted.
        </p>

        {/* Success */}
        {sent && (
          <div
            role="status"
            className="mt-5 rounded-sm border border-gold/40 bg-secondary px-4 py-4 text-sm text-foreground"
          >
            <p className="font-medium">✅ Booking confirmed — reference #{reference}</p>
            <p className="mt-1 text-muted-foreground">
              Payment received. Our team will confirm your room shortly.
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

        {/* Payment summary step */}
        {paymentStep && !sent && (
          <div className="mt-5 rounded-sm border border-gold/50 bg-secondary p-5">
            <p className="font-display text-lg font-medium">Confirm your booking</p>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Room</span>
                <span className="font-medium text-foreground">{values.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="font-medium text-foreground">{values.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="font-medium text-foreground">{values.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights</span>
                <span className="font-medium text-foreground">{nights}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display text-xl text-navy">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handlePaystack}
                disabled={saving}
                className="flex-1 rounded-sm bg-gold py-3 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Processing…" : "Pay with Paystack"}
              </button>
              <button
                type="button"
                onClick={() => setPaymentStep(false)}
                className="rounded-sm border border-border px-4 py-3 text-sm text-muted-foreground hover:border-navy"
              >
                Edit
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Secured by Paystack · Cards, bank transfer & USSD accepted
            </p>
          </div>
        )}

        {/* Form fields — hide when on payment step */}
        {!paymentStep && !sent && (
          <>
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
                <textarea
                  rows={3}
                  maxLength={1000}
                  className={field}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>
            </div>

            {/* Price preview */}
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
              Book Now — Pay with Paystack
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Kelvin Cameo Resort Hotel, I have an inquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" /> Inquire on WhatsApp
            </a>
          </>
        )}
      </form>
    </>
  );
}
