import Image from "next/image";
import { Apple, Play, Smartphone } from "lucide-react";
import Reveal from "./Reveal";
import { blurFor } from "@/lib/blur-map";

/** App download CTA — split section with CSS phone mockup (placeholder). */
export default function AppCta() {
  return (
    <div className="fm-app-cta">
      <Reveal>
        <div className="fm-phone" aria-hidden="true">
          <div className="fm-phone-screen">
            <div className="fm-phone-status">
              <span>9:41</span>
              <span>FRESHMART</span>
              <span>▮▮▮</span>
            </div>
            <Image
              src="/images/x-app-shopping.jpg"
              alt=""
              width={280}
              height={150}
              className="fm-phone-hero"
              placeholder="blur"
              blurDataURL={blurFor("/images/x-app-shopping.jpg")}
            />
            <div className="fm-phone-row">
              <Image src="/images/p-hass-avocados.jpg" alt="" width={80} height={80} />
              <Image src="/images/p-fresh-milk.jpg" alt="" width={80} height={80} />
              <Image src="/images/p-mandazi.jpg" alt="" width={80} height={80} />
            </div>
            <div className="fm-phone-row">
              <Image src="/images/p-eggs.jpg" alt="" width={80} height={80} />
              <Image src="/images/p-tomatoes.jpg" alt="" width={80} height={80} />
              <Image src="/images/p-juice.jpg" alt="" width={80} height={80} />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <span className="section-eyebrow">
          <Smartphone size={14} /> Get the app
        </span>
        <h2 className="section-title" style={{ textAlign: "left" }}>
          Shop faster on our app.
        </h2>
        <p style={{ maxWidth: "46ch" }}>
          Reorder your weekly basket in two taps, track your rider live on the map, and get
          app-only flash deals before they hit the website. Free on iOS and Android.
        </p>
        <ul style={{ margin: "0 0 26px", paddingLeft: 20, fontSize: 15 }}>
          <li>Live rider tracking, door to door</li>
          <li>One-tap repeat of your last order</li>
          <li>FreshPoints balance always at hand</li>
        </ul>
        <div className="fm-store-btns">
          <a href="#" className="btn btn-dark" aria-label="Download on the App Store">
            <Apple size={18} /> App Store
          </a>
          <a href="#" className="btn btn-outline" aria-label="Get it on Google Play">
            <Play size={16} /> Google Play
          </a>
        </div>
      </Reveal>
    </div>
  );
}
