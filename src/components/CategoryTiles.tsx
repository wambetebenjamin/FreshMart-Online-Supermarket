import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { categories, categoryCounts } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";

/**
 * Shop by category — tile grid on desktop (9 tiles), horizontal
 * scroll on mobile. Hover: 1.05 zoom + deepening gradient overlay.
 */
export default function CategoryTiles() {
  const counts = categoryCounts();
  return (
    <>
      <div className="fm-cat-grid">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 50} className="fm-cat-tile-wrap">
            <Link href={`/category/${cat.slug}`} className="fm-cat-tile" aria-label={`Shop ${cat.name}`}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 240px"
                className="fm-cat-tile-img"
                placeholder="blur"
                blurDataURL={blurFor(cat.image)}
                loading="lazy"
              />
              <span className="fm-cat-tile-overlay" />
              <div className="fm-cat-tile-name">
                <span className="fm-cat-tile-title">{cat.name}</span>
                <span className="fm-cat-tile-count">
                  {counts[cat.slug] ?? 0} products <ArrowRight size={12} className="fm-cat-arrow" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Mobile horizontal scroll */}
      <div className="fm-cat-scroll">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className="fm-cat-tile">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="140px"
              className="fm-cat-tile-img"
              placeholder="blur"
              blurDataURL={blurFor(cat.image)}
              loading="lazy"
            />
            <span className="fm-cat-tile-overlay" />
            <div className="fm-cat-tile-name">
              <span className="fm-cat-tile-title">{cat.name}</span>
              <span className="fm-cat-tile-count">{counts[cat.slug] ?? 0} items</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
