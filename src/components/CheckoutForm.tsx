"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { DELIVERY_SLOTS, formatKES, SITE } from "@/lib/utils";
import { WhatsAppIcon } from "./BrandIcons";
import { WHATSAPP_HELP_URL } from "@/lib/utils";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";

const FREE_SHIPPING_THRESHOLD = 2500;

const SUGGESTED_ADDONS = [
  { slug: "hass-avocados", name: "Hass Avocados (Pair)", price: 120, unit: "2 pcs", image: "/images/p-hass-avocados.jpg" },
  { slug: "fresh-milk", name: "Fresh Pasteurized Milk", price: 110, unit: "1 litre", image: "/images/p-fresh-milk.jpg" },
  { slug: "mandazi", name: "Freshly Fried Mandazi", price: 120, unit: "4 pcs", image: "/images/p-mandazi.jpg" },
];

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    mpesaNumber: "",
    slot: DELIVERY_SLOTS[2] as string,
    notes: "",
    paymentMethod: "mpesa" as "pay-on-delivery" | "mpesa",
  });

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const rawSubtotal = cartSubtotal(items);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotal = Math.max(0, rawSubtotal - discountAmount);

  const qualifiesForFreeDelivery = rawSubtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = items.length === 0 ? 0 : qualifiesForFreeDelivery ? 0 : SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "KARIBU10" || code === "FRESH10" || code === "ASANTE") {
      setDiscountPercent(10);
      setPromoApplied(true);
      toast("Promo code applied: 10% OFF!");
    } else if (code === "FRESH50") {
      setDiscountPercent(5);
      setPromoApplied(true);
      toast("Promo code applied: 5% OFF!");
    } else {
      setPromoError("Invalid code. Try 'KARIBU10' for 10% off.");
    }
  };

  const handleAddOn = (item: typeof SUGGESTED_ADDONS[0]) => {
    add({
      slug: item.slug,
      name: item.name,
      unit: item.unit,
      image: item.image,
      price: item.price,
    });
    toast({
      message: `${item.name} added to your order`,
      image: item.image,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    // Auto-fill M-Pesa number if empty
    const mpesaNum = form.mpesaNumber.trim() || form.phone.trim();

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            mpesaNumber: mpesaNum,
            slot: form.slot,
            notes: form.notes,
          },
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          paymentMethod: form.paymentMethod,
          discount: discountAmount,
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
          mpesaInitiated: json.payment?.mpesaInitiated ?? (form.paymentMethod === "mpesa"),
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
        <ShoppingCart size={48} />
        <h2>Your basket is empty</h2>
        <p>Add some fresh vegetables, meat cuts or bakery treats to proceed.</p>
        <Link href="/" className="btn btn-brand" style={{ marginTop: 18 }}>
          Shop FreshMart Now
        </Link>
      </div>
    );
  }

  return (
    <div className="fm-checkout-layout">
      {/* Checkout Form */}
      <div className="fm-checkout-main">
        {/* Step indicator */}
        <div className="fm-checkout-stepper">
          <div className="fm-co-step is-active">
            <span className="fm-co-step-num">1</span>
            <span>Delivery Info</span>
          </div>
          <div className="fm-co-step-line" />
          <div className="fm-co-step is-active">
            <span className="fm-co-step-num">2</span>
            <span>Time Slot</span>
          </div>
          <div className="fm-co-step-line" />
          <div className="fm-co-step is-active">
            <span className="fm-co-step-num">3</span>
            <span>Payment</span>
          </div>
        </div>

        <form onSubmit={submit} className="fm-checkout-form" noValidate={false}>
          {/* Section 1: Contact & Delivery */}
          <div className="fm-co-section">
            <h2 className="fm-co-title">
              <User size={18} /> 1. Contact & Delivery Location
            </h2>

            <div className="fm-form-grid">
              <div className="fm-field">
                <label htmlFor="co-name">Full Name *</label>
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
                <label htmlFor="co-phone">Phone Number (M-Pesa / Call) *</label>
                <input
                  id="co-phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+ ]{9,15}"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="07XX XXX XXX or 01XX XXX XXX"
                />
              </div>
            </div>

            <div className="fm-field">
              <label htmlFor="co-address">
                <MapPin size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
                Delivery Address in Nairobi *
              </label>
              <input
                id="co-address"
                required
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Estate, building / apartment name, road, floor or house number"
              />
            </div>
          </div>

          {/* Section 2: Time Slot & Notes */}
          <div className="fm-co-section">
            <h2 className="fm-co-title">
              <Clock size={18} /> 2. Delivery Slot & Instructions
            </h2>

            <div className="fm-field">
              <label htmlFor="co-slot">Select 2-Hour Delivery Window *</label>
              <select
                id="co-slot"
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
              >
                {DELIVERY_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="fm-field">
              <label htmlFor="co-notes">Delivery instructions / Gate notes (optional)</label>
              <textarea
                id="co-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Gate code, call when you arrive at security gate, leave with guard…"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="fm-co-section">
            <h2 className="fm-co-title">
              <Smartphone size={18} /> 3. Payment Method
            </h2>

            <div className="fm-radio-row" role="radiogroup" aria-label="Payment method">
              <button
                type="button"
                role="radio"
                aria-checked={form.paymentMethod === "mpesa"}
                className={`fm-radio ${form.paymentMethod === "mpesa" ? "is-active" : ""}`}
                onClick={() => setForm({ ...form, paymentMethod: "mpesa" })}
              >
                <div className="fm-radio-indicator" />
                <Smartphone size={18} className="fm-radio-icon" />
                <div>
                  <strong>M-Pesa (Instant STK Push)</strong>
                  <span className="fm-radio-sub">Prompt sent to your phone immediately</span>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={form.paymentMethod === "pay-on-delivery"}
                className={`fm-radio ${form.paymentMethod === "pay-on-delivery" ? "is-active" : ""}`}
                onClick={() => setForm({ ...form, paymentMethod: "pay-on-delivery" })}
              >
                <div className="fm-radio-indicator" />
                <Banknote size={18} className="fm-radio-icon" />
                <div>
                  <strong>Pay on Delivery</strong>
                  <span className="fm-radio-sub">Cash or M-Pesa to rider upon arrival</span>
                </div>
              </button>
            </div>

            {form.paymentMethod === "mpesa" && (
              <div className="fm-field" style={{ marginTop: 14 }}>
                <label htmlFor="co-mpesa">M-Pesa Number for Payment *</label>
                <input
                  id="co-mpesa"
                  inputMode="tel"
                  pattern="[0-9+ ]{9,15}"
                  value={form.mpesaNumber}
                  onChange={(e) => setForm({ ...form, mpesaNumber: e.target.value })}
                  placeholder={form.phone ? `Defaults to ${form.phone}` : "07XX XXX XXX"}
                />
                <span className="pd-meta">You’ll enter your M-Pesa PIN on your phone after placing the order.</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Add-ons */}
          <div className="fm-co-addons">
            <h3 className="fm-co-addons-title">Frequently Added by Shoppers</h3>
            <div className="fm-co-addons-grid">
              {SUGGESTED_ADDONS.filter(
                (addon) => !items.some((i) => i.slug === addon.slug)
              ).map((addon) => (
                <div key={addon.slug} className="fm-co-addon-card">
                  <Image
                    src={addon.image}
                    alt={addon.name}
                    width={46}
                    height={46}
                    className="fm-img-cover"
                    placeholder="blur"
                    blurDataURL={blurFor(addon.image)}
                  />
                  <div className="fm-co-addon-info">
                    <span className="fm-co-addon-name">{addon.name}</span>
                    <span className="fm-co-addon-price">{formatKES(addon.price)}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-brand btn-sm fm-co-addon-btn"
                    onClick={() => handleAddOn(addon)}
                    aria-label={`Add ${addon.name} to order`}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {status === "error" && (
            <div className="fm-error-banner" role="alert">
              <p>
                {error} — or{" "}
                <a href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp our team directly
                </a>{" "}
                to complete your order.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-brand btn-block fm-co-submit"
            disabled={status === "sending" || !mounted}
          >
            {status === "sending" ? (
              "Securing your order…"
            ) : (
              <>
                <ShieldCheck size={18} /> Place Order Now — {mounted ? formatKES(total) : ""}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <aside className="fm-card fm-checkout-summary" aria-label="Order summary">
        <h2 className="fm-summary-title">Order Summary ({items.reduce((s, i) => s + i.qty, 0)} items)</h2>

        {/* Promo code box */}
        <form onSubmit={applyPromo} className="fm-promo-box" style={{ marginBottom: 18 }}>
          <div className="fm-promo-input-wrap">
            <Tag size={14} className="fm-promo-icon" />
            <input
              type="text"
              placeholder="Promo code (e.g. KARIBU10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
            />
            <button
              type="submit"
              className="btn btn-dark btn-sm"
              disabled={promoApplied || !promoCode.trim()}
            >
              {promoApplied ? "Applied ✓" : "Apply"}
            </button>
          </div>
          {promoError && <p className="fm-promo-error">{promoError}</p>}
          {promoApplied && (
            <p className="fm-promo-success">
              <Check size={12} /> {discountPercent}% discount applied!
            </p>
          )}
        </form>

        <div className="fm-summary-items">
          {mounted &&
            items.map((i) => (
              <div key={i.slug} className="fm-summary-item">
                <div className="fm-summary-thumb">
                  <Image
                    src={i.image}
                    alt={i.name}
                    width={40}
                    height={40}
                    className="fm-img-cover"
                    placeholder="blur"
                    blurDataURL={blurFor(i.image)}
                  />
                </div>
                <div className="fm-summary-info">
                  <strong className="fm-summary-name">{i.name}</strong>
                  <span className="pd-meta">
                    {i.qty} × {i.unit} · {formatKES(i.price)}
                  </span>
                </div>
                <span className="fm-summary-price">{formatKES(i.price * i.qty)}</span>
              </div>
            ))}
        </div>

        <div className="fm-total-row" style={{ marginTop: 14 }}>
          <span>Subtotal</span>
          <strong>{mounted ? formatKES(rawSubtotal) : "—"}</strong>
        </div>

        {discountAmount > 0 && (
          <div className="fm-total-row fm-discount-row">
            <span>Promo Discount ({discountPercent}%)</span>
            <strong>-{formatKES(discountAmount)}</strong>
          </div>
        )}

        <div className="fm-total-row">
          <span>Delivery (Nairobi)</span>
          <strong>{qualifiesForFreeDelivery ? <span className="fm-free-tag">FREE</span> : formatKES(deliveryFee)}</strong>
        </div>

        <div className="fm-total-row grand">
          <span>Total Amount</span>
          <strong className="fm-grand-val">{mounted ? formatKES(total) : "—"}</strong>
        </div>

        <div className="fm-summary-badges">
          <div className="fm-summary-badge">
            <Truck size={14} />
            <span>Same-Day Nairobi Delivery</span>
          </div>
          <div className="fm-summary-badge">
            <ShieldCheck size={14} />
            <span>100% Quality & Freshness Guarantee</span>
          </div>
        </div>

        <p className="pd-meta" style={{ marginTop: 16, marginBottom: 0, textAlign: "center" }}>
          Need quick help?{" "}
          <a
            href={WHATSAPP_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--fm-brand)", fontWeight: 700 }}
          >
            <WhatsAppIcon size={13} /> Chat on WhatsApp
          </a>
        </p>
      </aside>
    </div>
  );
}
