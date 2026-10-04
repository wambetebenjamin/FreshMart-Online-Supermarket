"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  duration?: number; // seconds for one full loop
  gap?: number; // px between items
  className?: string;
}

/**
 * Continuous horizontal marquee (pure CSS animation) that pauses on hover
 * and on touch. Under prefers-reduced-motion the animation is disabled
 * (see globals.css) and items simply wrap.
 */
export default function Marquee({
  children,
  duration = 46,
  gap = 24,
  className,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = () => el.classList.add("is-touch");
    const onTouchEnd = () => el.classList.remove("is-touch");
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const setStyle = { display: "flex", gap: `${gap}px`, paddingRight: `${gap}px` } as const;

  return (
    <div ref={ref} className={`fm-marquee ${className ?? ""}`}>
      <div
        className="fm-marquee-track"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="fm-marquee-set" style={setStyle}>
          {children}
        </div>
        <div className="fm-marquee-set" style={setStyle} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
