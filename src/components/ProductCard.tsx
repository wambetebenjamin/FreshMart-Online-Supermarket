"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Eye, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatKES, percentOff } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";
import Stars from "./Stars";
import QuickViewModal from "./QuickViewModal";

/**
 * Product card with:
 *  - subtle 3D perspective tilt (vanilla-tilt, max 6°, glare off)
 *  - image zoom to 1.05 + smooth shadow lift on hover
 *  - animated wishlist heart pop & particle effect
 *  - Quick View trigger with rich modal
 *  - add-to-cart button with checkmark micro-interaction
 */
export default function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPopping, setHeartPopping] = useState(false);

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
        max: 6,
        speed: 500,
        glare: false,
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

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      image: product.image,
      price,
    });
    setJustAdded(true);
    toast({
      message: `${product.name} added to your basket`,
      image: product.image,
    });
    setTimeout(() => setJustAdded(false), 1600);
  };

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
    setHeartPopping(true);
    setTimeout(() => setHeartPopping(false), 500);
    toast({
      message: wishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to wishlist`,
      image: product.image,
    });
  };

  return (
    <>
      <div className="product-card" ref={cardRef}>
        <div className="pc-img-wrap">
          <Link href={`/products/${product.slug}`} className="pc-img-link" aria-label={product.name}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 420px) 92vw, (max-width: 768px) 46vw, (max-width: 1200px) 30vw, 292px"
              className="pc-img"
              placeholder="blur"
              blurDataURL={blurFor(product.image)}
              loading="lazy"
            />
            {off > 0 && <span className="fm-chip fm-chip--sale pc-chip">-{off}%</span>}
            {product.isNew && off === 0 && <span className="fm-chip fm-chip--new pc-chip">New</span>}
          </Link>

          {/* Quick actions overlay */}
          <div className="pc-floating-actions">
            <button
              type="button"
              className={`pc-icon-action pc-heart ${wishlisted ? "is-active" : ""} ${
                heartPopping ? "is-popping" : ""
              }`}
              aria-label={
                wishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={wishlisted}
              onClick={onWishlist}
            >
              <Heart fill={wishlisted ? "currentColor" : "none"} size={17} />
            </button>

            <button
              type="button"
              className="pc-icon-action pc-quickview"
              aria-label={`Quick view ${product.name}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
            >
              <Eye size={17} />
              <span className="pc-action-tip">Quick View</span>
            </button>
          </div>
        </div>

        <div className="pc-body">
          <Link href={`/products/${product.slug}`} className="pc-name">
            {product.name}
          </Link>
          <div className="pc-unit">
            <span>{product.unit}</span>
            <span className="pc-dot-sep">·</span>
            <Stars rating={product.rating} size={11} />
          </div>
          <span className={`pc-stock ${product.stock === "in" ? "pc-stock--in" : "pc-stock--low"}`}>
            <span className="dot" />
            {product.stock === "in" ? "In Stock" : "Low Stock"}
          </span>
          <div className="pc-pricing">
            <span className="pc-price">{formatKES(price)}</span>
            {off > 0 && <span className="pc-was">{formatKES(product.price)}</span>}
          </div>
          <button
            type="button"
            className={`btn btn-brand btn-sm btn-block pc-add-btn ${justAdded ? "is-added" : ""}`}
            onClick={onAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={15} /> Added ✓
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
