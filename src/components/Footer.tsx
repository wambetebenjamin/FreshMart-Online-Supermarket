import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon, YoutubeIcon } from "./BrandIcons";
import { categories } from "@/lib/data";
import { SITE, WHATSAPP_HELP_URL } from "@/lib/utils";

/** Footer — quick links, WhatsApp care, delivery map, socials, newsletter, payments. */
export default function Footer() {
  return (
    <footer className="fm-footer">
      <div className="fm-container">
        <div className="fm-footer-grid">
          <div>
            <Logo />
            <p style={{ marginTop: 16 }}>
              Nairobi’s online supermarket. Fresh produce from Kenyan farms, butcher-cut meat,
              bakery favourites and household essentials — ordered in minutes, delivered same day.
            </p>
            <div className="fm-socials">
              <a className="fm-social" href="#" aria-label="FreshMart on Facebook"><FacebookIcon /></a>
              <a className="fm-social" href="#" aria-label="FreshMart on Instagram"><InstagramIcon /></a>
              <a className="fm-social" href="#" aria-label="FreshMart on X"><XIcon /></a>
              <a className="fm-social" href="#" aria-label="FreshMart on YouTube"><YoutubeIcon /></a>
            </div>
            <div className="fm-payments" style={{ marginTop: 22 }}>
              <span className="fm-pay-chip fm-pay-chip--mpesa">M-PESA</span>
              <span className="fm-pay-chip fm-pay-chip--visa">VISA</span>
              <span className="fm-pay-chip" style={{ border: "1px solid #333" }}>
                PAY ON DELIVERY
              </span>
            </div>
          </div>

          <nav aria-label="Shop by category">
            <h4>Shop</h4>
            <ul className="fm-footer-links">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="FreshMart links">
            <h4>FreshMart</h4>
            <ul className="fm-footer-links">
              <li><Link href="/#bundles">Weekly Boxes</Link></li>
              <li><Link href="/#loyalty">FreshPoints</Link></li>
              <li><Link href="/#how">How Delivery Works</Link></li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/search">Search</Link></li>
            </ul>
          </nav>

          <div>
            <h4>Customer Care</h4>
            <ul className="fm-footer-contact">
              <li>
                <Phone />
                <span>
                  <a href={`tel:+${SITE.whatsappNumber}`}>{SITE.phoneDisplay}</a>
                  <br />
                  <a
                    href={WHATSAPP_HELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}
                  >
                    <WhatsAppIcon size={13} /> WhatsApp Us
                  </a>
                </span>
              </li>
              <li>
                <Mail />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <Clock />
                <span>
                  Mon – Sat: 7:00am – 8:00pm
                  <br />
                  Sunday: 9:00am – 6:00pm
                </span>
              </li>
              <li>
                <MapPin />
                <span>{SITE.address}</span>
              </li>
            </ul>

            <div className="fm-map-card">
              <iframe
                title="FreshMart delivery areas — Nairobi"
                src="https://www.google.com/maps?q=Nairobi,+Kenya&z=11&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="fm-map-cta"
                href="https://www.google.com/maps/place/Nairobi,+Kenya"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={14} /> Delivery areas — Nairobi
              </a>
            </div>
          </div>
        </div>

        <div className="fm-footer-grid" style={{ gridTemplateColumns: "1fr", marginTop: 44, paddingTop: 0 }}>
          <div>
            <h4>Weekly Fresh Deals</h4>
            <p style={{ fontSize: 14, margin: "0 0 10px" }}>
              One email a week — the best of the market, deals and box menus. No spam, ever.
            </p>
            <NewsletterForm />
            {""}
          </div>
        </div>
      </div>

      <div className="fm-footer-bottom">
        <div className="fm-container">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved. ·{" "}
            <Link href="/#how">Delivery info</Link> ·{" "}
            <a href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
              Order help on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
