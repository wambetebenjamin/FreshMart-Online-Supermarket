import { ArrowRight, BadgePercent, Gift, Store, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import DealsCarousel from "@/components/DealsCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import FeaturedGrid from "@/components/FeaturedGrid";
import BundlesSection from "@/components/BundlesSection";
import LoyaltySection from "@/components/LoyaltySection";
import BrandsStrip from "@/components/BrandsStrip";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import AppCta from "@/components/AppCta";
import Reveal from "@/components/Reveal";
import { getDeals } from "@/lib/data";
import { formatKES } from "@/lib/utils";

export const revalidate = 180; // ISR — same cadence as product/category pages

export default function HomePage() {
  const deals = getDeals();
  const biggestDeal = deals.reduce(
    (best, p) => {
      const off = p.dealPrice ? Math.round((1 - p.dealPrice / p.price) * 100) : 0;
      return off > best.off ? { off, name: p.name } : best;
    },
    { off: 0, name: "" }
  );

  return (
    <>
      <Hero />

      {/* ---------- Deals & offers strip ---------- */}
      <section className="section section--alt" id="deals" aria-labelledby="deals-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">
              <BadgePercent size={14} /> Today’s deals
            </span>
            <h2 className="section-title" id="deals-title">
              Fresh deals, every single day.
            </h2>
            <p className="section-sub">
              New discounts drop at midnight Nairobi time{biggestDeal.off > 0 ? ` — right now up to ${biggestDeal.off}% off ${biggestDeal.name.toLowerCase()}` : ""}.
            </p>
          </div>
        </div>
        <div className="fm-container" style={{ maxWidth: "100%" }}>
          <DealsCarousel />
        </div>
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className="section" id="categories" aria-labelledby="cats-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">
              <Store size={14} /> Shop by category
            </span>
            <h2 className="section-title" id="cats-title">
              Everything on your list, in one place.
            </h2>
            <p className="section-sub">Nine aisles of fresh — from Wakulima market greens to frozen fries.</p>
          </div>
          <CategoryTiles />
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="section section--soft" id="featured" aria-labelledby="featured-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">
              <Truck size={14} /> Fresh this week
            </span>
            <h2 className="section-title" id="featured-title">
              Featured products.
            </h2>
            <p className="section-sub">Hand-picked by our team — the best of the market right now.</p>
          </div>
          <FeaturedGrid />
        </div>
      </section>

      {/* ---------- Subscription bundles ---------- */}
      <section className="section" id="bundles" aria-labelledby="bundles-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">
              <Gift size={14} /> Subscription boxes
            </span>
            <h2 className="section-title" id="bundles-title">
              Weekly boxes, zero effort.
            </h2>
            <p className="section-sub">
              Choose a box once — we deliver the week’s essentials on your day, every week. Pause or cancel any time.
            </p>
          </div>
          <BundlesSection />
        </div>
      </section>

      {/* ---------- FreshPoints loyalty ---------- */}
      <section className="section section--soft" id="loyalty" aria-labelledby="loyalty-title">
        <div className="fm-container">
          <LoyaltySection />
        </div>
      </section>

      {/* ---------- Brands & suppliers ---------- */}
      <section className="section" id="brands" aria-labelledby="brands-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">Brands & suppliers</span>
            <h2 className="section-title" id="brands-title">
              Proudly stocked with Kenyan & East African brands.
            </h2>
            <p className="section-sub">
              From Kericho tea gardens to Nairobi bakeries — we source close to home.
            </p>
          </div>
        </div>
        <BrandsStrip />
      </section>

      {/* ---------- How delivery works ---------- */}
      <section className="section section--soft" id="how" aria-labelledby="how-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">
              <Truck size={14} /> How delivery works
            </span>
            <h2 className="section-title" id="how-title">
              From our market to your door in four steps.
            </h2>
            <p className="section-sub">
              Order by {`10am`} and we deliver the same day, anywhere in Nairobi — delivery is {formatKES(150)}.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="section" id="testimonials" aria-labelledby="testi-title">
        <div className="fm-container">
          <div className="section-head">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title" id="testi-title">
              What Nairobi says.
            </h2>
            <p className="section-sub">Real customers, real kitchens, real time saved.</p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ---------- App download CTA ---------- */}
      <section className="section section--alt" id="app" aria-labelledby="app-title">
        <div className="fm-container">
          <AppCta />
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="fm-container">
          <Reveal>
            <div
              style={{
                background: "var(--fm-black)",
                color: "var(--fm-white)",
                padding: "44px 40px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 22,
              }}
            >
              <div>
                <h2 style={{ color: "var(--fm-white)", margin: "0 0 6px", fontSize: 26 }}>
                  Dinner ingredients, sorted before lunch.
                </h2>
                <p style={{ margin: 0, color: "var(--fm-footer-text)", fontSize: 15 }}>
                  Order by 10am — we’ll be at your gate today. Delivery from {formatKES(150)} within Nairobi.
                </p>
              </div>
              <a href="#deals" className="btn btn-brand" style={{ padding: "17px 32px" }}>
                See Today’s Deals <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
