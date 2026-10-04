"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, ZoomIn } from "lucide-react";
import { blurFor } from "@/lib/blur-map";

/** Product image gallery with zoom-on-hover & smooth thumbnail switching. */
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
    const img = el.querySelector(".fm-gallery-main-img");
    if (img) (img as HTMLImageElement).style.transformOrigin = `${x}% ${y}%`;
  };

  const currentImg = images[active] || images[0];

  return (
    <div className="pd-gallery-wrapper">
      <div
        className={`pd-gallery-main ${zooming ? "is-zooming" : ""}`}
        ref={mainRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMove}
      >
        <Image
          key={currentImg}
          src={currentImg}
          alt={`${name} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 991px) 92vw, 640px"
          className="fm-gallery-main-img"
          placeholder="blur"
          blurDataURL={blurFor(currentImg)}
        />
        <div className="pd-gallery-badge">
          <ZoomIn size={14} />
          <span>Hover to Zoom</span>
        </div>
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
              <Image
                src={src}
                alt=""
                width={84}
                height={64}
                className="fm-img-cover"
                placeholder="blur"
                blurDataURL={blurFor(src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
