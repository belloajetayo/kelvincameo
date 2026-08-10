import singleRoom from "@/assets/single-room.jpg.asset.json";
import roomPurple from "@/assets/room-purple.jpg.asset.json";
import roomDeluxe from "@/assets/room-deluxe.jpg.asset.json";
import roomExecutive from "@/assets/room-executive.jpg.asset.json";
import roomSunset from "@/assets/room-sunset.jpg.asset.json";
import roomPrestige from "@/assets/room-prestige.jpg.asset.json";
import suiteLounge from "@/assets/suite-lounge.jpg.asset.json";
import apartmentHall from "@/assets/apartment-hall.jpg.asset.json";
import apartmentLounge from "@/assets/apartment-lounge.jpg.asset.json";
import dining from "@/assets/dining.jpg.asset.json";

export type Room = {
  name: string;
  price: string;
  image: string;
  imageLabel: string;
  blurb: string;
};

export const singleRooms: Room[] = [
  { name: "Deluxe", price: "₦25,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Cosy en-suite with king bed, AC and smart TV." },
  { name: "Executive", price: "₦35,000", image: roomPurple.url, imageLabel: "rooms/single-rooms", blurb: "Extra space, work desk and premium bedding." },
  { name: "Sunset", price: "₦40,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Warm evening light and a private lounge chair." },
  { name: "Prestige", price: "₦45,000", image: roomPurple.url, imageLabel: "rooms/single-rooms", blurb: "Refined finishes with a generous seating corner." },
  { name: "Love Night", price: "₦50,000", image: singleRoom.url, imageLabel: "rooms/single-rooms", blurb: "Romantic styling for couples and getaways." },
  { name: "Golden Nest", price: "₦60,000", image: roomPurple.url, imageLabel: "rooms/single-rooms", blurb: "Our finest single room, styled in gold." },
];

export const suites: Room[] = [
  { name: "Royal Treat", price: "₦60,000", image: suiteLounge.url, imageLabel: "rooms/suites", blurb: "Separate lounge, king bed and elevated comfort." },
  { name: "Blissful Breeze", price: "₦75,000", image: apartmentHall.url, imageLabel: "rooms/suites", blurb: "Airy suite with expansive living space." },
];

export const apartments: Room[] = [
  { name: "Luxury Retreat", price: "₦160,000", image: apartmentLounge.url, imageLabel: "rooms/apartment", blurb: "Full apartment with kitchen, lounge and dining." },
  { name: "Royal Retreat", price: "₦180,000", image: dining.url, imageLabel: "rooms/apartment", blurb: "Our largest residence for extended stays." },
];

export const allRoomNames = [...singleRooms, ...suites, ...apartments].map((r) => r.name);

export const WHATSAPP_NUMBER = "2348055558197";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Kelvin%20Cameo%20Resort%20Hotel%2C%20I%27d%20like%20to%20make%20a%20booking`;
export const PHONE = "+234 805 555 8197";
export const ADDRESS = "Suleja, Niger State, Nigeria";
export const SOCIAL = "@kelvincameoresort_ng";
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Kelvin+Cameo+Resort+Hotel+Suleja";

export const ASUNJI_BOOKING_URL = "https://kelvin-cameo-resort-hotel.asunji.com/book?property=54";
export const ASUNJI_BOOKING_EMBED_URL =
  "https://kelvin-cameo-resort-hotel.asunji.com/book?property=54&headless=1";
export const ASUNJI_STAFF_URL = "https://kelvin-cameo-resort-hotel.asunji.com/app";
