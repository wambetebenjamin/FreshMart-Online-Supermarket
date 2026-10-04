/**
 * M-Pesa Daraja API — STK Push (Lipa na M-Pesa Online).
 *
 * Configure:
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET  — Daraja app credentials
 *   MPESA_SHORTCODE                              — e.g. 174379 (sandbox)
 *   MPESA_PASSKEY                                — Lipa na M-Pesa passkey
 *   MPESA_ENV                                    — "sandbox" | "production"
 *
 * Without these env vars the checkout gracefully falls back to
 * "pay on delivery" so the flow is never blocked.
 */

export function isMpesaEnabled(): boolean {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY
  );
}

function baseUrl(): string {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

async function accessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");
    const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

export interface StkResult {
  initiated: boolean;
  checkoutRequestId?: string;
  customerMessage?: string;
}

/** Trigger an STK push to the customer's phone. */
export async function stkPush(
  phone: string,
  amount: number,
  accountReference: string,
  description: string,
  callbackUrl: string
): Promise<StkResult> {
  if (!isMpesaEnabled()) return { initiated: false };
  const token = await accessToken();
  if (!token) return { initiated: false };

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
  const number = phone.replace(/[^0-9]/g, "").replace(/^0/, "254");

  try {
    const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: number,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: number,
        CallBackURL: callbackUrl,
        AccountReference: accountReference.slice(0, 12),
        TransactionDesc: description.slice(0, 30),
      }),
      cache: "no-store",
    });
    const json = (await res.json()) as {
      CheckoutRequestID?: string;
      CustomerMessage?: string;
      ResponseDescription?: string;
    };
    if (res.ok && json.CheckoutRequestID) {
      return {
        initiated: true,
        checkoutRequestId: json.CheckoutRequestID,
        customerMessage: json.CustomerMessage,
      };
    }
    return { initiated: false };
  } catch {
    return { initiated: false };
  }
}
