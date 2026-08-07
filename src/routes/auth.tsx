import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Staff Login — Kelvin Cameo Resort Hotel" },
      {
        name: "description",
        content:
          "Secure staff sign-in for the Kelvin Cameo Resort Hotel reservations desk in Suleja, Niger State.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Login — Kelvin Cameo Resort Hotel" },
      {
        property: "og:description",
        content: "Secure staff sign-in for the Kelvin Cameo Resort Hotel reservations desk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/staff", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        void navigate({ to: "/staff", replace: true });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/staff` },
        });
        if (err) throw err;
        if (data.session) {
          void navigate({ to: "/staff", replace: true });
        } else {
          setNotice("Account created. Check your email to confirm, then sign in.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep px-5 py-16">
      <div className="w-full max-w-md rounded-sm border border-gold/25 bg-card p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Kelvin Cameo Resort Hotel logo"
            width={96}
            height={96}
            className="h-12 w-12 rounded-sm bg-white object-contain p-1"
          />
          <div>
            <p className="eyebrow">Staff area</p>
            <h1 className="font-display text-xl font-medium">Kelvin Cameo Resort Hotel</h1>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to view and manage website bookings."
            : "Create a staff account. Access is granted by a manager after sign-up."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-gold py-3 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-5 w-full text-center text-sm text-muted-foreground underline underline-offset-4"
        >
          {mode === "signin" ? "Need a staff account?" : "Already have an account? Sign in"}
        </button>

        <a
          href="/"
          className="mt-6 block text-center text-xs tracking-widest uppercase text-muted-foreground"
        >
          ← Back to website
        </a>
      </div>
    </div>
  );
}
