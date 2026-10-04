"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/data";

/** Live product search — results drop in as the user types. */
export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = (await res.json()) as { results: Product[] };
        setResults(json.results ?? []);
        setOpen(true);
      } catch {
        /* keep dropdown closed on error */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          placeholder="Search fresh produce, meat, chai…"
          aria-label="Search products"
        />
        {q && (
          <button type="button" aria-label="Clear search" onClick={() => { setQ(""); setOpen(false); }} style={{ background: "transparent", color: "var(--fm-muted)", padding: "6px 8px", border: 0 }}>
            <X size={16} />
          </button>
        )}
        <button type="submit" aria-label="Search">
          <Search size={17} />
        </button>
      </form>

      {open && (
        <div className="fm-search-drop">
          {results.length === 0 && !loading && (
            <p className="fm-search-empty">No products match “{q}”. Try “avocado”, “milk”, “tea”…</p>
          )}
          {results.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="fm-search-item" onClick={() => setOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" />
              <span>
                <span className="fm-search-name">{p.name}</span>
                <span className="fm-search-meta">
                  {p.unit} · {formatKES(p.dealPrice ?? p.price)}
                </span>
              </span>
              <span className="fm-search-price">{formatKES(p.dealPrice ?? p.price)}</span>
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
              View all results for “{q}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
