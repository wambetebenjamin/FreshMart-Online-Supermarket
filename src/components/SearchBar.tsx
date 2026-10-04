"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="fm-search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/** Live product search with keyboard navigation, match highlighting, and instant feedback. */
export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = (await res.json()) as { results: Product[] };
        setResults(json.results ?? []);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        /* keep dropdown closed on error */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      setOpen(false);
      router.push(`/products/${results[activeIndex].slug}`);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="fm-search" ref={boxRef}>
      <form className="fm-search-form" onSubmit={go} role="search">
        <Search className="fm-search-icon" size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search fresh avocados, beef cubes, chai, milk…"
          aria-label="Search products"
          autoComplete="off"
        />
        {loading && (
          <span className="fm-search-spinner" aria-label="Loading results">
            <Loader2 size={16} className="fm-spin" />
          </span>
        )}
        {q && !loading && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQ("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="fm-search-clear-btn"
          >
            <X size={15} />
          </button>
        )}
        <button type="submit" aria-label="Search" className="fm-search-submit">
          <Search size={16} />
        </button>
      </form>

      {open && (
        <div className="fm-search-drop">
          {results.length === 0 && !loading && (
            <div className="fm-search-empty">
              <p>No products match “<strong>{q}</strong>”.</p>
              <div className="fm-search-suggestions">
                <span>Popular:</span>
                <button type="button" onClick={() => setQ("Avocado")}>Avocados</button>
                <button type="button" onClick={() => setQ("Milk")}>Fresh Milk</button>
                <button type="button" onClick={() => setQ("Beef")}>Beef Cubes</button>
                <button type="button" onClick={() => setQ("Tea")}>Kericho Tea</button>
              </div>
            </div>
          )}

          {results.map((p, idx) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={`fm-search-item ${idx === activeIndex ? "is-selected" : ""}`}
              onClick={() => setOpen(false)}
            >
              <div className="fm-search-thumb">
                <Image
                  src={p.image}
                  alt=""
                  width={46}
                  height={46}
                  className="fm-img-cover"
                  placeholder="blur"
                  blurDataURL={blurFor(p.image)}
                />
              </div>
              <div className="fm-search-info">
                <span className="fm-search-name">{highlightMatch(p.name, q)}</span>
                <span className="fm-search-meta">
                  <span className="fm-search-cat">{p.category.replace(/-/g, " ")}</span> · {p.unit}
                </span>
              </div>
              <div className="fm-search-price-col">
                <span className="fm-search-price">{formatKES(p.dealPrice ?? p.price)}</span>
                {p.dealPrice && <span className="fm-search-was">{formatKES(p.price)}</span>}
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <button
              type="button"
              className="fm-search-all"
              onClick={() => {
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
            >
              <span>View all {results.length} results for “{q}”</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
