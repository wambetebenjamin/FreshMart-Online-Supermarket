"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { formatKES } from "@/lib/utils";
import { toast } from "./Toast";

/** Quantity + variant selection + Add to Cart / Add to Wishlist on the product page. */
export default function ProductActions({ product }: { product: Product }) {
  const variants = product.variants ?? [{ label: product.unit, price: product.price }];
  // Default to the product's standard unit so deal pricing matches the cards
  const defaultIdx = product.variants
    ? Math.max(
        0,
        product.variants.findIndex((v) => v.label === product.unit)
      )
    : -1;
  const [variantIdx, setVariantIdx] = useState(defaultIdx);
  const activeVariant = variantIdx >= 0 ? variants[variantIdx] : null;
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const wishlisted = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  // dealPrice only applies to the default variant
  const effectivePrice = activeVariant ? activeVariant.price : product.dealPrice ?? product.price;
  const unitLabel = activeVariant ? activeVariant.label : product.unit;

  const onAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      unit: unitLabel,
      image: product.image,
      price: effectivePrice,
    }, qty);
    toast(`${qty} × ${product.name} added to your basket`);
  };

  return (
    <>
      {variants.length > 1 && (
        <div className="fm-field" style={{ maxWidth: 340 }}>
          <label>Size</label>
          <div className="pd-variant-row">
            {variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                className={`pd-variant ${i === variantIdx ? "is-active" : ""}`}
                onClick={() => setVariantIdx(i)}
              >
                {v.label} — {formatKES(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pd-qty-row">
        <div className="qty-stepper">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus />
          </button>
          <span className="qty-val">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}>
            <Plus />
          </button>
        </div>
        <span className="pd-meta">
          Total: <strong style={{ color: "var(--fm-ink)", fontFamily: "var(--fm-font-head)" }}>{formatKES(effectivePrice * qty)}</strong>
        </span>
      </div>

      <div className="pd-actions">
        <button type="button" className="btn btn-brand" onClick={onAdd} style={{ flex: 1, minWidth: 190 }}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button
          type="button"
          className={`btn ${wishlisted ? "btn-dark" : "btn-outline"}`}
          onClick={() => {
            toggleWishlist(product.slug);
            toast(wishlisted ? "Removed from wishlist" : "Saved to your wishlist");
          }}
          aria-pressed={wishlisted}
        >
          <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
          {wishlisted ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </>
  );
}
