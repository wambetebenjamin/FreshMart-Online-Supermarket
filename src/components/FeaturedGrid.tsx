"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { getFeatured, products, categories } from "@/lib/data";

/** Featured products with interactive category filter tabs & staggered entrance. */
export default function FeaturedGrid() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const allFeatured = getFeatured();

  const filtered =
    selectedCat === "all"
      ? allFeatured
      : products.filter((p) => p.category === selectedCat);

  return (
    <div className="fm-featured-wrapper">
      {/* Category filter pills */}
      <div className="fm-filter-scroll" role="tablist" aria-label="Filter products by aisle">
        <button
          type="button"
          role="tab"
          aria-selected={selectedCat === "all"}
          className={`fm-filter-pill ${selectedCat === "all" ? "is-active" : ""}`}
          onClick={() => setSelectedCat("all")}
        >
          All Featured <span className="fm-pill-count">{allFeatured.length}</span>
        </button>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={selectedCat === c.slug}
              className={`fm-filter-pill ${selectedCat === c.slug ? "is-active" : ""}`}
              onClick={() => setSelectedCat(c.slug)}
            >
              {c.name} <span className="fm-pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="fm-product-grid fm-featured-grid" key={selectedCat}>
        {filtered.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 8) * 50}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
