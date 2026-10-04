"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, Clock, Smartphone, ShoppingCart, Truck } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { DELIVERY_SLOTS, formatKES, SITE } from "@/lib/utils";
import { WhatsAppIcon } from "./BrandIcons";
import { WHATSAPP_HELP_URL } from "@/lib/utils";

interface OrderResponse {
  ok: boolean;
  orderNumber: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  whatsappConfirmUrl: string;
  payment: { method: string; mpesaInitiated?: boolean };
}

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    mpesaNumber: "",
    slot: DELIVERY_SLOTS[2] as string,
    notes: "",
    paymentMethod: "pay-on-delivery" as "pay-on-delivery" | "mpesa",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const subtotal = cartSubtotal(items);
  const total = subtotal + (items.length ? SITE.deliveryFee : 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            mpesaNumber: form.mpesaNumber || form.phone,
            slot: form.slot,
            notes: form.notes,
          },
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          paymentMethod: form.paymentMethod,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Order failed");
      localStorage.setItem(
        "fm-last-order",
        JSON.stringify({
          orderNumber: json.orderNumber,
          total: json.total,
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          slot: form.slot,
          address: form.address,
          name: form.name,
          items: items,
          whatsappConfirmUrl: json.whatsappConfirmUrl,
          mpesaInitiated: json.payment?.mpesaInitiated ?? false,
        })
      );
      clear();
      router.push("/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (mounted && items.length === 0) {
    return (
      <div className="fm-empty-state">
        <ShoppingCart />
        <p>Your basket is empty — add some fresh picks first.</p>
        <Link href="/" className="btn btn-brand" style={{ marginTop: 16 }}>
          Shop FreshMart
        </Link>
      </div>
    );
  }

  return (
    <div className="fm-checkout-layout">
      <form onSubmit={submit} noValidate={false}>
        <h2 style={{ fontSize: 18 }}>Delivery details</h2>

        <div className="fm-form-grid">
          <div className="fm-field">
            <label htmlFor="co-name">Full name *</label>
            <input
              id="co-name"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Amina Hassan"
            />
          </div>
          <div className="fm-field">
            <label htmlFor="co-phone">Phone number *</label>
            <input
              id="co-phone"
              required
              inputMode="tel"
              autoComplete="tel"
              pattern="[0-9+ ]{9,15}"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="07XX XXX XXX"
            />
          </div>
        </div>

        <div className="fm-field">
          <label htmlFor="co-address">
            <Truck size={13} style={{ verticalAlign: -2, marginRight: 4 }} /> Delivery address *
          </label>
          <input
            id="co-address"
            required
            autoComplete="street-address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Estate / building, road, floor, house no."
          />
        </div>

        <div className="fm-field">
          <label htmlFor="co-mpesa">M-Pesa number (for payment) *</label>
          <input
            id="co-mpesa"
            required
            inputMode="tel"
            pattern="[0-9+ ]{9,15}"
            value={form.mpesaNumber}
            onChange={(e) => setForm({ ...form, mpesaNumber: e.target.value })}
            placeholder="07XX XXX XXX (defaults to your phone)"
          />
        </div>

        <div className="fm-field">
          <label htmlFor="co-slot">
            <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} /> Delivery time slot *
          </label>
          <select id="co-slot" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
            {DELIVERY_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="fm-field">
          <label htmlFor="co-notes">Order notes (optional)</label>
          <textarea
            id="co-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Gate code, call when you arrive, ring the bell twice…"
          />
        </div>

        <h2 style={{ fontSize: 18, marginTop: 10 }}>Payment</h2>
        <div className="fm-radio-row" role="radiogroup" aria-label="Payment method">
          <button
            type="button"
            role="radio"
            aria-checked={form.paymentMethod === "pay-on-delivery"}
            className={`fm-radio ${form.paymentMethod === "pay-on-delivery" ? "is-active" : ""}`}
            onClick={() => setForm({ ...form, paymentMethod: "pay-on-delivery" })}
          >
            <Banknote size={16} /> Pay on Delivery (cash)
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={form.paymentMethod === "mpesa"}
            className={`fm-radio ${form.paymentMethod === "mpesa" ? "is-active" : ""}`}
            onClick={() => setForm({ ...form, paymentMethod: "mpesa" })}
          >
            <Smartphone size={16} /> M-Pesa — STK push now
          </button>
        </div>
        <p className="pd-meta" style={{ marginTop: 10 }}>
          {form.paymentMethod === "mpesa"
            ? "We'll send an M-Pesa prompt (STK push) to your number when the order is placed."
            : "Have the exact amount ready if possible — our riders carry limited change."}
        </p>

        {status === "error" && (
          <p className="fm-error" role="alert" style={{ marginTop: 12 }}>
            {error} — or{" "}
            <a href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>{" "}
            to place the order.
          </p>
        )}

        <button
          type="submit"
          className="btn btn-brand btn-block"
          style={{ marginTop: 22 }}
          disabled={status === "sending" || !mounted}
        >
          {status === "sending" ? "Placing your order…" : `Submit Order — ${mounted ? formatKES(total) : ""}`}
        </button>
      </form>

      <aside className="fm-card" aria-label="Order summary">
        <h2 style={{ fontSize: 18 }}>Order summary</h2>
        {mounted &&
          items.map((i) => (
            <div
              key={i.slug}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "9px 0",
                borderBottom: "1px solid var(--fm-line)",
                fontSize: 14,
              }}
            >
              <span style={{ minWidth: 0 }}>
                <strong style={{ fontFamily: "var(--fm-font-head)", color: "var(--fm-ink)", fontSize: 13.5 }}>
                  {i.name}
                </strong>
                <br />
                <span className="pd-meta">
                  {i.qty} × {i.unit} · {formatKES(i.price)}
                </span>
              </span>
              <span style={{ fontFamily: "var(--fm-font-head)", fontWeight: 700, color: "var(--fm-ink)" }}>
                {formatKES(i.price * i.qty)}
              </span>
            </div>
          ))}
        <div className="fm-total-row" style={{ marginTop: 12 }}>
          <span>Subtotal</span>
          <strong>{mounted ? formatKES(subtotal) : "—"}</strong>
        </div>
        <div className="fm-total-row">
          <span>Delivery (within Nairobi)</span>
          <strong>{formatKES(SITE.deliveryFee)}</strong>
        </div>
        <div className="fm-total-row grand">
          <span>Total</span>
          <strong>{mounted ? formatKES(total) : "—"}</strong>
        </div>
        <p className="pd-meta" style={{ marginTop: 14, marginBottom: 0 }}>
          Questions before you order?{" "}
          <a href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <WhatsAppIcon size={12} /> WhatsApp Us
          </a>
        </p>
      </aside>
    </div>
  );
}
