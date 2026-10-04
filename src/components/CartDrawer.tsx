"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, Truck, X } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { formatKES, SITE } from "@/lib/utils";

/** Slide-out cart drawer — 300ms ease-out from the right, full width on mobile. */
export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove } = useCartStore();
  const [mounted, setMounted] = useState(false);
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

  const subtotal = cartSubtotal(items);
  const total = subtotal + (items.length ? SITE.deliveryFee : 0);

  return (
    <>
      <div
        className={`fm-drawer-overlay ${drawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside className={`fm-cart-drawer ${drawerOpen ? "is-open" : ""}`} aria-label="Shopping cart" aria-hidden={!drawerOpen}>
        <div className="fm-drawer-head">
          <h2>
            <ShoppingCart size={18} /> Your Basket
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {mounted && items.length === 0 && (
          <div className="fm-empty-cart">
            <ShoppingCart />
            <p>Your basket is empty.</p>
            <p style={{ fontSize: 13 }}>
              Fresh deals every day — order by 10am for same-day delivery in Nairobi.
            </p>
            <Link href="/#deals" className="btn btn-brand btn-sm" onClick={closeDrawer} style={{ marginTop: 12 }}>
              See Today’s Deals
            </Link>
          </div>
        )}

        <div className="fm-drawer-items">
          {mounted &&
            items.map((item) => (
              <div className="fm-cart-item" key={item.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/products/${item.slug}`} className="ci-name" onClick={closeDrawer}>
                    {item.name}
                  </Link>
                  <div className="ci-unit">{item.unit}</div>
                  <div className="ci-row">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQty(item.slug, item.qty - 1)}
                      >
                        <Minus />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQty(item.slug, item.qty + 1)}
                      >
                        <Plus />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="ci-price">{formatKES(item.price * item.qty)}</span>
                      <button
                        type="button"
                        className="ci-remove"
                        aria-label={`Remove ${item.name} from basket`}
                        onClick={() => remove(item.slug)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {mounted && items.length > 0 && (
          <div className="fm-drawer-foot">
            <div className="fm-total-row">
              <span>Subtotal</span>
              <strong>{formatKES(subtotal)}</strong>
            </div>
            <div className="fm-total-row">
              <span>Delivery (within Nairobi)</span>
              <strong>{formatKES(SITE.deliveryFee)}</strong>
            </div>
            <div className="fm-total-row grand">
              <span>Total</span>
              <strong>{formatKES(total)}</strong>
            </div>
            <Link href="/checkout" className="btn btn-brand btn-block" onClick={closeDrawer}>
              Checkout
            </Link>
            <p className="fm-drawer-note">
              <Truck size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
              Order by 10am for same-day delivery.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
