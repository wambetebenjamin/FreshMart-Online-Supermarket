import Image from "next/image";
import { CheckCircle2, Quote } from "lucide-react";
import Reveal from "./Reveal";
import Stars from "./Stars";
import { testimonials } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";

/** Customer testimonials with verified buyer badges and stagger fade-up. */
export default function Testimonials() {
  return (
    <div className="fm-testimonials">
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 100}>
          <figure className="fm-testimonial">
            <Quote className="quote-mark" aria-hidden="true" />
            <blockquote>“{t.text}”</blockquote>
            <figcaption className="fm-testi-person">
              <div className="fm-testi-avatar-wrap">
                <Image
                  src={t.avatar}
                  alt={`${t.name}, ${t.area}`}
                  width={52}
                  height={52}
                  className="fm-img-cover"
                  placeholder="blur"
                  blurDataURL={blurFor(t.avatar)}
                  loading="lazy"
                />
              </div>
              <div className="fm-testi-info">
                <div className="fm-testi-name">
                  {t.name}
                  <span className="fm-verified-badge" title="Verified Customer">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
                <div className="fm-testi-area">
                  {t.area} · <span className="fm-testi-role">{t.role}</span>
                </div>
              </div>
              <div className="fm-testi-stars">
                <Stars rating={t.rating} size={13} />
              </div>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
