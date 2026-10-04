import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Leaf, MapPin, RefreshCw, ShieldCheck, Sparkles, Truck } from "lucide-react";
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
        <span aria-current="page" style={{ color: "var(--fm-ink)", fontWeight: 600 }}>
          {product.name}
        </span>
      </nav>

      <div className="pd-layout">
        <ProductGallery images={product.gallery} name={product.name} />

        <div className="pd-info-col">
          {product.isNew && <span className="fm-chip fm-chip--new" style={{ marginBottom: 10 }}>New Arrival</span>}
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-rating-bar">
            <Stars rating={product.rating} size={15} />
            <span className="pd-meta">
              <strong>{product.rating.toFixed(1)}</strong> ({product.ratingCount} verified customer reviews)
            </span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">{formatKES(price)}</span>
            {off > 0 && <span className="pd-was">{formatKES(product.price)}</span>}
            {off > 0 && <span className="fm-chip fm-chip--sale">Save {off}% Today</span>}
          </div>
          <p className="pd-meta" style={{ fontSize: 13, marginBottom: 12 }}>Unit: <strong>{product.unit}</strong></p>

          <p className={`pc-stock ${product.stock === "in" ? "pc-stock--in" : "pc-stock--low"}`} style={{ marginBottom: 18 }}>
            <span className="dot" />
            {product.stock === "in" ? "In Stock — Order by 10am for same-day delivery" : "Low Stock — Only a few left in Nairobi today"}
          </p>

          <p className="pd-desc-lead">{product.description}</p>

          <div className="pd-origin-pill">
            <MapPin size={14} /> Origin: <strong>{product.origin}</strong>
          </div>

          <ProductActions product={product} />

          {/* Value Props & Trust Badges */}
          <div className="pd-trust-grid">
            <div className="pd-trust-item">
              <Leaf size={16} />
              <span>100% Farm Fresh Quality</span>
            </div>
            <div className="pd-trust-item">
              <Truck size={16} />
              <span>Same-Day Nairobi Delivery</span>
            </div>
            <div className="pd-trust-item">
              <ShieldCheck size={16} />
              <span>M-Pesa & Cash on Delivery</span>
            </div>
            <div className="pd-trust-item">
              <RefreshCw size={16} />
              <span>Freshness Guarantee</span>
            </div>
          </div>

          <div className="pd-delivery-box">
            <Truck />
            <p>
              <strong>Nairobi Delivery — {formatKES(SITE.deliveryFee)} (FREE on orders over KES 2,500)</strong>
              <br />
              Order by {SITE.sameDayCutoff} for same-day delivery. Choose your preferred 2-hour delivery slot at checkout.
              Perishable items travel in insulated cooling containers.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion: description / nutrition / storage */}
      <div style={{ marginTop: 54, maxWidth: 860 }}>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Product Specifications & Care</h2>
        <Accordion title="Description & Details" defaultOpen>
          <p>{product.description}</p>
          <p className="pd-meta">Origin: <strong>{product.origin}</strong> · Pack Unit: <strong>{product.unit}</strong> · Category: <strong>{category?.name}</strong></p>
        </Accordion>

        {product.nutrition ? (
          <Accordion title="Nutritional Information (per 100 g)">
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
                  <td>Dietary Fibre</td>
                  <td>{product.nutrition.fibre}</td>
                </tr>
              </tbody>
            </table>
          </Accordion>
        ) : (
          <Accordion title="Care & Handling">
            <p>{product.storage}</p>
          </Accordion>
        )}

        <Accordion title="Storage & Freshness Tips">
          <p>{product.storage}</p>
          <p className="pd-meta">
            Delivered fresh within Nairobi for {formatKES(SITE.deliveryFee)}. Same-day when ordered before {SITE.sameDayCutoff}.
          </p>
        </Accordion>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 54, maxWidth: 860 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            Customer Reviews <Stars rating={product.rating} size={18} />
          </h2>
          <span className="pd-meta" style={{ fontSize: 13 }}>
            Based on {product.ratingCount} verified Nairobi reviews
          </span>
        </div>

        {product.reviews.length === 0 && (
          <div className="fm-empty-state" style={{ padding: "30px 20px" }}>
            <p className="pd-meta">No reviews yet — be the first to review when your order arrives.</p>
          </div>
        )}

        {product.reviews.map((r) => (
          <article className="fm-review" key={r.author + r.date}>
            <div className="fm-review-head">
              <div>
                <div className="fm-review-name">
                  {r.author} <span className="fm-verified-badge"><CheckCircle2 size={12} /> Verified Buyer</span>
                </div>
                <div className="fm-review-meta">
                  {r.area} · {r.date}
                </div>
              </div>
              <Stars rating={r.rating} size={14} />
            </div>
            <p style={{ margin: 0, fontSize: 14.5 }}>{r.text}</p>
          </article>
        ))}
      </div>

      {/* Related products */}
      <div style={{ marginTop: 54 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>You May Also Like</h2>
          <Link href={`/category/${product.category}`} className="fm-see-all-link">
            View All in {category?.name} →
          </Link>
        </div>
        <div className="fm-hscroll">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
