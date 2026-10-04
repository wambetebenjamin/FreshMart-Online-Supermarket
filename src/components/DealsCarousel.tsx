"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Marquee from "./Marquee";
import { getDeals } from "@/lib/data";
import { formatKES, percentOff } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { blurFor } from "@/lib/blur-map";
import { toast } from "./Toast";

function DealCard({ product }: { product: ReturnType<typeof getDeals>[number] }) {
  const add = useCartStore((s) => s.add);
  const price = product.dealPrice ?? product.price;
  const off = percentOff(product.price, product.dealPrice);

  return (
    <article className="deal-card">
      <Link href={`/products/${product.slug}`} className="deal-img" aria-label={product.name}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="264px"
          placeholder="blur"
          blurDataURL={blurFor(product.image)}
        />
        <span className="fm-chip fm-chip--sale deal-off">-{off}% off</span>
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
          className="btn btn-brand btn-sm btn-block"
          onClick={() => {
            add({
              slug: product.slug,
              name: product.name,
              unit: product.unit,
              image: product.image,
              price,
            });
            toast(`${product.name} added — deal price applied`);
          }}
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </article>
  );
}

/** Auto-scrolling deals strip — pauses on hover and touch. */
export default function DealsCarousel() {
  const deals = getDeals();
  return (
    <Marquee duration={42} aria-label="Today's deals">
      {deals.map((p) => (
        <DealCard key={p.slug} product={p} />
      ))}
    </Marquee>
  );
}
