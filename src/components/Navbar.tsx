"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Heart, Menu, ShoppingCart, Sparkles, User, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useCartStore, cartCount } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { categories, productsByCategory, categoryCounts } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { blurFor } from "@/lib/blur-map";

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function CartBadge() {
  const items = useCartStore((s) => s.items);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const mounted = useMounted();
  const count = mounted ? cartCount(items) : 0;
  if (count === 0) return null;
  return (
    <span key={lastAddedAt} className={`fm-badge fm-badge-spring ${count > 9 ? "fm-badge--brand" : ""}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

function WishlistBadge() {
  const slugs = useWishlistStore((s) => s.slugs);
  const mounted = useMounted();
  const count = mounted ? slugs.length : 0;
  if (count === 0) return null;
  return <span className="fm-badge fm-badge--brand">{count > 99 ? "99+" : count}</span>;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const mounted = useMounted();
  const counts = mounted ? categoryCounts() : {};

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fm-header ${scrolled ? "is-scrolled" : ""}`}>
      {/* Top micro announcement bar */}
      <div className="fm-topbar">
        <div className="fm-container fm-topbar-inner">
          <div className="fm-topbar-left">
            <span className="fm-topbar-pulse" />
            <Sparkles size={12} className="fm-topbar-icon" />
            <span>Order by 10am for <strong>Same-Day Delivery</strong> across Nairobi</span>
          </div>
          <div className="fm-topbar-right">
            <span>Free delivery on orders over KES 2,500</span>
            <span className="fm-topbar-sep">•</span>
            <a href="https://wa.me/254112272061" target="_blank" rel="noopener noreferrer">
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      <div className="fm-container fm-header-row">
        <Logo />

        {/* Center live search (desktop / tablet-landscape) */}
        <SearchBar />

        <div className="fm-header-actions">
          <Link href="/account" className="fm-icon-btn" aria-label="My account">
            <User size={20} />
            <span className="fm-icon-label">Account</span>
          </Link>
          <Link href="/wishlist" className="fm-icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            <WishlistBadge />
            <span className="fm-icon-label">Wishlist</span>
          </Link>
          <button
            type="button"
            className="fm-icon-btn fm-cart-btn-main"
            aria-label={`Open cart${mounted ? ` (${cartCount(useCartStore.getState().items)} items)` : ""}`}
            onClick={openDrawer}
          >
            <ShoppingCart size={20} />
            <CartBadge />
            <span className="fm-icon-label">Basket</span>
          </button>
          <button
            type="button"
            className="fm-icon-btn fm-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category mega-menu strip — desktop only */}
      <div className="fm-cat-strip">
        <nav aria-label="Shop categories">
          {categories.map((cat) => (
            <div className="fm-cat-item" key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className={`fm-cat-link ${pathname === `/category/${cat.slug}` ? "is-active" : ""}`}
              >
                <span>{cat.name}</span>
              </Link>
              <div className="fm-mega">
                <div className="fm-mega-grid">
                  {productsByCategory(cat.slug)
                    .slice(0, 4)
                    .map((p) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} className="fm-mega-product">
                        <div className="fm-mega-img">
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={52}
                            height={52}
                            className="fm-img-cover"
                            placeholder="blur"
                            blurDataURL={blurFor(p.image)}
                          />
                        </div>
                        <div className="fm-mega-info">
                          <span className="fm-mega-name">{p.name}</span>
                          <span className="fm-mega-price">
                            {p.unit} · <strong>{formatKES(p.dealPrice ?? p.price)}</strong>
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
                <div className="fm-mega-cta">
                  <Link href={`/category/${cat.slug}`} className="fm-search-all">
                    Shop all {cat.name} ({counts[cat.slug] ?? 0} items) <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile nav panel with staggered fade */}
      <div className={`fm-mobile-nav ${menuOpen ? "is-open" : ""}`}>
        <div className="fm-mobile-search-wrap">
          <SearchBar />
        </div>
        <nav className="fm-mobile-cats" aria-label="Shop categories">
          <div className="fm-mobile-section-label">Aisles & Categories</div>
          {categories.map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.slug} className="fm-mobile-cat-link">
              <span className="fm-mobile-cat-name">
                {cat.name}
                <span className="fm-mobile-count">{counts[cat.slug] ?? ""} items</span>
              </span>
              <span aria-hidden="true" className="fm-mobile-chevron">
                ›
              </span>
            </Link>
          ))}
          <div className="fm-mobile-section-label" style={{ marginTop: 14 }}>My FreshMart</div>
          <Link href="/account" className="fm-mobile-cat-link">
            <span>My Account & FreshPoints</span>
            <span aria-hidden="true" className="fm-mobile-chevron">›</span>
          </Link>
          <Link href="/wishlist" className="fm-mobile-cat-link">
            <span>Saved Wishlist Items</span>
            <span aria-hidden="true" className="fm-mobile-chevron">›</span>
          </Link>
          <Link href="/#bundles" className="fm-mobile-cat-link">
            <span>Weekly Subscription Boxes</span>
            <span aria-hidden="true" className="fm-mobile-chevron">›</span>
          </Link>
          <Link href="/#how" className="fm-mobile-cat-link">
            <span>How Delivery Works in Nairobi</span>
            <span aria-hidden="true" className="fm-mobile-chevron">›</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
