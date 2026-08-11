import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageManager } from "@/components/site/ImageManager";
import logo from "@/assets/logo.jpg.asset.json";

export const Route = createFileRoute("/_authenticated/staff")({
  component: StaffDashboard,
  head: () => ({
    meta: [
      { title: "Staff Dashboard — Kelvin Cameo Resort Hotel" },
      {
        name: "description",
        content: "Manage website bookings and payment status for Kelvin Cameo Resort Hotel.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Dashboard — Kelvin Cameo Resort Hotel" },
      {
        property: "og:description",
        content: "Manage website bookings and payment status for Kelvin Cameo Resort Hotel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Booking = {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  message: string | null;
  status: string;
  payment_status: string;
  amount_paid: number | null;
  staff_notes: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "checked_in", "completed", "cancelled"];
const PAYMENTS = ["unpaid", "deposit", "paid", "refunded"];

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function StaffDashboard() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? "");
      const { data: roles } = await supabase.from("user_roles").select("role");
      const STAFF_EMAILS = ["kelvincameo73@gmail.com"];
      const userEmail = userData.user?.email ?? "";
      const ok = STAFF_EMAILS.includes(userEmail) || (roles ?? []).some((r) => r.role === "admin" || r.role === "staff");
      setAllowed(ok);
      if (ok) await load();
      else setLoading(false);
    })();
  }, [load]);

  async function signOut() {
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  async function patch(id: string, values: Partial<Booking>) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...values } : b)));
    await supabase.from("bookings").update(values).eq("id", id);
  }

  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const paidCount = bookings.filter((b) => b.payment_status === "paid").length;
  const revenue = bookings.reduce((sum, b) => sum + Number(b.amount_paid ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-navy-deep">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logo.url}
              alt="Kelvin Cameo Resort Hotel logo"
              width={96}
              height={96}
              className="h-10 w-10 rounded-sm bg-white object-contain p-1"
            />
            <div>
              <p className="font-display text-base text-primary-foreground">Staff Dashboard</p>
              <p className="text-xs text-primary-foreground/60">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-primary-foreground/70 hover:text-gold">
              View website
            </a>
            <button
              type="button"
              onClick={signOut}
              className="rounded-sm border border-primary-foreground/25 px-4 py-2 text-sm text-primary-foreground hover:border-gold hover:text-gold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        {allowed === false && (
          <div className="rounded-sm border border-border bg-card p-8">
            <h1 className="font-display text-2xl font-medium">Access pending</h1>
            <p className="mt-3 text-muted-foreground">
              Your account was created but has not been granted staff access yet. Ask a manager to
              approve <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>
        )}

        {allowed && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total bookings", value: String(bookings.length) },
                { label: "Paid", value: String(paidCount) },
                { label: "Recorded payments", value: naira.format(revenue) },
              ].map((s) => (
                <div key={s.label} className="rounded-sm border border-border bg-card p-5">
                  <p className="eyebrow">{s.label}</p>
                  <p className="mt-2 font-display text-2xl font-medium">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["all", ...STATUSES].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  className={`rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider ${
                    filter === s
                      ? "border-gold bg-gold text-navy-deep"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void load()}
                className="ml-auto rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground"
              >
                Refresh
              </button>
            </div>

            {loading && <p className="mt-8 text-muted-foreground">Loading bookings…</p>}

            {!loading && shown.length === 0 && (
              <p className="mt-8 text-muted-foreground">No bookings in this view yet.</p>
            )}

            <div className="mt-6 space-y-4">
              {shown.map((b) => (
                <article key={b.id} className="rounded-sm border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-medium">
                        {b.full_name}{" "}
                        <span className="text-sm text-muted-foreground">#{b.reference}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {b.room_type} · {b.guests} guest{b.guests > 1 ? "s" : ""} · {b.check_in} →{" "}
                        {b.check_out}
                      </p>
                      <p className="mt-1 text-sm">
                        <a href={`tel:${b.phone}`} className="underline underline-offset-4">
                          {b.phone}
                        </a>{" "}
                        ·{" "}
                        <a href={`mailto:${b.email}`} className="underline underline-offset-4">
                          {b.email}
                        </a>
                      </p>
                      {b.message && (
                        <p className="mt-2 text-sm text-muted-foreground">“{b.message}”</p>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wider"
                    >
                      WhatsApp guest
                    </a>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Booking status
                      <select
                        value={b.status}
                        onChange={(e) => void patch(b.id, { status: e.target.value })}
                        className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Payment status
                      <select
                        value={b.payment_status}
                        onChange={(e) => void patch(b.id, { payment_status: e.target.value })}
                        className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
                      >
                        {PAYMENTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Amount paid (₦)
                      <input
                        type="number"
                        min={0}
                        defaultValue={b.amount_paid ?? ""}
                        onBlur={(e) =>
                          void patch(b.id, {
                            amount_paid: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>

            <ImageManager />
          </>
        )}
      </main>
    </div>
  );
}
