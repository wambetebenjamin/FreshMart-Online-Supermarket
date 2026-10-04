import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Truck } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import Accordion from "@/components/Accordion";
import Stars from "@/components/Stars";
import { getCategory, getProduct, products, relatedProducts } from "@/lib/data";
import { formatKES, percentOff, SITE } from "@/lib/utils";

export const revalidate = 180; // ISR

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  const price = product.dealPrice ?? product.price;
  return {
    title: `${product.name} — ${formatKES(price)}`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${formatKES(price)} | FreshMart`,
      description: product.description,
      url: `${SITE.url}/products/${product.slug}`,
      images: [{ url: product.image, width: 500, height: 500, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${formatKES(price)} | FreshMart`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const price = product.dealPrice ?? product.price;
  const off = percentOff(product.price, product.dealPrice);
  const related = relatedProducts(product, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [`${SITE.url}${product.image}`],
    description: product.description,
    sku: product.slug.toUpperCase(),
    brand: { "@type": "Brand", name: "FreshMart" },
    category: category?.name,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.slug}`,
      priceCurrency: "KES",
      price,
      availability:
        product.stock === "in" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      seller: { "@type": "Organization", name: SITE.legalName },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    },
  };

  return (
    <div className="fm-container section" style={{ paddingTop: 26 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="fm-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href={`/category/${product.category}`}>{category?.name}</Link>
        <span className="sep">/</span>
        <span aria-current="page" style={{ color: "var(--fm-ink)" }}>
          {product.name}
        </span>
      </nav>

      <div className="pd-layout">
        <ProductGallery images={product.gallery} name={product.name} />

        <div>
          {product.isNew && <span className="fm-chip fm-chip--new" style={{ marginBottom: 10 }}>New</span>}
          <h1 className="pd-name">{product.name}</h1>

          <p style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Stars rating={product.rating} />
            <span className="pd-meta">
              {product.rating.toFixed(1)} · {product.ratingCount} reviews
            </span>
          </p>

          <div className="pd-price-row">
            <span className="pd-price">{formatKES(price)}</span>
            {off > 0 && <span className="pd-was">{formatKES(product.price)}</span>}
            {off > 0 && <span className="fm-chip fm-chip--sale">-{off}% today</span>}
          </div>
          <p className="pd-meta">{product.unit}</p>

          <p className={`pc-stock ${product.stock === "in" ? "pc-stock--in" : "pc-stock--low"}`} style={{ marginBottom: 18 }}>
            <span className="dot" />
            {product.stock === "in" ? "In Stock — order by 10am for same-day delivery" : "Low Stock — only a few left today"}
          </p>

          <p style={{ fontSize: 15 }}>{product.description}</p>
          <p className="pd-meta" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <MapPin size={13} /> Origin: {product.origin}
          </p>

          <ProductActions product={product} />

          <div className="pd-delivery-box">
            <Truck />
            <p>
              <strong>Delivery within Nairobi — {formatKES(SITE.deliveryFee)}</strong>
              <br />
              Order by {SITE.sameDayCutoff} for same-day delivery. Choose a 2-hour slot at checkout.
              Keep-cold items travel in insulated boxes.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion: description / nutrition / storage */}
      <div style={{ marginTop: 54, maxWidth: 860 }}>
        <h2 style={{ fontSize: 22 }}>Product details</h2>
        <Accordion title="Description" defaultOpen>
          <p>{product.description}</p>
          <p className="pd-meta">Origin: {product.origin} · Unit: {product.unit}</p>
        </Accordion>

        {product.nutrition ? (
          <Accordion title="Nutritional information (per 100 g)">
            <table className="nutrition-table">
              <tbody>
                <tr>
                  <td>Energy</td>
                  <td>{product.nutrition.energy}</td>
                </tr>
                <tr>
                  <td>Protein</td>
                  <td>{product.nutrition.protein}</td>
                </tr>
                <tr>
                  <td>Carbohydrates</td>
                  <td>{product.nutrition.carbs}</td>
                </tr>
                <tr>
                  <td>Fat</td>
                  <td>{product.nutrition.fat}</td>
                </tr>
                <tr>
                  <td>Fibre</td>
                  <td>{product.nutrition.fibre}</td>
                </tr>
              </tbody>
            </table>
          </Accordion>
        ) : (
          <Accordion title="Care & use">
            <p>{product.storage}</p>
          </Accordion>
        )}

        <Accordion title="Storage & delivery">
          <p>{product.storage}</p>
          <p className="pd-meta">
            Delivered within Nairobi for {formatKES(SITE.deliveryFee)}. Same-day when you order before {SITE.sameDayCutoff}.
          </p>
        </Accordion>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 54, maxWidth: 860 }}>
        <h2 style={{ fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
          Customer reviews <Stars rating={product.rating} />
        </h2>
        {product.reviews.length === 0 && <p className="pd-meta">No reviews yet — be the first when your order arrives.</p>}
        {product.reviews.map((r) => (
          <article className="fm-review" key={r.author + r.date}>
            <div className="fm-review-head">
              <div>
                <div className="fm-review-name">{r.author}</div>
                <div className="fm-review-meta">
                  {r.area} · {r.date}
                </div>
              </div>
              <Stars rating={r.rating} size={13} />
            </div>
            <p style={{ margin: 0 }}>{r.text}</p>
          </article>
        ))}
      </div>

      {/* Related products */}
      <div style={{ marginTop: 54 }}>
        <h2 style={{ fontSize: 22 }}>You may also like</h2>
        <div className="fm-hscroll">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
