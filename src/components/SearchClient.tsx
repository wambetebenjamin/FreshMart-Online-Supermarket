"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { Product } from "@/lib/data";
import { categories } from "@/lib/data";

interface SearchClientProps {
  initialQuery: string;
  allProducts: Product[];
}

export default function SearchClient({ initialQuery, allProducts }: SearchClientProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "name">("featured");

  const filteredAndSorted = useMemo(() => {
    let list = allProducts;
    if (selectedCat !== "all") {
      list = list.filter((p) => p.category === selectedCat);
    }

    return [...list].sort((a, b) => {
      const priceA = a.dealPrice ?? a.price;
      const priceB = b.dealPrice ?? b.price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // featured/default
    });
  }, [allProducts, selectedCat, sortBy]);

  return (
    <div className="fm-search-page-wrapper">
      {/* Category filter pills */}
      <div className="fm-filter-scroll" role="tablist" aria-label="Filter search results">
        <button
          type="button"
          role="tab"
          aria-selected={selectedCat === "all"}
          className={`fm-filter-pill ${selectedCat === "all" ? "is-active" : ""}`}
          onClick={() => setSelectedCat("all")}
        >
          All Categories <span className="fm-pill-count">{allProducts.length}</span>
        </button>
        {categories.map((c) => {
          const count = allProducts.filter((p) => p.category === c.slug).length;
          if (count === 0 && initialQuery) return null;
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

      {/* Control bar: count + sorting */}
      <div className="fm-search-controls">
        <span className="fm-search-count-label">
          Showing <strong>{filteredAndSorted.length}</strong> product{filteredAndSorted.length === 1 ? "" : "s"}
          {selectedCat !== "all" ? ` in ${categories.find(c => c.slug === selectedCat)?.name}` : ""}
        </span>

        <div className="fm-sort-wrap">
          <ArrowUpDown size={14} className="fm-sort-icon" />
          <label htmlFor="search-sort" className="fm-sort-label">Sort by:</label>
          <select
            id="search-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="fm-sort-select"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
            <option value="name">Alphabetical (A–Z)</option>
          </select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="fm-empty-state">
          <Search size={44} />
          <h3>No matching items found</h3>
          <p>
            We couldn’t find any products matching your filter. Try picking a different category or clearing your search term.
          </p>
          <Link href="/" className="btn btn-brand" style={{ marginTop: 14 }}>
            Explore All Aisles
          </Link>
        </div>
      ) : (
        <div className="fm-product-grid" key={selectedCat + sortBy}>
          {filteredAndSorted.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 8) * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
