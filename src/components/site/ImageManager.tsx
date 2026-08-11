import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, IMAGE_SLOTS, siteImageUrl, type ImageSlot } from "@/components/site/images";

type Row = { key: string; path: string; updated_at: string };

export function ImageManager() {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_images").select("key, path, updated_at");
    const map: Record<string, Row> = {};
    for (const r of (data ?? []) as Row[]) map[r.key] = r;
    setRows(map);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = useMemo(() => {
    const g: Record<string, ImageSlot[]> = {};
    for (const slot of IMAGE_SLOTS) (g[slot.group] ??= []).push(slot);
    return g;
  }, []);

  async function upload(slot: ImageSlot, file: File) {
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setNotice("That image is larger than 8MB — please use a smaller one.");
      return;
    }
    setBusy(slot.key);
    setNotice("");

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${slot.key.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });

    if (upErr) {
      setBusy(null);
      setNotice(`Upload failed: ${upErr.message}`);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("site_images").upsert(
      { key: slot.key, path, updated_by: userData.user?.id ?? null, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

    setBusy(null);
    if (error) {
      setNotice(`Could not save: ${error.message}`);
      return;
    }
    setNotice(`${slot.label} updated. Refresh the website to see it live.`);
    await load();
  }

  async function reset(slot: ImageSlot) {
    setBusy(slot.key);
    const existing = rows[slot.key];
    if (existing) await supabase.storage.from(BUCKET).remove([existing.path]);
    await supabase.from("site_images").delete().eq("key", slot.key);
    setBusy(null);
    setNotice(`${slot.label} reset to the original photo.`);
    await load();
  }

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Website images</p>
          <h2 className="mt-2 font-display text-2xl font-medium">Replace photos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a new photo for any room, amenity or feature image. Changes go live immediately —
            no code needed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground"
        >
          Refresh
        </button>
      </div>

      {notice && (
        <p className="mt-4 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 text-sm">{notice}</p>
      )}

      {Object.entries(groups).map(([group, slots]) => (
        <div key={group} className="mt-8">
          <h3 className="font-display text-lg font-medium">{group}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {slots.map((slot) => {
              const current = rows[slot.key];
              const preview = current ? siteImageUrl(current.path, current.updated_at) : slot.fallback;
              return (
                <div key={slot.key} className="overflow-hidden rounded-sm border border-border bg-card">
                  <div className="aspect-4/3 bg-secondary">
                    {preview ? (
                      <img
                        src={preview}
                        alt={`${slot.label} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                        No photo yet
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display text-sm font-medium capitalize">{slot.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {current ? "Custom photo" : "Original photo"}
                    </p>
                    <label className="mt-3 block cursor-pointer rounded-sm border border-navy px-3 py-2 text-center text-xs uppercase tracking-wider text-navy hover:bg-navy hover:text-primary-foreground">
                      {busy === slot.key ? "Uploading…" : "Replace photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={busy !== null}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) void upload(slot, file);
                        }}
                      />
                    </label>
                    {current && (
                      <button
                        type="button"
                        onClick={() => void reset(slot)}
                        disabled={busy !== null}
                        className="mt-2 w-full rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Reset to original
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
