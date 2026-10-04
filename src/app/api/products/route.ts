import { NextResponse } from "next/server";
import { products, categories } from "@/lib/data";

/**
 * GET /api/products?page=1&limit=12&category=fruits-and-vegetables
 * Paginated product catalogue (JSON source; swap in Vercel KV by setting
 * KV_REST_API_URL / KV_REST_API_TOKEN — see src/lib/kv.ts).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12) || 12));
  const category = searchParams.get("category");

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const items = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    page,
    limit,
    total,
    pages,
    categories: categories.map((c) => c.slug),
    items,
  });
}
