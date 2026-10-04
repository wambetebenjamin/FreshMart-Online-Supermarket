import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
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
          <h1 className="section-title" style={{ fontSize: 26 }}>
            {q ? `Results for “${q}”` : "All products"}
          </h1>
          <p className="section-sub">
            {results.length} product{results.length === 1 ? "" : "s"} found
            {q ? "" : " — use the search bar to narrow it down"}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="fm-empty-state">
            <p>
              Nothing matched “{q}”. Try “avocado”, “milk”, “tea”, “samosa” or browse the categories
              in the menu.
            </p>
          </div>
        ) : (
          <div className="fm-product-grid">
            {results.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 8) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
