"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useCartStore, cartCount } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { categories, productsByCategory, categoryCounts } from "@/lib/data";
import { formatKES } from "@/lib/utils";

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
  const openDrawer = useCartStore((s) => s.openDrawer);
  const mounted = useMounted();
  const counts = mounted ? categoryCounts() : {};

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="fm-header">
      <div className="fm-container fm-header-row">
        <Logo />

        {/* Center live search (desktop / tablet-landscape) */}
        <SearchBar />

        <div className="fm-header-actions">
          <Link href="/account" className="fm-icon-btn" aria-label="My account">
            <User />
          </Link>
          <Link href="/wishlist" className="fm-icon-btn" aria-label="Wishlist">
            <Heart />
            <WishlistBadge />
          </Link>
          <button
            type="button"
            className="fm-icon-btn"
            aria-label={`Open cart${mounted ? ` (${cartCount(useCartStore.getState().items)} items)` : ""}`}
            onClick={openDrawer}
          >
            <ShoppingCart />
            <CartBadge />
          </button>
          <button
            type="button"
            className="fm-icon-btn fm-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu />}
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
                {cat.name}
              </Link>
              <div className="fm-mega">
                {productsByCategory(cat.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="fm-mega-product">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} />
                      <span>
                        <span className="fm-mega-name">{p.name}</span>
                        <br />
                        <span className="fm-mega-price">
                          {p.unit} · {formatKES(p.dealPrice ?? p.price)}
                        </span>
                      </span>
                    </Link>
                  ))}
                <div className="fm-mega-cta">
                  <Link href={`/category/${cat.slug}`} className="fm-search-all">
                    Shop all {cat.name} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile nav panel */}
      <div className={`fm-mobile-nav ${menuOpen ? "is-open" : ""}`}>
        <SearchBar />
        <nav className="fm-mobile-cats" aria-label="Shop categories">
          {categories.map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.slug}>
              <span>
                {cat.name} <span style={{ color: "var(--fm-muted)", fontSize: 11 }}>{counts[cat.slug] ?? ""}</span>
              </span>
              <span aria-hidden="true" style={{ color: "var(--fm-brand)" }}>
                ›
              </span>
            </Link>
          ))}
          <Link href="/account">My Account</Link>
          <Link href="/wishlist">Wishlist</Link>
        </nav>
      </div>
    </header>
  );
}
