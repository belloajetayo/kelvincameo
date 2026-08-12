import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { singleRooms, suites, apartments } from "@/components/site/data";

const entrance = "/images/entrance.jpg";
const exterior = "/images/exterior.jpg";
const annex = "/images/annex.jpg";
const evening = "/images/evening.jpg";
const apartmentLounge = "/images/apartment-lounge.jpg";
const apartmentHall = "/images/apartment-hall.jpg";
const suiteLounge = "/images/suite-lounge.jpg";
const roomPurple = "/images/room-purple.jpg";
const dining2 = "/images/dining-2.jpg";
const barCounter = "/images/bar-counter.jpg";
const barLounge = "/images/bar-lounge.jpg";
const loungePoolTable = "/images/lounge-pool-table.jpg";
const loungeView = "/images/lounge-view.jpg";
const banquet = "/images/banquet-hall.jpg";
const pool = "/images/swimming-pool.jpg";
const restaurant = "/images/restaurant.jpg";

export type GalleryItem = { key: string; src: string; label: string; span: string };

/** Gallery / amenity photos. `key` is the slot name staff can override. */
export const gallery: GalleryItem[] = [
  { key: "gallery:entrance", src: entrance, label: "entrance", span: "sm:row-span-2" },
  { key: "gallery:bar", src: barCounter, label: "bar", span: "" },
  { key: "gallery:banquet", src: banquet, label: "banquet-hall", span: "" },
  { key: "gallery:bar-lounge", src: barLounge, label: "bar & lounge", span: "" },
  { key: "gallery:games-lounge", src: loungePoolTable, label: "games lounge", span: "sm:row-span-2" },
  { key: "gallery:lounge", src: loungeView, label: "lounge", span: "" },
  { key: "gallery:pool", src: pool, label: "swimming-pool", span: "" },
  { key: "gallery:restaurant", src: restaurant, label: "restaurant", span: "" },
  { key: "gallery:apartment", src: apartmentLounge, label: "rooms/apartment", span: "" },
  { key: "gallery:suite", src: suiteLounge, label: "rooms/suites", span: "" },
  { key: "gallery:single-room", src: roomPurple, label: "rooms/single-rooms", span: "" },
  { key: "gallery:reception", src: apartmentHall, label: "reception", span: "" },
  { key: "gallery:dining", src: dining2, label: "rooms/apartment", span: "" },
  { key: "gallery:exterior", src: exterior, label: "entrance", span: "" },
  { key: "gallery:evening", src: evening, label: "entrance", span: "" },
];

/** Big feature photos used outside the gallery grid. */
export const FEATURE_IMAGES = {
  "hero:main": evening,
  "hero:annex": annex,
  "about:annex": annex,
  "about:main": exterior,
  "events:banquet": banquet,
} as const;

export type ImageSlot = { key: string; label: string; group: string; fallback: string };

export const IMAGE_SLOTS: ImageSlot[] = [
  ...[...singleRooms, ...suites, ...apartments].map((r) => ({
    key: `room:${r.name}`,
    label: r.name,
    group: "Rooms, suites & apartments",
    fallback: r.image,
  })),
  ...gallery.map((g) => ({
    key: g.key,
    label: g.key.replace("gallery:", "").replace(/-/g, " "),
    group: "Gallery & amenities",
    fallback: g.src,
  })),
  { key: "hero:main", label: "Hero — main branch", group: "Feature photos", fallback: FEATURE_IMAGES["hero:main"] },
  { key: "hero:annex", label: "Hero — annex branch", group: "Feature photos", fallback: FEATURE_IMAGES["hero:annex"] },
  { key: "about:main", label: "About — main hotel", group: "Feature photos", fallback: FEATURE_IMAGES["about:main"] },
  { key: "about:annex", label: "About — the annex", group: "Feature photos", fallback: FEATURE_IMAGES["about:annex"] },
  { key: "events:banquet", label: "Events — banquet hall", group: "Feature photos", fallback: FEATURE_IMAGES["events:banquet"] },
];

export const BUCKET = "site-images";

/** Public URL served through our own proxy route (the bucket itself is private). */
export function siteImageUrl(path: string, updatedAt?: string) {
  const v = updatedAt ? `?v=${encodeURIComponent(updatedAt)}` : "";
  return `/api/public/site-image/${path}${v}`;
}

export type SiteImageRow = { key: string; path: string; updated_at: string };

export async function fetchSiteImages(): Promise<Record<string, string>> {
  const { data } = await supabase.from("site_images").select("key, path, updated_at");
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as SiteImageRow[]) {
    map[row.key] = siteImageUrl(row.path, row.updated_at);
  }
  return map;
}

/** Returns a resolver: give it a slot key + built-in image, get the live image. */
export function useSiteImages() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    void fetchSiteImages().then((map) => {
      if (active) setOverrides(map);
    });
    return () => {
      active = false;
    };
  }, []);

  return (key: string, fallback: string) => overrides[key] ?? fallback;
}
