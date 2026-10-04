import { NextResponse } from "next/server";
import { getDeals } from "@/lib/data";
import { nextMidnightNairobiISO, percentOff } from "@/lib/utils";

/** GET /api/deals — current deals with countdown end times (midnight Nairobi). */
export async function GET() {
  const endsAt = nextMidnightNairobiISO();
  return NextResponse.json({
    endsAt,
    deals: getDeals().map((p) => ({
      slug: p.slug,
      name: p.name,
      unit: p.unit,
      image: p.image,
      price: p.price,
      dealPrice: p.dealPrice,
      percentOff: percentOff(p.price, p.dealPrice),
      stock: p.stock,
    })),
  });
}
