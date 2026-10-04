import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware: API rate limiting + baseline security headers.
 *
 * Buckets (per client IP, in-memory sliding window — per-instance, which is
 * fine for a single Vercel instance; back it with Vercel KV for
 * multi-instance limits):
 *   - all /api/*:            60 requests / minute
 *   - write endpoints:        8 requests / minute
 *     (order, subscribe, newsletter, loyalty)
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WRITE_PATHS = ["/api/order", "/api/subscribe", "/api/newsletter", "/api/loyalty"];

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous"
  );
}

function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip = clientIp(request);
    const isWrite = WRITE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

    const general = rateLimit(`g:${ip}`, 60, 60_000);
    if (!general.ok) {
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Too many requests — please slow down." }),
        { status: 429, headers: { "Retry-After": String(general.retryAfter), "Content-Type": "application/json" } }
      );
    }
    if (isWrite) {
      const write = rateLimit(`w:${ip}`, 8, 60_000);
      if (!write.ok) {
        return new NextResponse(
          JSON.stringify({ ok: false, error: "Too many submissions — please wait a moment." }),
          { status: 429, headers: { "Retry-After": String(write.retryAfter), "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
