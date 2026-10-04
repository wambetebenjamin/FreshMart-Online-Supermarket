import { NextResponse } from "next/server";
import { bundles } from "@/lib/data";
import { kvAppendToList } from "@/lib/kv";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { formatKES, SITE } from "@/lib/utils";

const PHONE_RE = /^[0-9+][0-9 ]{8,14}$/;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * POST /api/subscribe — saves a weekly box subscription and notifies
 * FreshMart on WhatsApp.
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const address = String(body?.address ?? "").trim();
  const day = DAYS.includes(body?.day) ? body.day : "Monday";
  const bundle = bundles.find((b) => b.slug === String(body?.bundle ?? ""));

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please provide your full name." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid phone number." }, { status: 400 });
  }
  if (!address || address.length < 5) {
    return NextResponse.json({ ok: false, error: "Please provide a delivery address." }, { status: 400 });
  }
  if (!bundle) {
    return NextResponse.json({ ok: false, error: "Unknown subscription box." }, { status: 400 });
  }

  const subscription = {
    id: `SUB-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    bundle: bundle.slug,
    bundleName: bundle.name,
    price: bundle.price,
    name,
    phone,
    address,
    day,
    createdAt: new Date().toISOString(),
  };

  await kvAppendToList("fm:subscriptions", subscription);

  await sendWhatsAppText(
    SITE.whatsappNumber,
    [
      `*NEW SUBSCRIPTION ${subscription.id}*`,
      ``,
      `*Customer:* ${name} (${phone})`,
      `*Box:* ${bundle.name} — ${formatKES(bundle.price)}/week`,
      `*Day:* Every ${day}`,
      `*Address:* ${address}`,
    ].join("\n")
  );

  return NextResponse.json({ ok: true, subscriptionId: subscription.id });
}
