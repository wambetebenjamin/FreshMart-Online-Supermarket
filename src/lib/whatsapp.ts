import { formatKES, SITE } from "./utils";

/**
 * WhatsApp integration.
 *
 * 1. WhatsApp Cloud API (production): set WHATSAPP_TOKEN and
 *    WHATSAPP_PHONE_NUMBER_ID. Messages are then delivered server-side —
 *    the full order breakdown goes to the FreshMart number (+254 112 272 061)
 *    and a confirmation goes to the customer.
 * 2. wa.me deep links (always available): the confirmation screen hands the
 *    customer a prefilled chat link, so the flow works even before the
 *    Cloud API is connected.
 */

const CLOUD_API = "https://graph.facebook.com/v18.0";

export function isWhatsAppCloudEnabled(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Send a WhatsApp text via the Cloud API. Returns true when delivered. */
export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  if (!isWhatsAppCloudEnabled()) return false;
  // to must be a bare international number, e.g. 2547XXXXXXXX
  const number = to.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${CLOUD_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        type: "text",
        text: { preview_url: false, body },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface OrderLine {
  name: string;
  unit: string;
  qty: number;
  price: number;
}

export interface OrderPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  slot: string;
  notes?: string;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}

/** The full breakdown that goes to the FreshMart operations number. */
export function buildOrderMessageForBusiness(o: OrderPayload): string {
  const lines = o.items
    .map((i) => `• ${i.name} (${i.unit}) × ${i.qty} — ${formatKES(i.price * i.qty)}`)
    .join("\n");
  return [
    `*NEW FRESHMART ORDER ${o.orderNumber}*`,
    ``,
    `*Customer:* ${o.customerName}`,
    `*Phone:* ${o.phone}`,
    `*Address:* ${o.address}`,
    `*Delivery slot:* ${o.slot}`,
    o.notes ? `*Notes:* ${o.notes}` : null,
    ``,
    `*Items:*`,
    lines,
    ``,
    `Subtotal: ${formatKES(o.subtotal)}`,
    `Delivery: ${formatKES(o.deliveryFee)}`,
    `*TOTAL: ${formatKES(o.total)}*`,
    `Payment: ${o.paymentMethod}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** The confirmation the customer receives, with their order number. */
export function buildOrderMessageForCustomer(o: OrderPayload): string {
  return [
    `Asante ${o.customerName.split(" ")[0]}! 🧺`,
    ``,
    `Your FreshMart order *${o.orderNumber}* is confirmed.`,
    `Total: *${formatKES(o.total)}* (${o.paymentMethod})`,
    `Delivery slot: ${o.slot}`,
    `We deliver to: ${o.address}`,
    ``,
    `Track or change your order any time on WhatsApp.`,
  ].join("\n");
}

/** Prefilled wa.me chat link the customer can open from the thank-you page. */
export function customerConfirmUrl(o: OrderPayload): string {
  const text = encodeURIComponent(
    `Hello FreshMart! I just placed order ${o.orderNumber} (${formatKES(o.total)}). Please confirm my delivery.`
  );
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}
