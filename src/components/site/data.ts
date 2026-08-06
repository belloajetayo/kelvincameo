import singleRoom from "@/assets/single-room.jpg.asset.json";
import suite from "@/assets/suite.jpg";
import apartment from "@/assets/apartment.jpg";

export type Room = {
  name: string;
  price: string;
  image: string;
  imageLabel: string;
  blurb: string;
};

export const singleRooms: Room[] = [
  { name: "Deluxe", price: "₦25,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Cosy en-suite with king bed, AC and smart TV." },
  { name: "Executive", price: "₦35,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Extra space, work desk and premium bedding." },
  { name: "Sunset", price: "₦40,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Warm evening light and a private lounge chair." },
  { name: "Prestige", price: "₦45,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Refined finishes with a generous seating corner." },
  { name: "Love Night", price: "₦50,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Romantic styling for couples and getaways." },
  { name: "Golden Nest", price: "₦60,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Our finest single room, styled in gold." },
];

export const suites: Room[] = [
  { name: "Royal Treat", price: "₦60,000", image: suite, imageLabel: "rooms/suites", blurb: "Separate lounge, king bed and elevated comfort." },
  { name: "Blissful Breeze", price: "₦75,000", image: suite, imageLabel: "rooms/suites", blurb: "Airy suite with expansive living space." },
];

export const apartments: Room[] = [
  { name: "Luxury Retreat", price: "₦160,000", image: apartment, imageLabel: "rooms/apartment", blurb: "Full apartment with kitchen, lounge and dining." },
  { name: "Royal Retreat", price: "₦180,000", image: apartment, imageLabel: "rooms/apartment", blurb: "Our largest residence for extended stays." },
];

export const allRoomNames = [...singleRooms, ...suites, ...apartments].map((r) => r.name);

export const WHATSAPP_URL = "https://wa.me/2348000000000?text=Hello%20Kelvin%20Cameo%20Resort%20Hotel%2C%20I%27d%20like%20to%20make%20a%20booking";
export const PHONE = "+234 800 000 0000";
export const ADDRESS = "Madalla, Suleja, Niger State, Nigeria";
export const SOCIAL = "@kelvincameoresort_ng";
