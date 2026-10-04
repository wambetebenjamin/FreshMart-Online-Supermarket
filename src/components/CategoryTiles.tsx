import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import { categories, categoryCounts } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";

/**
 * Shop by category — 2-row tile grid on desktop (9 tiles), horizontal
 * scroll on mobile. Hover: 1.04 zoom + deepening overlay (250ms).
 */
export default function CategoryTiles() {
  const counts = categoryCounts();
  return (
    <>
      <div className="fm-cat-grid">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 60} className="fm-cat-tile-wrap">
            <Link href={`/category/${cat.slug}`} className="fm-cat-tile" aria-label={`Shop ${cat.name}`}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 1024px) 132px, 220px"
                placeholder="blur"
                blurDataURL={blurFor(cat.image)}
              />
              <span className="fm-cat-tile-name">
                {cat.name}
                <span className="fm-cat-tile-count">{counts[cat.slug]} products</span>
              </span>
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
              sizes="132px"
              placeholder="blur"
              blurDataURL={blurFor(cat.image)}
            />
            <span className="fm-cat-tile-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
