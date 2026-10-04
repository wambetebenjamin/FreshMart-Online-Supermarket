"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheck, Truck } from "lucide-react";
import { formatKES } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { WHATSAPP_HELP_URL } from "@/lib/utils";

interface LastOrder {
  orderNumber: string;
  total: number;
  slot: string;
  address: string;
  name: string;
  items: { name: string; qty: number; unit: string; price: number }[];
  whatsappConfirmUrl: string;
  mpesaInitiated: boolean;
}

export default function ThankYouPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fm-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <section className="section">
      <div className="fm-container fm-thankyou">
        <div className="fm-thankyou-icon">
          <CircleCheck />
        </div>
        <h1 style={{ fontSize: 30 }}>Asante sana{order ? `, ${order.name.split(" ")[0]}` : ""}!</h1>

        {order ? (
          <>
            <p style={{ fontSize: 17 }}>
              Your order <strong style={{ fontFamily: "var(--fm-font-head)" }}>{order.orderNumber}</strong> is confirmed.
              {order.mpesaInitiated
                ? " Check your phone — we've sent an M-Pesa prompt to complete payment."
                : " You'll pay on delivery."}
            </p>
            <p style={{ color: "var(--fm-muted)", fontSize: 15 }}>
              <Truck size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
              {order.slot} · {order.address} · {formatKES(order.total)}
            </p>

            <div
              className="fm-card"
              style={{ textAlign: "left", margin: "26px auto 8px", maxWidth: 460 }}
            >
              {order.items.map((i) => (
                <div
                  key={i.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 0",
                    borderBottom: "1px solid var(--fm-line)",
                    fontSize: 14,
                  }}
                >
                  <span>
                    {i.name} <span style={{ color: "var(--fm-muted)" }}>× {i.qty}</span>
                  </span>
                  <span style={{ fontFamily: "var(--fm-font-head)", fontWeight: 700 }}>
                    {formatKES(i.price * i.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
              <a className="btn btn-brand" href={order.whatsappConfirmUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={15} /> Get WhatsApp Confirmation
              </a>
              <Link href="/" className="btn btn-outline">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 16 }}>
              Your order has been received. If you placed it just now, check your basket history or
              WhatsApp us with any questions.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
              <a className="btn btn-brand" href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={15} /> WhatsApp Us
              </a>
              <Link href="/" className="btn btn-outline">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
