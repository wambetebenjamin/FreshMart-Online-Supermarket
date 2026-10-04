# FreshMart — Nairobi's Online Supermarket

Fresh. Fast. Delivered to your door. A full e-commerce grocery experience for
Nairobi: fresh produce, meat & fish, dairy, bakery, beverages, household,
baby, personal care and frozen foods — with same-day delivery (order by
10am), M-Pesa payments, weekly subscription boxes and a FreshPoints loyalty
programme.

Built with **Next.js 14 (App Router) + TypeScript**, styled after the
`freshshop-master` design source (palette `#b0b435`, Poppins headings, Dosis
body — extracted verbatim into CSS custom properties).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (ISR, sitemap, PWA)
npm start
```

## Feature map

| Area | Where |
| --- | --- |
| Sticky navbar + live search + mega-menu strip | `src/components/Navbar.tsx`, `SearchBar.tsx`, `/api/search` |
| Hero (word-by-word headline, flip countdown to midnight EAT, optional weather) | `src/components/Hero.tsx`, `/api/weather` |
| Deals auto-scroll carousel (pauses on hover/touch) | `src/components/DealsCarousel.tsx`, `/api/deals` |
| Shop by category (9 tiles, 2-row grid → mobile h-scroll) | `src/components/CategoryTiles.tsx` |
| Featured products (4→3→2→1 cols, vanilla-tilt 3D, wishlist, spring cart badge) | `src/components/ProductCard.tsx` |
| Product detail (gallery zoom, variants, nutrition accordion, reviews, related) | `src/app/products/[slug]` |
| Cart drawer (300ms ease-out, full-width mobile) + checkout | `src/components/CartDrawer.tsx`, `CheckoutForm.tsx` |
| Orders → WhatsApp +254 112 272 061 + customer confirmation | `/api/order`, `src/lib/whatsapp.ts` |
| M-Pesa Daraja STK push | `src/lib/mpesa.ts` |
| Subscription boxes (Veggie / Family / Protein) | `src/components/BundlesSection.tsx`, `/api/subscribe` |
| FreshPoints loyalty (1 pt / KES 100) | `src/components/LoyaltySection.tsx`, `/api/loyalty` |
| Brands marquee, delivery timeline, testimonials, app CTA | `src/components/*` |
| Footer (WhatsApp care, Google map embed, newsletter, M-Pesa/Visa) | `src/components/Footer.tsx` |
| API rate limiting + security headers | `src/middleware.ts`, `next.config.mjs`, `vercel.json` |
| PWA (manifest + service worker) | `public/manifest.webmanifest`, `public/sw.js` |
| ISR (180s) product/category pages, dynamic sitemap, JSON-LD, OG | `src/app/*` |
| Zustand cart + wishlist with localStorage persistence | `src/lib/store/*` |

## API routes

- `GET /api/products?page=&limit=&category=` — paginated catalogue
- `GET /api/products/[slug]` — product detail
- `GET /api/categories/[slug]` — category + products
- `GET /api/search?q=` — live search
- `POST /api/order` — save order, WhatsApp notifications, optional STK push + email
- `POST /api/subscribe` — weekly box subscription + WhatsApp
- `GET/POST /api/loyalty` — FreshPoints balance / join
- `GET /api/deals` — current deals with countdown end (midnight Nairobi)
- `POST /api/newsletter` — save subscriber
- `GET /api/weather` — optional OpenWeatherMap hero line

## Integrations (all optional — graceful fallbacks)

Copy `.env.example` to `.env.local` and fill in what you have:

- **Vercel KV** (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) — persists orders,
  subscriptions, newsletter and FreshPoints. Without it an in-memory store is
  used (fine for local dev).
- **WhatsApp Cloud API** (`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`) —
  server-side delivery of the order breakdown to +254 112 272 061 and the
  confirmation to the customer. The wa.me confirmation link works regardless.
- **M-Pesa Daraja** (`MPESA_*`) — STK push at checkout; falls back to
  pay-on-delivery when unconfigured.
- **SMTP** (`SMTP_*`) — Nodemailer order-confirmation emails.
- **OpenWeatherMap** (`OPENWEATHER_API_KEY`) — hero weather line.

## Design system

Extracted from the uploaded `freshshop-master.zip` (see `:root` in
`src/app/globals.css`):

- Primary `#b0b435` · hover/black `#000000` · headings `#1f1f1f` ·
  body `#666666` · muted `#999999` · soft `#f5f5f5`/`#f4f4f4` ·
  footer `#010101`/`#060606`
- **Poppins** (headings, buttons, nav) + **Dosis** (body) — self-hosted woff2
  via `next/font/local` (no external font requests)
- Body 15px · nav 13px · buttons 12px/uppercase/0.08em · metadata 11px
- Square (0-radius) buttons with the source's expanding-black-circle hover

All photos are real Pexels photography saved locally with per-file credits in
`image-credits.md`. Icons are Lucide (`lucide-react`); brand logos (socials,
WhatsApp, M-Pesa, Visa) are inline SVG wordmarks.

## Motion & accessibility

Word-by-word hero entrance (`cubic-bezier(0.25,1,0.5,1)`, 0.1s stagger),
perspective flip countdown digits, CSS marquees that pause on hover/touch,
60ms product-card stagger, spring cart badge, 300ms cart drawer, 100ms
timeline stagger — all disabled/simplified under `prefers-reduced-motion`.
Focus-visible outlines, aria labels, semantic landmarks throughout.

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel (framework: Next.js — no
   custom build settings needed).
2. Add the env vars from `.env.example` in project settings.
3. Optional: create a Vercel KV store and link it.
4. `vercel.json` applies extra security headers; rate limiting runs in
   `src/middleware.ts` on every `/api/*` route.
