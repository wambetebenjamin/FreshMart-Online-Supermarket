"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number; // stagger in ms
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Scroll-triggered reveal. Adds `.is-visible` when the element enters the
 * viewport — CSS handles the fade/slide. With prefers-reduced-motion the
 * CSS collapses the transition to an instant opacity change.
 */
export default function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as any;
  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};
  return (
    <Tag ref={ref} className={`fm-reveal ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}
