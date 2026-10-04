import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { getFeatured } from "@/lib/data";

/** Featured products — 4 col → 3 → 2 → 1, 60ms stagger fade-up on scroll. */
export default function FeaturedGrid() {
  const featured = getFeatured();
  return (
    <div className="fm-product-grid">
      {featured.map((p, i) => (
        <Reveal key={p.slug} delay={i * 60}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}
