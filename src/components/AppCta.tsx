import Image from "next/image";
import { Apple, CheckCircle2, Play, Smartphone, Star } from "lucide-react";
import Reveal from "./Reveal";
import { blurFor } from "@/lib/blur-map";

/** App download CTA — split section with interactive CSS phone mockup. */
export default function AppCta() {
  return (
    <div className="fm-app-cta">
      <Reveal>
        <div className="fm-phone" aria-hidden="true">
          <div className="fm-phone-screen">
            <div className="fm-phone-status">
              <span>9:41</span>
              <span>FRESHMART APP</span>
              <span>5G ▮▮▮</span>
            </div>
            <div className="fm-phone-hero-wrap">
              <Image
                src="/images/x-app-shopping.jpg"
                alt=""
                width={280}
                height={150}
                className="fm-phone-hero"
                placeholder="blur"
                blurDataURL={blurFor("/images/x-app-shopping.jpg")}
              />
              <div className="fm-phone-overlay-badge">
                <span>⚡ 30-min Express Delivery</span>
              </div>
            </div>
            <div className="fm-phone-app-body">
              <div className="fm-phone-app-title">Popular in Nairobi Today</div>
              <div className="fm-phone-row">
                <Image
                  src="/images/p-hass-avocados.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-hass-avocados.jpg")}
                />
                <Image
                  src="/images/p-fresh-milk.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-fresh-milk.jpg")}
                />
                <Image
                  src="/images/p-mandazi.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-mandazi.jpg")}
                />
              </div>
              <div className="fm-phone-row">
                <Image
                  src="/images/p-eggs.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-eggs.jpg")}
                />
                <Image
                  src="/images/p-tomatoes.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-tomatoes.jpg")}
                />
                <Image
                  src="/images/p-juice.jpg"
                  alt=""
                  width={75}
                  height={75}
                  placeholder="blur"
                  blurDataURL={blurFor("/images/p-juice.jpg")}
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="fm-app-cta-content">
          <span className="section-eyebrow">
            <Smartphone size={14} /> Mobile App Experience
          </span>
          <h2 className="section-title" style={{ textAlign: "left" }}>
            Shop faster on our mobile app.
          </h2>
          <p className="fm-app-cta-lead">
            Reorder your weekly market basket in two taps, track your rider live on the map, and get
            app-only flash deals before they hit the website. Free on iOS and Android.
          </p>

          <div className="fm-app-rating-pill">
            <div className="fm-stars-row">
              <Star size={14} fill="#b0b435" color="#b0b435" />
              <Star size={14} fill="#b0b435" color="#b0b435" />
              <Star size={14} fill="#b0b435" color="#b0b435" />
              <Star size={14} fill="#b0b435" color="#b0b435" />
              <Star size={14} fill="#b0b435" color="#b0b435" />
            </div>
            <span><strong>4.9 / 5</strong> on iOS & Android · Over 12,000+ Nairobi shoppers</span>
          </div>

          <ul className="fm-app-benefits">
            <li>
              <CheckCircle2 size={16} className="fm-benefit-icon" />
              <span><strong>Live rider tracking:</strong> Watch your delivery door to door in real time.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="fm-benefit-icon" />
              <span><strong>One-tap reordering:</strong> Repeat your regular household or veggie basket in seconds.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="fm-benefit-icon" />
              <span><strong>Instant M-Pesa checkout:</strong> STK push notification directly on your phone.</span>
            </li>
          </ul>

          <div className="fm-store-btns">
            <a href="#" className="btn btn-dark fm-store-btn" aria-label="Download on the App Store">
              <Apple size={20} />
              <div className="fm-store-btn-text">
                <span className="fm-store-btn-small">Download on the</span>
                <span className="fm-store-btn-large">App Store</span>
              </div>
            </a>
            <a href="#" className="btn btn-outline fm-store-btn" aria-label="Get it on Google Play">
              <Play size={18} />
              <div className="fm-store-btn-text">
                <span className="fm-store-btn-small">Get it on</span>
                <span className="fm-store-btn-large">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
