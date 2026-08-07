import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/components/site/data";
import { CheckCircle, XCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/site/Nav";

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

type BookingData = {
  name: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: string;
  message: string;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  reference: string;
};

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [paystackRef, setPaystackRef] = useState("");

  useEffect(() => {
    // Load booking data from sessionStorage
    const raw = sessionStorage.getItem("kelvin_booking");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    try {
      setBooking(JSON.parse(raw));
    } catch {
      navigate({ to: "/" });
    }
  }, [navigate]);

  useEffect(() => {
    // Load Paystack script
    if (document.querySelector('script[src*="paystack"]')) return;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePay = () => {
    if (!booking) return;
    setStatus("processing");

    const ref = booking.reference;

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: booking.email,
      amount: booking.totalAmount * 100, // kobo
      currency: "NGN",
      ref,
      metadata: {
        custom_fields: [
          { display_name: "Guest Name", variable_name: "name", value: booking.name },
          { display_name: "Phone", variable_name: "phone", value: booking.phone },
          { display_name: "Room", variable_name: "room_type", value: booking.roomType },
          { display_name: "Check-in", variable_name: "check_in", value: booking.checkIn },
          { display_name: "Check-out", variable_name: "check_out", value: booking.checkOut },
        ],
      },
      callback: async (response) => {
        setPaystackRef(response.reference);
        // Save to Supabase
        const { error } = await supabase.from("bookings").insert({
          reference: response.reference,
          full_name: booking.name,
          phone: booking.phone,
          email: booking.email,
          room_type: booking.roomType,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: Number(booking.guests),
          message: booking.message || null,
        });
        if (error) {
          console.error("Supabase error:", error);
        }
        sessionStorage.removeItem("kelvin_booking");
        setStatus("success");
      },
      onClose: () => {
        setStatus("idle");
      },
    });

    handler.openIframe();
  };

  const waConfirm = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Kelvin Cameo Resort Hotel! I just completed my booking payment. Reference: ${paystackRef}. Name: ${booking?.name}. Room: ${booking?.roomType}. Check-in: ${booking?.checkIn}.`
  )}`;

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-2xl px-5 pt-28 pb-20">

        {/* Back button */}
        {status === "idle" && (
          <button
            onClick={() => navigate({ to: "/" })}
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to booking form
          </button>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="rounded-sm border border-gold/40 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <CheckCircle className="h-8 w-8 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-medium">Booking Confirmed!</h1>
            <p className="mt-2 text-muted-foreground">
              Thank you, <strong>{booking.name}</strong>. Your payment was successful.
            </p>
            <div className="mt-5 rounded-sm bg-secondary px-5 py-4 text-sm text-left space-y-2">
              <p className="font-medium text-foreground">Booking details</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono font-bold text-navy">#{paystackRef}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span>{booking.roomType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{booking.checkIn}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{booking.checkOut}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{booking.guests}</span></div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold">Amount paid</span>
                <span className="font-display text-lg text-navy">₦{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <a
              href={waConfirm}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-sm font-medium text-navy-deep"
            >
              <WhatsAppIcon className="h-5 w-5" /> Send confirmation on WhatsApp
            </a>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-3 w-full rounded-sm border border-border px-6 py-3 text-sm text-muted-foreground hover:border-navy hover:text-foreground transition-colors"
            >
              Back to homepage
            </button>
          </div>
        )}

        {/* PAYMENT SUMMARY */}
        {(status === "idle" || status === "processing") && (
          <div className="rounded-sm bg-card p-7 shadow-sm">
            <p className="eyebrow">Secure Checkout</p>
            <h1 className="mt-2 font-display text-2xl font-medium">Complete your booking</h1>

            {/* Booking summary */}
            <div className="mt-6 rounded-sm border border-border bg-secondary/60 p-5 space-y-3 text-sm">
              <p className="font-medium text-foreground">Booking Summary</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Guest</span><span>{booking.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{booking.roomType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{booking.checkIn}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{booking.checkOut}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{booking.guests}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>{booking.nights}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rate per night</span><span>₦{booking.pricePerNight.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-base font-semibold">Total</span>
                <span className="font-display text-2xl text-navy">₦{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={status === "processing"}
              className="mt-6 w-full rounded-sm bg-gold py-4 text-sm font-medium tracking-wide text-navy-deep transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "processing" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
              ) : (
                <>Pay ₦{booking.totalAmount.toLocaleString()} with Paystack</>
              )}
            </button>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Secured by Paystack · Cards, bank transfer & USSD accepted</span>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground text-center mb-3">Or prefer to pay on arrival?</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello Kelvin Cameo, I'd like to book: ${booking.roomType}, Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}. Name: ${booking.name}, Phone: ${booking.phone}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3 text-sm font-medium text-navy-deep"
              >
                <WhatsAppIcon className="h-4 w-4" /> Confirm via WhatsApp instead
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
