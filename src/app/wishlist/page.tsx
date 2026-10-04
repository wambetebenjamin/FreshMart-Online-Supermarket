"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/lib/store/wishlist";
import { products } from "@/lib/data";

export default function WishlistPage() {
  const slugs = useWishlistStore((s) => s.slugs);
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <section className="section">
      <div className="fm-container">
        <div className="section-head">
          <span className="section-eyebrow">
            <Heart size={14} /> Wishlist
          </span>
          <h1 className="section-title" style={{ fontSize: 26 }}>
            Saved for later.
          </h1>
          <p className="section-sub">
            {items.length === 0
              ? "Tap the heart on any product to keep it here."
              : `${items.length} product${items.length === 1 ? "" : "s"} saved. Add them to your basket whenever you’re ready.`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="fm-empty-state">
            <Heart />
            <p>Your wishlist is empty.</p>
            <Link href="/" className="btn btn-brand" style={{ marginTop: 16 }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="fm-product-grid">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
