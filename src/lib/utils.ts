export const SITE = {
  name: "FreshMart",
  legalName: "FreshMart Online Supermarket",
  tagline: "Fresh. Fast. Delivered to Your Door.",
  description:
    "FreshMart is Nairobi's online supermarket. Order fresh produce, meat, dairy, bakery and household essentials by 10am and get same-day delivery anywhere in Nairobi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://freshmart.co.ke",
  phoneDisplay: "+254 112 272 061",
  whatsappNumber: "254112272061",
  email: "care@freshmart.co.ke",
  address: "Mombasa Road, Nairobi, Kenya",
  deliveryFee: 150,
  sameDayCutoff: "10:00 AM",
  currency: "KES",
} as const;

export const WHATSAPP_HELP_URL =
  "https://wa.me/254112272061?text=Hello!%20I%20need%20help%20with%20my%20FreshMart%20order.";

export const DELIVERY_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
] as const;

/** Format an integer amount as Kenyan Shillings, e.g. 1250 -> "KES 1,250" */
export function formatKES(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString("en-US")}`;
}

/** Percentage saved when buying at dealPrice instead of price. */
export function percentOff(price: number, dealPrice?: number): number {
  if (!dealPrice || dealPrice >= price) return 0;
  return Math.round(((price - dealPrice) / price) * 100);
}

/**
 * Milliseconds until the next midnight in Nairobi (EAT, UTC+3 — no DST).
 * Deals reset every night at midnight Nairobi time.
 */
export function msUntilMidnightNairobi(now: Date = new Date()): number {
  const EAT_OFFSET_MS = 3 * 60 * 60 * 1000;
  const eat = new Date(now.getTime() + EAT_OFFSET_MS);
  const nextMidnightEATUtcMs = Date.UTC(
    eat.getUTCFullYear(),
    eat.getUTCMonth(),
    eat.getUTCDate() + 1
  );
  return nextMidnightEATUtcMs - EAT_OFFSET_MS - now.getTime();
}

/** ISO timestamp of the next Nairobi midnight (deal countdown end). */
export function nextMidnightNairobiISO(now: Date = new Date()): string {
  return new Date(now.getTime() + msUntilMidnightNairobi(now)).toISOString();
}

export function splitDuration(ms: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
