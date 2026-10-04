"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatKES, percentOff } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";
import Stars from "./Stars";

/**
 * Product card with:
 *  - subtle 3D perspective tilt (vanilla-tilt, max 6°, glare off,
 *    pointer-fine devices only)
 *  - image zoom to 1.04 + shadow lift on hover
 *  - wishlist heart toggle (top-right)
 *  - add-to-cart that springs the navbar badge
 */
export default function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const add = useCartStore((s) => s.add);
  const wishlisted = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  // 3D tilt — skipped on touch devices and under reduced motion
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    let tilt: any;
    let cancelled = false;
    import("vanilla-tilt").then(({ default: VanillaTilt }) => {
      if (cancelled || !el.isConnected) return;
      VanillaTilt.init(el, {
        max: 6, // brief: max-tilt 6 degrees
        speed: 500,
        glare: false, // brief: glare disabled
        "max-glare": 0,
        scale: 1.01,
      });
      tilt = el;
    });
    return () => {
      cancelled = true;
      if (tilt) (tilt as any).vanillaTilt?.destroy();
    };
  }, []);

  const price = product.dealPrice ?? product.price;
  const off = percentOff(product.price, product.dealPrice);

  const onAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      image: product.image,
      price,
    });
    toast(`${product.name} added to your basket`);
  };

  const onWishlist = () => {
    toggleWishlist(product.slug);
    toast(wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
  };

  return (
    <div className="product-card" ref={cardRef}>
      <Link href={`/products/${product.slug}`} className="pc-img-link" aria-label={product.name}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 420px) 92vw, (max-width: 768px) 46vw, (max-width: 1200px) 30vw, 292px"
          className="pc-img"
          placeholder="blur"
          blurDataURL={blurFor(product.image)}
        />
        {off > 0 && <span className="fm-chip fm-chip--sale pc-chip">-{off}%</span>}
        {product.isNew && off === 0 && <span className="fm-chip fm-chip--new pc-chip">New</span>}
      </Link>

      <button
        type="button"
        className={`pc-heart ${wishlisted ? "is-active" : ""}`}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        onClick={onWishlist}
      >
        <Heart fill={wishlisted ? "currentColor" : "none"} />
      </button>

      <div className="pc-body">
        <Link href={`/products/${product.slug}`} className="pc-name">
          {product.name}
        </Link>
        <span className="pc-unit">
          {product.unit} · <Stars rating={product.rating} size={11} />
        </span>
        <span className={`pc-stock ${product.stock === "in" ? "pc-stock--in" : "pc-stock--low"}`}>
          <span className="dot" />
          {product.stock === "in" ? "In Stock" : "Low Stock"}
        </span>
        <div className="pc-pricing">
          <span className="pc-price">{formatKES(price)}</span>
          {off > 0 && <span className="pc-was">{formatKES(product.price)}</span>}
        </div>
        <button type="button" className="btn btn-brand btn-sm btn-block" onClick={onAdd}>
          <ShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
