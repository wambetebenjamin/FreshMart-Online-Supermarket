import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { categories, getCategory, productsByCategory } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";
import { SITE, formatKES } from "@/lib/utils";

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
    title: `${category.name} — Online Supermarket in Nairobi`,
    description: `Shop fresh ${category.name.toLowerCase()} online with FreshMart. ${category.tagline}. Order by 10am for same-day delivery in Nairobi.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | FreshMart Kenya`,
      description: category.tagline,
      url: `${SITE.url}/category/${category.slug}`,
      images: [{ url: category.image, width: 800, height: 600, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const items = productsByCategory(params.slug);

  const otherCategories = categories.filter((c) => c.slug !== params.slug);

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

      {/* Hero Category Banner with Rich Gradient */}
      <section className="fm-page-banner">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="fm-page-banner-img"
          placeholder="blur"
          blurDataURL={blurFor(category.image)}
        />
        <div className="fm-page-banner-overlay" />
        <div className="fm-container fm-page-banner-content">
          <nav className="fm-crumbs fm-crumbs--light" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/#categories">Aisles</Link>
            <span className="sep">/</span>
            <span aria-current="page">{category.name}</span>
          </nav>

          <span className="fm-cat-banner-eyebrow">
            <Sparkles size={13} /> Fresh Aisle
          </span>
          <h1 className="fm-cat-banner-title">{category.name}</h1>
          <p className="fm-cat-banner-sub">
            {category.tagline} · <strong>{items.length} fresh line{items.length === 1 ? "" : "s"}</strong> · Order by 10am for same-day delivery across Nairobi
          </p>

          <div className="fm-cat-features">
            <div className="fm-cat-feat">
              <Truck size={14} /> Same-day delivery ({formatKES(SITE.deliveryFee)})
            </div>
            <div className="fm-cat-feat">
              <ShieldCheck size={14} /> Morning fresh guarantee
            </div>
            <div className="fm-cat-feat">
              <Clock size={14} /> 2-hour delivery windows
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Pills */}
      <div className="fm-cat-nav-strip">
        <div className="fm-container">
          <div className="fm-filter-scroll" role="navigation" aria-label="Other aisles">
            <Link href={`/category/${category.slug}`} className="fm-filter-pill is-active">
              {category.name} ({items.length})
            </Link>
            {otherCategories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="fm-filter-pill">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="fm-container">
          {items.length === 0 ? (
            <div className="fm-empty-state">
              <p>We’re stocking this aisle right now — check back soon!</p>
              <Link href="/" className="btn btn-brand" style={{ marginTop: 14 }}>
                <ArrowLeft size={14} /> Back to All Products
              </Link>
            </div>
          ) : (
            <div className="fm-product-grid">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i, 8) * 50}>
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
