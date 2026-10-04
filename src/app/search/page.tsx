import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchClient from "@/components/SearchClient";
import { products, searchProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search FreshMart",
  description: "Search fresh groceries, meat, dairy, bakery and household essentials on FreshMart.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? searchProducts(q, 40) : products;

  return (
    <section className="section">
      <div className="fm-container">
        <div className="section-head">
          <span className="section-eyebrow">
            <Search size={14} /> Catalog Search
          </span>
          <h1 className="section-title" style={{ fontSize: 26 }}>
            {q ? `Results for “${q}”` : "All FreshMart Products"}
          </h1>
          <p className="section-sub">
            {results.length} item{results.length === 1 ? "" : "s"} available for same-day delivery in Nairobi.
          </p>
        </div>

        <SearchClient initialQuery={q} allProducts={results} />
      </div>
    </section>
  );
}
