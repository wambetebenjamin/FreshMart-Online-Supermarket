"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Sun, Zap } from "lucide-react";
import { blurFor } from "@/lib/blur-map";
import { msUntilMidnightNairobi, splitDuration } from "@/lib/utils";

const HEADLINE_WORDS = [
  { text: "Fresh.", highlight: true },
  { text: "Fast.", highlight: true },
  { text: "Delivered", highlight: false },
  { text: "to", highlight: false },
  { text: "Your", highlight: false },
  { text: "Door.", highlight: true },
];

/* ---------------- flip digit ---------------- */

function FlipDigit({ digit }: { digit: string }) {
  return (
    <span className="fm-flip-digit is-flipping" key={digit} aria-hidden="true">
      {digit}
    </span>
  );
}

function FlipGroup({ value, label }: { value: string; label: string }) {
  return (
    <div className="fm-flip-box" role="timer" aria-label={`${label} ${value}`}>
      <span className="fm-flip-group">
        <FlipDigit digit={value[0]} />
        <FlipDigit digit={value[1]} />
      </span>
      <span className="fm-flip-unit-label">{label}</span>
    </div>
  );
}

/* ---------------- hero ---------------- */

export default function Hero() {
  const [animated, setAnimated] = useState(false);
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Word-by-word entrance
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Live countdown to midnight Nairobi (resets daily)
  useEffect(() => {
    const tick = () => setMsLeft(msUntilMidnightNairobi());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Optional OpenWeatherMap line (falls back to a friendly static line)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json?.line) setWeather(json.line);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const t = msLeft === null ? null : splitDuration(msLeft);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <section className="fm-hero" aria-label="FreshMart — fresh groceries delivered in Nairobi">
      <div className="fm-hero-img">
        <Image
          src="/images/hero-nairobi-market.jpg"
          alt="A colourful street market stall in Nairobi, Kenya, piled with fresh produce"
          fill
          priority
          sizes="100vw"
          className="fm-hero-photo"
          placeholder="blur"
          blurDataURL={blurFor("/images/hero-nairobi-market.jpg")}
        />
      </div>
      <div className="fm-hero-overlay" aria-hidden="true" />
      <div className="fm-hero-glow" aria-hidden="true" />

      <div className="fm-hero-inner">
        <div className="fm-container">
          {/* Top trust badge */}
          <div className="fm-hero-badge">
            <span className="fm-hero-badge-dot" />
            <Zap size={13} className="fm-hero-badge-icon" />
            <span>Nairobi’s #1 Online Supermarket · Same-Day Delivery</span>
          </div>

          <h1 className={`fm-hero-title ${animated ? "is-animated" : ""}`} ref={titleRef}>
            {HEADLINE_WORDS.map((item, i) => (
              <span
                className={`fm-word ${item.highlight ? "fm-word--brand" : ""}`}
                key={item.text + i}
                style={{ "--word-delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                {item.text}
                {i < HEADLINE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="fm-hero-sub">
            Order by <strong>10am</strong> and get fresh market produce, butcher-cut meat & bakery favourites delivered same day across Nairobi.
          </p>

          <div className="fm-hero-weather">
            <Sun aria-hidden="true" className="fm-sun-spin" />
            <span>{weather ?? `${greeting}, Nairobi — 24°C, a perfect day for fresh groceries.`}</span>
          </div>

          <div className="fm-hero-ctas">
            <Link href="/category/fruits-and-vegetables" className="btn btn-brand fm-hero-btn-main">
              <Sparkles size={16} /> Shop Fresh Produce
            </Link>
            <a href="#deals" className="btn btn-outline-light fm-hero-btn-deals">
              See Today’s Deals <ArrowRight size={15} />
            </a>
          </div>

          <div className="fm-countdown" aria-live="off">
            <div className="fm-countdown-header">
              <span className="fm-countdown-label">Today’s Flash Deals End In:</span>
            </div>
            <div className="fm-countdown-digits">
              {t ? (
                <>
                  <FlipGroup value={t.h} label="HRS" />
                  <span className="fm-flip-sep" aria-hidden="true">
                    :
                  </span>
                  <FlipGroup value={t.m} label="MIN" />
                  <span className="fm-flip-sep" aria-hidden="true">
                    :
                  </span>
                  <FlipGroup value={t.s} label="SEC" />
                </>
              ) : (
                <div className="fm-flip-box">
                  <span className="fm-flip-group">
                    <span className="fm-flip-digit">–</span>
                    <span className="fm-flip-digit">–</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
