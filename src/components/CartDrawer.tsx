"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, ShoppingCart, Tag, Trash2, Truck, X } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { formatKES, SITE } from "@/lib/utils";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";

const FREE_SHIPPING_THRESHOLD = 2500;

/** Slide-out cart drawer with free delivery meter, promo code support, and smooth steppers. */
export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const rawSubtotal = cartSubtotal(items);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotal = Math.max(0, rawSubtotal - discountAmount);

  const qualifiesForFreeDelivery = rawSubtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = items.length === 0 ? 0 : qualifiesForFreeDelivery ? 0 : SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  const progressPct = Math.min(100, Math.round((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - rawSubtotal);

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

  return (
    <>
      <div
        className={`fm-drawer-overlay ${drawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`fm-cart-drawer ${drawerOpen ? "is-open" : ""}`}
        aria-label="Shopping basket"
        aria-hidden={!drawerOpen}
      >
        <div className="fm-drawer-head">
          <h2>
            <ShoppingBag size={18} /> Your Basket
            {mounted && items.length > 0 && (
              <span className="fm-drawer-badge">{items.reduce((s, i) => s + i.qty, 0)}</span>
            )}
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress bar */}
        {mounted && items.length > 0 && (
          <div className="fm-free-shipping-bar">
            <div className="fm-free-shipping-text">
              <Truck size={15} className="fm-truck-icon" />
              {qualifiesForFreeDelivery ? (
                <span>
                  <strong>🎉 FREE Delivery Unlocked!</strong> (Orders over {formatKES(FREE_SHIPPING_THRESHOLD)})
                </span>
              ) : (
                <span>
                  Add <strong>{formatKES(amountNeeded)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
            </div>
            <div className="fm-progress-track">
              <div
                className={`fm-progress-fill ${qualifiesForFreeDelivery ? "is-complete" : ""}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {mounted && items.length === 0 && (
          <div className="fm-empty-cart">
            <div className="fm-empty-icon-box">
              <ShoppingCart size={40} />
            </div>
            <h3>Your basket is empty</h3>
            <p>
              Fresh deals from Nairobi farms & markets drop every morning — order before 10am for same-day delivery.
            </p>
            <Link
              href="/#deals"
              className="btn btn-brand btn-sm"
              onClick={closeDrawer}
              style={{ marginTop: 14 }}
            >
              See Today’s Deals <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <div className="fm-drawer-items">
          {mounted &&
            items.map((item) => (
              <div className="fm-cart-item" key={item.slug}>
                <div className="fm-cart-item-img">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="fm-img-cover"
                    placeholder="blur"
                    blurDataURL={blurFor(item.image)}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/products/${item.slug}`} className="ci-name" onClick={closeDrawer}>
                    {item.name}
                  </Link>
                  <div className="ci-unit">{item.unit} · {formatKES(item.price)} each</div>
                  <div className="ci-row">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQty(item.slug, item.qty - 1)}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQty(item.slug, item.qty + 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="ci-price">{formatKES(item.price * item.qty)}</span>
                      <button
                        type="button"
                        className="ci-remove"
                        aria-label={`Remove ${item.name} from basket`}
                        onClick={() => {
                          remove(item.slug);
                          toast(`${item.name} removed from basket`);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {mounted && items.length > 0 && (
          <div className="fm-drawer-foot">
            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="fm-promo-box">
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

            <div className="fm-total-row">
              <span>Subtotal</span>
              <strong>{formatKES(rawSubtotal)}</strong>
            </div>

            {discountAmount > 0 && (
              <div className="fm-total-row fm-discount-row">
                <span>Promo Discount ({discountPercent}%)</span>
                <strong>-{formatKES(discountAmount)}</strong>
              </div>
            )}

            <div className="fm-total-row">
              <span>Delivery (within Nairobi)</span>
              <strong>{qualifiesForFreeDelivery ? <span className="fm-free-tag">FREE</span> : formatKES(deliveryFee)}</strong>
            </div>

            <div className="fm-total-row grand">
              <span>Estimated Total</span>
              <strong>{formatKES(total)}</strong>
            </div>

            <Link href="/checkout" className="btn btn-brand btn-block fm-checkout-btn" onClick={closeDrawer}>
              Proceed to Checkout <ArrowRight size={15} />
            </Link>

            <p className="fm-drawer-note">
              <Truck size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
              Order by 10am for same-day delivery. Pay with M-Pesa or Cash on Delivery.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
