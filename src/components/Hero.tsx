"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sun } from "lucide-react";
import { blurFor } from "@/lib/blur-map";
import { msUntilMidnightNairobi, splitDuration } from "@/lib/utils";

const HEADLINE_WORDS = ["Fresh.", "Fast.", "Delivered", "to", "Your", "Door."];

/* ---------------- flip digit ---------------- */

function FlipDigit({ digit }: { digit: string }) {
  // key on the digit remounts the span on every change → CSS flip animation
  return (
    <span className="fm-flip-digit is-flipping" key={digit} aria-hidden="true">
      {digit}
    </span>
  );
}

function FlipGroup({ value, label }: { value: string; label: string }) {
  return (
    <span className="fm-flip-group" role="timer" aria-label={`${label} ${value}`}>
      <FlipDigit digit={value[0]} />
      <FlipDigit digit={value[1]} />
    </span>
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

      <div className="fm-hero-inner">
        <div className="fm-container">
          <h1 className={`fm-hero-title ${animated ? "is-animated" : ""}`} ref={titleRef}>
            {HEADLINE_WORDS.map((word, i) => (
              <span className="fm-word" key={word + i} style={{ "--word-delay": `${i * 0.1}s` } as React.CSSProperties}>
                {word}
                {i < HEADLINE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="fm-hero-sub">Order by 10am. Delivered same day in Nairobi.</p>

          <p className="fm-hero-weather">
            <Sun aria-hidden="true" />
            {weather ?? `${greeting}, Nairobi — 24 degrees, a perfect day for a fresh juice.`}
          </p>

          <div className="fm-hero-ctas">
            <Link href="/category/fruits-and-vegetables" className="btn btn-brand">
              Shop Now
            </Link>
            <a href="#deals" className="btn btn-outline-light">
              See Today’s Deals <ArrowRight size={14} />
            </a>
          </div>

          <div className="fm-countdown" aria-live="off">
            <span className="fm-countdown-label">Today’s deals end in</span>
            {t ? (
              <>
                <FlipGroup value={t.h} label="hours" />
                <span className="fm-flip-sep" aria-hidden="true">
                  :
                </span>
                <FlipGroup value={t.m} label="minutes" />
                <span className="fm-flip-sep" aria-hidden="true">
                  :
                </span>
                <FlipGroup value={t.s} label="seconds" />
              </>
            ) : (
              <span className="fm-flip-group">
                <span className="fm-flip-digit">–</span>
                <span className="fm-flip-digit">–</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
