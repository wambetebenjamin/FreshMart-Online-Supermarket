import { NextResponse } from "next/server";
import { getProduct } from "@/lib/data";

/** GET /api/products/[slug] — single product detail. */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const product = getProduct(params.slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
