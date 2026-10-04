"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Heart, MapPin, Minus, Plus, ShoppingCart, Truck, X } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatKES, percentOff, SITE } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";
import Stars from "./Stars";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = useCartStore((s) => s.add);
  const wishlisted = useWishlistStore((s) => (product ? s.slugs.includes(product.slug) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const price = product.dealPrice ?? product.price;
  const off = percentOff(product.price, product.dealPrice);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        unit: product.unit,
        image: product.image,
        price,
      },
      qty
    );
    setAdded(true);
    toast({
      message: `${qty} × ${product.name} added to your basket`,
      image: product.image,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist(product.slug);
    toast({
      message: wishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to wishlist`,
      image: product.image,
    });
  };

  return (
    <div
      className="fm-modal-overlay is-open fm-qv-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="fm-modal fm-qv-modal">
        <button
          type="button"
          className="fm-qv-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="fm-qv-grid">
          {/* Gallery side */}
          <div className="fm-qv-gallery">
            <div className="fm-qv-main-img">
              <Image
                src={gallery[activeImg] || product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="fm-img-cover"
                placeholder="blur"
                blurDataURL={blurFor(gallery[activeImg] || product.image)}
              />
              {off > 0 && <span className="fm-chip fm-chip--sale fm-qv-badge">-{off}% Off</span>}
              {product.isNew && off === 0 && <span className="fm-chip fm-chip--new fm-qv-badge">New</span>}
            </div>

            {gallery.length > 1 && (
              <div className="fm-qv-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    className={`fm-qv-thumb ${i === activeImg ? "is-active" : ""}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={56}
                      height={56}
                      placeholder="blur"
                      blurDataURL={blurFor(img)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="fm-qv-info">
            <div className="fm-qv-head">
              <span className="fm-qv-cat">{product.category.replace(/-/g, " ").toUpperCase()}</span>
              <h2 className="fm-qv-title">{product.name}</h2>
              <div className="fm-qv-meta">
                <Stars rating={product.rating} size={13} />
                <span>
                  {product.rating.toFixed(1)} ({product.ratingCount} reviews) · {product.unit}
                </span>
              </div>
            </div>

            <div className="fm-qv-pricing">
              <span className="fm-qv-price">{formatKES(price)}</span>
              {off > 0 && <span className="fm-qv-was">{formatKES(product.price)}</span>}
              {off > 0 && <span className="fm-qv-save">Save {formatKES(product.price - price)}</span>}
            </div>

            <p className={`pc-stock ${product.stock === "in" ? "pc-stock--in" : "pc-stock--low"}`}>
              <span className="dot" />
              {product.stock === "in" ? "In Stock — same-day delivery" : "Low Stock — order soon"}
            </p>

            <p className="fm-qv-desc">{product.description}</p>

            <div className="fm-qv-origin">
              <MapPin size={14} /> Sourced from {product.origin}
            </div>

            <div className="fm-qv-stepper-row">
              <div className="qty-stepper">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>

              <span className="fm-qv-subtotal">
                Subtotal: <strong>{formatKES(price * qty)}</strong>
              </span>
            </div>

            <div className="fm-qv-actions">
              <button
                type="button"
                className={`btn btn-brand btn-block ${added ? "is-added" : ""}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Basket — {formatKES(price * qty)}
                  </>
                )}
              </button>

              <button
                type="button"
                className={`btn ${wishlisted ? "btn-dark" : "btn-outline"} btn-sm`}
                onClick={handleWishlist}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? "In Wishlist" : "Add to Wishlist"}
              >
                <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
                {wishlisted ? "In Wishlist" : "Wishlist"}
              </button>
            </div>

            <div className="fm-qv-footer">
              <div className="fm-qv-truck">
                <Truck size={14} />
                <span>Nairobi Delivery {formatKES(SITE.deliveryFee)} · Order by 10am for today</span>
              </div>
              <Link
                href={`/products/${product.slug}`}
                className="fm-qv-viewfull"
                onClick={onClose}
              >
                Full Product Details & Reviews <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
