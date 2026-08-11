import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { singleRooms, suites, apartments } from "@/components/site/data";

import entrance from "@/assets/entrance.jpg.asset.json";
import exterior from "@/assets/exterior.jpg.asset.json";
import annex from "@/assets/annex.jpg.asset.json";
import evening from "@/assets/evening.jpg.asset.json";
import apartmentLounge from "@/assets/apartment-lounge.jpg.asset.json";
import apartmentHall from "@/assets/apartment-hall.jpg.asset.json";
import suiteLounge from "@/assets/suite-lounge.jpg.asset.json";
import roomPurple from "@/assets/room-purple.jpg.asset.json";
import dining2 from "@/assets/dining-2.jpg.asset.json";
import barCounter from "@/assets/bar-counter.jpg.asset.json";
import barLounge from "@/assets/bar-lounge.jpg.asset.json";
import loungePoolTable from "@/assets/lounge-pool-table.jpg.asset.json";
import loungeView from "@/assets/lounge-view.jpg.asset.json";
import banquet from "@/assets/banquet-hall.jpg.asset.json";
import pool from "@/assets/swimming-pool.jpg";
import restaurant from "@/assets/restaurant.jpg";

export type GalleryItem = { key: string; src: string; label: string; span: string };

/** Gallery / amenity photos. `key` is the slot name staff can override. */
export const gallery: GalleryItem[] = [
  { key: "gallery:entrance", src: entrance.url, label: "entrance", span: "sm:row-span-2" },
  { key: "gallery:bar", src: barCounter.url, label: "bar", span: "" },
  { key: "gallery:banquet", src: banquet.url, label: "banquet-hall", span: "" },
  { key: "gallery:bar-lounge", src: barLounge.url, label: "bar & lounge", span: "" },
  { key: "gallery:games-lounge", src: loungePoolTable.url, label: "games lounge", span: "sm:row-span-2" },
  { key: "gallery:lounge", src: loungeView.url, label: "lounge", span: "" },
  { key: "gallery:pool", src: pool, label: "swimming-pool", span: "" },
  { key: "gallery:restaurant", src: restaurant, label: "restaurant", span: "" },
  { key: "gallery:apartment", src: apartmentLounge.url, label: "rooms/apartment", span: "" },
  { key: "gallery:suite", src: suiteLounge.url, label: "rooms/suites", span: "" },
  { key: "gallery:single-room", src: roomPurple.url, label: "rooms/single-rooms", span: "" },
  { key: "gallery:reception", src: apartmentHall.url, label: "reception", span: "" },
  { key: "gallery:dining", src: dining2.url, label: "rooms/apartment", span: "" },
  { key: "gallery:exterior", src: exterior.url, label: "entrance", span: "" },
  { key: "gallery:evening", src: evening.url, label: "entrance", span: "" },
];

/** Big feature photos used outside the gallery grid. */
export const FEATURE_IMAGES = {
  "hero:main": evening.url,
  "hero:annex": annex.url,
  "about:annex": annex.url,
  "about:main": exterior.url,
  "events:banquet": banquet.url,
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
