"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ShoppingCart } from "lucide-react";
import Marquee from "./Marquee";
import { getDeals } from "@/lib/data";
import { formatKES, percentOff } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";

function DealCard({ product }: { product: ReturnType<typeof getDeals>[number] }) {
  const [justAdded, setJustAdded] = useState(false);
  const add = useCartStore((s) => s.add);
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
      message: `${product.name} added at deal price!`,
      image: product.image,
    });
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="deal-card">
      <Link href={`/products/${product.slug}`} className="deal-img" aria-label={product.name}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="264px"
          className="fm-deal-img-element"
          placeholder="blur"
          blurDataURL={blurFor(product.image)}
          loading="lazy"
        />
        <span className="fm-chip fm-chip--sale deal-off">-{off}% OFF</span>
      </Link>
      <div className="deal-body">
        <h3 className="deal-name">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <span className="deal-unit">{product.unit}</span>
        <div className="deal-prices">
          <span className="deal-price">{formatKES(price)}</span>
          <span className="deal-was">{formatKES(product.price)}</span>
        </div>
        <button
          type="button"
          className={`btn btn-brand btn-sm btn-block pc-add-btn ${justAdded ? "is-added" : ""}`}
          onClick={onAdd}
        >
          {justAdded ? (
            <>
              <Check size={14} /> Added ✓
            </>
          ) : (
            <>
              <ShoppingCart size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

/** Auto-scrolling deals strip with pause on hover/touch & instant add-to-cart. */
export default function DealsCarousel() {
  const deals = getDeals();
  return (
    <Marquee duration={40} aria-label="Today's deals">
      {deals.map((p) => (
        <DealCard key={p.slug} product={p} />
      ))}
    </Marquee>
  );
}
