import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

/** GET /api/search?q=avocado — live search across product names. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = searchProducts(q, 8);
  return NextResponse.json({
    q,
    count: results.length,
    results: results.map((p) => ({
      slug: p.slug,
      name: p.name,
      unit: p.unit,
      price: p.dealPrice ?? p.price,
      image: p.image,
      category: p.category,
    })),
  });
}
