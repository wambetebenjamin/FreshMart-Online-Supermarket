import { formatKES } from "./utils";
import type { OrderPayload } from "./whatsapp";

/**
 * Order confirmation email via Nodemailer (SMTP).
 * Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and
 * ORDER_EMAIL_FROM. Without SMTP credentials the email step is skipped
 * gracefully — the WhatsApp confirmation still goes out.
 */

export function isEmailEnabled(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildHtml(o: OrderPayload): string {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e8e8">${i.name} (${i.unit}) × ${i.qty}</td><td style="padding:8px 0;border-bottom:1px solid #e8e8e8;text-align:right">${formatKES(i.price * i.qty)}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;color:#1f1f1f;max-width:560px;margin:auto">
  <div style="background:#b0b435;color:#fff;padding:20px 24px;font-size:18px;font-weight:bold">FreshMart — Order ${o.orderNumber}</div>
  <div style="padding:24px">
    <p>Hi ${o.customerName}, asante for shopping with FreshMart! Your order is confirmed.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
      <tr><td style="padding:8px 0">Subtotal</td><td style="padding:8px 0;text-align:right">${formatKES(o.subtotal)}</td></tr>
      <tr><td style="padding:8px 0">Delivery</td><td style="padding:8px 0;text-align:right">${formatKES(o.deliveryFee)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold">${formatKES(o.total)}</td></tr>
    </table>
    <p style="font-size:13px;color:#666666">Delivery slot: ${o.slot}<br/>Delivering to: ${o.address}</p>
    <p style="font-size:13px;color:#666666">Questions? WhatsApp us on ${"+" + "254 112 272 061"}.</p>
  </div>
</div>`;
}

export async function sendOrderConfirmationEmail(
  to: string,
  o: OrderPayload
): Promise<boolean> {
  if (!isEmailEnabled()) return false;
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });
    await transporter.sendMail({
      from: process.env.ORDER_EMAIL_FROM || "FreshMart <orders@freshmart.co.ke>",
      to,
      subject: `FreshMart order ${o.orderNumber} confirmed — ${formatKES(o.total)}`,
      text: buildOrderMessageForCustomerPlain(o),
      html: buildHtml(o),
    });
    return true;
  } catch {
    return false;
  }
}

function buildOrderMessageForCustomerPlain(o: OrderPayload): string {
  return [
    `Hi ${o.customerName}, asante for shopping with FreshMart!`,
    `Order ${o.orderNumber} is confirmed.`,
    ...o.items.map((i) => `${i.name} (${i.unit}) x${i.qty} - ${formatKES(i.price * i.qty)}`),
    `Subtotal: ${formatKES(o.subtotal)}`,
    `Delivery: ${formatKES(o.deliveryFee)}`,
    `Total: ${formatKES(o.total)}`,
    `Delivery slot: ${o.slot}`,
  ].join("\n");
}
