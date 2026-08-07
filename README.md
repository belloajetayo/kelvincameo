# Cameo Resort Charm

Build a modern, elegant hotel website for Kelvin Cameo Resort Hotel, 
located in Suleja/Madalla, Niger State, Nigeria.

STYLE: Warm, upscale hospitality feel — deep gold/burgundy or navy/gold 
accent palette, clean sans-serif typography, large hero imagery, 
generous whitespace. Mobile-first responsive.

PAGES/SECTIONS (single-page scroll with anchor nav):

1. Hero — full-width image, hotel name, tagline, "Book Now" CTA button

2. About — 2-3 sentences on the hotel's location and character

3. Rooms & Suites — cards for each room type with image, name, and 
   price (show weekday rate, note "Weekend rates may vary"):
   
   Single Rooms:
   - Deluxe — ₦25,000/night
   - Executive — ₦35,000/night
   - Sunset — ₦40,000/night
   - Prestige — ₦45,000/night
   - Love Night — ₦50,000/night
   - Golden Nest — ₦60,000/night
   
   Suites:
   - Royal Treat — ₦60,000/night
   - Blissful Breeze — ₦75,000/night
   
   Apartments:
   - Luxury Retreat — ₦160,000/night
   - Royal Retreat — ₦180,000/night
   (Note: ₦50,000 refundable caution fee applies to apartments)
   
   Each card has an "Inquire/Book" button.

4. Amenities — icon grid: Swimming Pool (₦3,000/access — non-guests 
   welcome), Bar, Restaurant, Banquet Hall, 24/7 Reception, 
   Kitchen/Dining, Free Wifi, Parking

5. Gallery — masonry/grid layout for property photos (entrance, pool, 
   banquet hall, rooms, bar, restaurant)

6. Events & Banquet Hall — dedicated section:
   - Full Package (chairs, tables, decor included) — ₦1,050,000
   - À la carte Package — ₦850,000
   Include an inquiry CTA for weddings/celebrations.

7. Reviews/Testimonials — 3 placeholder cards (swap in real reviews 
   later)

8. Contact/Booking — inquiry form (name, phone, email, check-in/out 
   dates, room type dropdown, message); hotel address, phone, 
   WhatsApp link, Google Maps embed

9. Footer — social links (Instagram/Facebook/X: @kelvincameoresort_ng), 
   contact info, copyright

FUNCTIONALITY:
- Sticky nav with smooth scroll to sections
- Booking inquiry form validates and shows success message on submit
- WhatsApp "Book via WhatsApp" floating button
- Image placeholders clearly labeled by section so I can swap in my 
  own photos (rooms/apartment, rooms/single-rooms, rooms/suites, 
  banquet-hall, bar, restaurant, swimming-pool, entrance, reception)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kelvincameo.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9a78c32d-cf8d-4a29-9fd8-ebf7b0645756).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
