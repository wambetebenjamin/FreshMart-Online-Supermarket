import { NextResponse } from "next/server";
import { getCategory, productsByCategory } from "@/lib/data";

/** GET /api/categories/[slug] — category metadata + its products. */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const category = getCategory(params.slug);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...category,
    products: productsByCategory(params.slug),
  });
}
