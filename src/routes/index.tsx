import { createFileRoute } from "@tanstack/react-router";
import {
  Waves,
  Wine,
  UtensilsCrossed,
  PartyPopper,
  Clock,
  ChefHat,
  Wifi,
  CarFront,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Star,
  CreditCard,
} from "lucide-react";

import { Nav } from "@/components/site/Nav";
import { BookingForm } from "@/components/site/BookingForm";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import {
  singleRooms,
  suites,
  apartments,
  type Room,
  WHATSAPP_URL,
  PHONE,
  ADDRESS,
  SOCIAL,
  GOOGLE_REVIEWS_URL,
} from "@/components/site/data";

import entrance from "@/assets/entrance.jpg.asset.json";
import exterior from "@/assets/exterior.jpg.asset.json";
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

const title = "Kelvin Cameo Resort Hotel — Luxury Stays in Suleja, Niger State";
const description =
  "Elegant rooms, suites and apartments in Suleja. Pool, bar, restaurant and a 1,000-guest banquet hall. Book your stay at Kelvin Cameo Resort Hotel.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: entrance.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: entrance.url },
    ],
  }),
  component: Index,
});

function SectionHeading({ eyebrow, heading, copy }: { eyebrow: string; heading: string; copy?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium sm:text-4xl">{heading}</h2>
      {copy && <p className="mt-4 text-muted-foreground">{copy}</p>}
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-card shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={room.image}
          alt={`${room.name} room at Kelvin Cameo Resort Hotel`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-xs bg-navy-deep/80 px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground/80">
          {room.imageLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium">{room.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{room.blurb}</p>
        <p className="mt-4 font-display text-2xl text-navy">
          {room.price}
          <span className="text-sm text-muted-foreground"> / night</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Weekend rates may vary</p>
        <a
          href="#contact"
          className="mt-4 inline-flex items-center justify-center rounded-sm border border-navy px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-primary-foreground"
        >
          Inquire / Book
        </a>
      </div>
    </article>
  );
}

const amenities = [
  { icon: Waves, label: "Swimming Pool", note: "₦3,000 per access — non-guests welcome" },
  { icon: Wine, label: "Bar", note: "Cocktails, spirits and chilled drinks" },
  { icon: UtensilsCrossed, label: "Restaurant", note: "Continental & Nigerian dishes" },
  { icon: PartyPopper, label: "Banquet Hall", note: "Weddings and celebrations" },
  { icon: Clock, label: "24/7 Reception", note: "Always here to help" },
  { icon: ChefHat, label: "Kitchen & Dining", note: "In apartments and suites" },
  { icon: Wifi, label: "Free Wifi", note: "Fast internet throughout" },
  { icon: CarFront, label: "Parking", note: "Secure on-site parking" },
];

const gallery = [
  { src: entrance.url, label: "entrance", span: "sm:row-span-2" },
  { src: barCounter.url, label: "bar", span: "" },
  { src: banquet.url, label: "banquet-hall", span: "" },
  { src: barLounge.url, label: "bar & lounge", span: "" },
  { src: loungePoolTable.url, label: "games lounge", span: "sm:row-span-2" },
  { src: loungeView.url, label: "lounge", span: "" },
  { src: pool, label: "swimming-pool", span: "" },
  { src: restaurant, label: "restaurant", span: "" },
  { src: apartmentLounge.url, label: "rooms/apartment", span: "" },
  { src: suiteLounge.url, label: "rooms/suites", span: "" },
  { src: roomPurple.url, label: "rooms/single-rooms", span: "" },
  { src: apartmentHall.url, label: "reception", span: "" },
  { src: dining2.url, label: "rooms/apartment", span: "" },
  { src: exterior.url, label: "entrance", span: "" },
  { src: evening.url, label: "entrance", span: "" },
];

const partners = [
  "Booking.com",
  "Hotels.ng",
  "Agoda",
  "Expedia",
  "Jumia Travel",
  "Airbnb",
];

const payments = [
  { label: "Paystack", note: "Cards & bank transfer" },
  { label: "Flutterwave", note: "Cards, USSD & mobile money" },
  { label: "Bank Transfer", note: "Direct NGN transfer on arrival" },
  { label: "POS / Cash", note: "Accepted at reception" },
];


const reviews = [
  {
    quote:
      "Spotless rooms, warm staff and the best pool in Suleja. We extended our stay by two nights.",
    name: "Amaka O.",
    role: "Family stay",
  },
  {
    quote:
      "We hosted our wedding reception in the banquet hall. The decor package was worth every naira.",
    name: "Ibrahim & Zainab",
    role: "Wedding, 2025",
  },
  {
    quote:
      "The Royal Retreat apartment felt like home — full kitchen, quiet, and great value for business travel.",
    name: "Tunde A.",
    role: "Business traveller",
  },
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <Nav />

      <main>
        {/* HERO */}
        <section id="hero" className="relative flex min-h-[92vh] items-center">
          <img
            src={evening.url}
            alt="Kelvin Cameo Resort Hotel exterior at dusk"
            width={1200}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy-deep/90 via-navy-deep/70 to-navy-deep/40" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-20">
            <p className="eyebrow">Suleja · Niger State</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              Kelvin Cameo <span className="text-gold">Resort Hotel</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              Distinguished comfort on the Abuja–Kaduna corridor. Rooms, suites and apartments with
              a pool, restaurant and grand banquet hall.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-sm bg-gold px-7 py-3.5 text-sm font-medium tracking-wide text-navy-deep transition-opacity hover:opacity-90"
              >
                Book Now
              </a>
              <a
                href="#rooms"
                className="rounded-sm border border-primary-foreground/40 px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:border-gold hover:text-gold"
              >
                View Rooms
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section-pad">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
            <div>
              <p className="eyebrow">About the hotel</p>
              <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
                Warm hospitality, minutes from Abuja
              </h2>
              <p className="mt-5 text-muted-foreground">
                Kelvin Cameo Resort Hotel sits in the heart of Suleja — a short drive from
                Abuja city centre and the airport corridor. Our property blends contemporary
                architecture with genuinely warm Nigerian hospitality.
              </p>
              <p className="mt-4 text-muted-foreground">
                Whether you are here for business, a weekend escape or a celebration, you will find
                immaculate rooms, an inviting pool, an unhurried bar and restaurant, and a team that
                remembers your name.
              </p>
            </div>
            <div className="relative">
              <img
                src={exterior.url}
                alt="Front facade of Kelvin Cameo Resort Hotel"
                loading="lazy"
                width={1200}
                height={1600}
                className="w-full rounded-sm object-cover shadow-lg"
              />
              <span className="absolute left-3 top-3 rounded-xs bg-navy-deep/80 px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground/80">
                entrance
              </span>
            </div>
          </div>
        </section>

        {/* ROOMS */}
        <section id="rooms" className="section-pad bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHeading
              eyebrow="Stay with us"
              heading="Rooms, Suites & Apartments"
              copy="Rates shown are weekday rates. Weekend rates may vary — contact reception for the current tariff."
            />

            <h3 className="mt-14 font-display text-xl tracking-wide text-navy">Single Rooms</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {singleRooms.map((r) => (
                <RoomCard key={r.name} room={r} />
              ))}
            </div>

            <h3 className="mt-16 font-display text-xl tracking-wide text-navy">Suites</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suites.map((r) => (
                <RoomCard key={r.name} room={r} />
              ))}
            </div>

            <h3 className="mt-16 font-display text-xl tracking-wide text-navy">Apartments</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {apartments.map((r) => (
                <RoomCard key={r.name} room={r} />
              ))}
            </div>
            <p className="mt-6 rounded-sm border-l-2 border-gold bg-card px-4 py-3 text-sm text-muted-foreground">
              A refundable caution fee of ₦50,000 applies to all apartment bookings.
            </p>
          </div>
        </section>

        {/* AMENITIES */}
        <section id="amenities" className="section-pad">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHeading eyebrow="On the property" heading="Amenities & Facilities" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {amenities.map(({ icon: Icon, label, note }) => (
                <div key={label} className="rounded-sm border border-border bg-card p-6">
                  <Icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
                  <h3 className="mt-4 font-display text-lg font-medium">{label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="section-pad bg-navy-deep">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-3 text-3xl font-medium text-primary-foreground sm:text-4xl">
                A look around the resort
              </h2>
            </div>
            <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-4">
              {gallery.map((g, i) => (
                <figure key={i} className={`group relative overflow-hidden rounded-sm ${g.span}`}>
                  <img
                    src={g.src}
                    alt={`${g.label} at Kelvin Cameo Resort Hotel`}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-navy-deep/85 to-transparent px-3 py-2 text-[10px] uppercase tracking-widest text-primary-foreground/85">
                    {g.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="section-pad">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
            <div className="relative">
              <img
                src={banquet.url}
                alt="Banquet hall set for an event at Kelvin Cameo Resort Hotel"
                loading="lazy"
                width={1200}
                height={900}
                className="w-full rounded-sm object-cover shadow-lg"
              />
              <span className="absolute left-3 top-3 rounded-xs bg-navy-deep/80 px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground/80">
                banquet-hall
              </span>
            </div>
            <div>
              <p className="eyebrow">Events</p>
              <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Banquet Hall & Celebrations</h2>
              <p className="mt-4 text-muted-foreground">
                Weddings, birthdays, conferences and thanksgivings — our banquet hall is dressed to
                impress, with in-house decor, seating and an experienced events team.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-sm border border-gold/50 bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-medium">Full Package</h3>
                    <p className="font-display text-2xl text-navy">₦1,050,000</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hall, chairs, tables and full decor included.
                  </p>
                </div>
                <div className="rounded-sm border border-border bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-medium">À la carte Package</h3>
                    <p className="font-display text-2xl text-navy">₦850,000</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hall only — bring your own decor and vendors.
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-8 inline-flex rounded-sm bg-gold px-7 py-3.5 text-sm font-medium text-navy-deep transition-opacity hover:opacity-90"
              >
                Inquire about your event
              </a>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section-pad bg-secondary/60">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHeading eyebrow="Guest voices" heading="What our guests say" />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {reviews.map((r) => (
                <blockquote key={r.name} className="rounded-sm bg-card p-7 shadow-sm">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-foreground/90">“{r.quote}”</p>
                  <footer className="mt-5 text-sm">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-muted-foreground"> · {r.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-navy px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-primary-foreground"
              >
                <Star className="h-4 w-4" /> Read & write our Google reviews
              </a>
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="border-y border-border py-12">
          <div className="mx-auto max-w-7xl px-5 text-center">
            <p className="eyebrow">Also find us on</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {partners.map((p) => (
                <span key={p} className="font-display text-lg text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PAYMENTS */}
        <section className="section-pad">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHeading
              eyebrow="Payments"
              heading="Pay the Nigerian way"
              copy="Reserve online free of charge and settle at reception — card, bank transfer, USSD, POS or cash all welcome."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {payments.map((p) => (
                <div key={p.label} className="rounded-sm border border-border bg-card p-6 text-center">
                  <CreditCard className="mx-auto h-6 w-6 text-gold" strokeWidth={1.5} />
                  <h3 className="mt-3 font-display text-lg font-medium">{p.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* CONTACT */}
        <section id="contact" className="section-pad pb-28 lg:pb-20">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHeading
              eyebrow="Reservations"
              heading="Book your stay"
              copy="Send an inquiry, call reception, or reach us instantly on WhatsApp."
            />
            <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
              <div className="lg:sticky lg:top-28">
                <BookingForm />
              </div>


              <div className="space-y-6">
                <div className="rounded-sm border border-border bg-card p-6">
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                      <span>{ADDRESS}</span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                      <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
                    </li>
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                      <a href="mailto:info@kelvincameoresort.com">info@kelvincameoresort.com</a>
                    </li>
                    <li className="flex gap-3">
                      <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" />
                      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                        WhatsApp inquiries: {PHONE}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="overflow-hidden rounded-sm border border-border">
                  <iframe
                    title="Map to Kelvin Cameo Resort Hotel, Suleja"
                    src="https://www.google.com/maps?q=Kelvin%20Cameo%20Resort%20Hotel%20Suleja%20Niger%20State%20Nigeria&output=embed"
                    className="h-[340px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-navy-deep py-14 text-primary-foreground/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg text-primary-foreground">
              Kelvin Cameo <span className="text-gold">Resort Hotel</span>
            </p>
            <p className="mt-3 text-sm">{ADDRESS}</p>
          </div>
          <div className="text-sm">
            <p className="eyebrow">Contact</p>
            <p className="mt-3">{PHONE}</p>
            <p className="mt-1">info@kelvincameoresort.com</p>
          </div>
          <div className="text-sm">
            <p className="eyebrow">Follow</p>
            <div className="mt-3 flex gap-4">
              <a href="https://instagram.com/kelvincameoresort_ng" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 transition-colors hover:text-gold" strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com/kelvincameoresort_ng" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 transition-colors hover:text-gold" strokeWidth={1.5} />
              </a>
              <a href="https://x.com/kelvincameoresort_ng" target="_blank" rel="noreferrer" aria-label="X">
                <span className="text-base font-semibold transition-colors hover:text-gold">X</span>
              </a>
            </div>
            <p className="mt-3">{SOCIAL}</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-primary-foreground/10 px-5 pt-6 text-xs">
          © {new Date().getFullYear()} Kelvin Cameo Resort Hotel. All rights reserved.
        </div>
      </footer>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-20 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-medium text-navy-deep shadow-xl transition-transform hover:scale-105 sm:bottom-5"
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="hidden sm:inline">WhatsApp Inquiries</span>
      </a>

      {/* Sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-navy-deep/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <a
          href="#contact"
          className="block rounded-sm bg-gold py-3 text-center text-sm font-medium tracking-wide text-navy-deep"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
