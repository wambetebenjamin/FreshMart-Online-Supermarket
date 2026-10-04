"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { blurFor } from "@/lib/blur-map";

/** Product image gallery with zoom-on-hover (transform-origin follows the cursor). */
export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = mainRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const img = el.querySelector("img");
    if (img) (img as HTMLImageElement).style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div>
      <div
        className={`pd-gallery-main ${zooming ? "is-zooming" : ""}`}
        ref={mainRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMove}
      >
        <Image
          src={images[active]}
          alt={`${name} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 991px) 92vw, 640px"
          placeholder="blur"
          blurDataURL={blurFor(images[active])}
        />
      </div>
      {images.length > 1 && (
        <div className="pd-thumbs" role="tablist" aria-label="Product photos">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show photo ${i + 1}`}
              className={`pd-thumb ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <p style={{ fontSize: 11, color: "var(--fm-muted)", marginTop: 8, letterSpacing: "0.03em" }}>
        Hover the photo to zoom in.
      </p>
    </div>
  );
}
