import { NextResponse } from "next/server";
import { getProduct } from "@/lib/data";
import { kvAppendToList, kvGet, kvSet } from "@/lib/kv";
import {
  buildOrderMessageForBusiness,
  buildOrderMessageForCustomer,
  customerConfirmUrl,
  sendWhatsAppText,
  type OrderPayload,
} from "@/lib/whatsapp";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { stkPush } from "@/lib/mpesa";
import { SITE } from "@/lib/utils";

const PHONE_RE = /^[0-9+][0-9 ]{8,14}$/;

/**
 * POST /api/order
 * Saves the order (Vercel KV when configured), sends the full breakdown to
 * the FreshMart WhatsApp number (+254 112 272 061), confirms to the customer,
 * optionally triggers an M-Pesa STK push and a confirmation email.
 * Prices are always recomputed server-side from the catalogue.
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const c = body?.customer ?? {};
  const name = String(c.name ?? "").trim();
  const phone = String(c.phone ?? "").trim();
  const address = String(c.address ?? "").trim();
  const mpesaNumber = String(c.mpesaNumber ?? phone ?? "").trim();
  const slot = String(c.slot ?? "").trim();
  const notes = String(c.notes ?? "").trim().slice(0, 400);
  const paymentMethod = body?.paymentMethod === "mpesa" ? "mpesa" : "pay-on-delivery";
  const rawItems: Array<{ slug?: string; qty?: number; unit?: string }> = Array.isArray(body?.items)
    ? body.items
    : [];

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please provide your full name." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid phone number." }, { status: 400 });
  }
  if (!address || address.length < 5) {
    return NextResponse.json({ ok: false, error: "Please provide a delivery address." }, { status: 400 });
  }
  if (rawItems.length === 0) {
    return NextResponse.json({ ok: false, error: "Your basket is empty." }, { status: 400 });
  }

  // Recompute every line server-side — never trust client prices.
  const lines: OrderPayload["items"] = [];
  for (const raw of rawItems) {
    const product = getProduct(String(raw.slug ?? ""));
    if (!product) continue;
    const qty = Math.min(99, Math.max(1, Math.round(Number(raw.qty ?? 1) || 1)));
    // Variant pricing when the cart stored a variant label
    const variant = product.variants?.find((v) => v.label === raw.unit);
    const unit = variant ? variant.label : product.unit;
    const price = variant ? variant.price : product.dealPrice ?? product.price;
    lines.push({ name: product.name, unit, qty, price });
  }
  if (lines.length === 0) {
    return NextResponse.json({ ok: false, error: "None of the basket items could be found." }, { status: 400 });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const deliveryFee = SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  const orderNumber = `FM-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 5)}`;

  const payload: OrderPayload = {
    orderNumber,
    customerName: name,
    phone,
    address,
    slot: slot || "10:00 AM – 12:00 PM",
    notes: notes || undefined,
    items: lines,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod === "mpesa" ? "M-Pesa STK push" : "Pay on delivery",
  };

  // 1) Save the order
  await kvSet(`fm:order:${orderNumber}`, JSON.stringify({ ...payload, createdAt: new Date().toISOString() }));
  await kvAppendToList("fm:orders", { orderNumber, name, phone, total, at: new Date().toISOString() });

  // 2) WhatsApp — full breakdown to the FreshMart operations number
  await sendWhatsAppText(SITE.whatsappNumber, buildOrderMessageForBusiness(payload));
  // ...and a confirmation to the customer (Cloud API when configured)
  await sendWhatsAppText(phone, buildOrderMessageForCustomer(payload));

  // 3) M-Pesa STK push when requested and Daraja is configured
  let mpesaInitiated = false;
  if (paymentMethod === "mpesa") {
    const result = await stkPush(
      mpesaNumber,
      total,
      orderNumber,
      `FreshMart ${orderNumber}`,
      `${SITE.url}/api/order`
    );
    mpesaInitiated = result.initiated;
  }

  // 4) Confirmation email (SMTP when configured)
  if (body?.customer?.email) {
    await sendOrderConfirmationEmail(String(body.customer.email), payload);
  }

  // 5) FreshPoints — award 1 point per KES 100 if the phone is a member
  try {
    const key = `fm:loyalty:${phone.replace(/[^0-9]/g, "")}`;
    const rawMember = await kvGet(key);
    if (rawMember) {
      const member = JSON.parse(rawMember);
      member.points = (member.points ?? 0) + Math.floor(total / 100);
      await kvSet(key, JSON.stringify(member));
    }
  } catch {
    /* loyalty is best-effort */
  }

  return NextResponse.json({
    ok: true,
    orderNumber,
    subtotal,
    deliveryFee,
    total,
    payment: { method: paymentMethod, mpesaInitiated },
    whatsappConfirmUrl: customerConfirmUrl(payload),
  });
}
