import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { categories, getCategory, productsByCategory } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";
import { SITE } from "@/lib/utils";

export const revalidate = 180; // ISR

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = getCategory(params.slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} — Online in Nairobi`,
    description: `Shop ${category.name.toLowerCase()} online with FreshMart. ${category.tagline}. Order by 10am for same-day delivery in Nairobi.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | FreshMart`,
      description: category.tagline,
      url: `${SITE.url}/category/${category.slug}`,
      images: [{ url: category.image, width: 500, height: 500, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const items = productsByCategory(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} — FreshMart`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/products/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="fm-page-banner">
        <Image
          src={category.image}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurFor(category.image)}
        />
        <div className="fm-container">
          <h1>{category.name}</h1>
          <p>
            {category.tagline} · {items.length} product{items.length === 1 ? "" : "s"} · order by 10am for
            same-day delivery
          </p>
        </div>
      </section>

      <section className="section">
        <div className="fm-container">
          {items.length === 0 ? (
            <p>We’re stocking this aisle — check back soon.</p>
          ) : (
            <div className="fm-product-grid">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i, 8) * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
