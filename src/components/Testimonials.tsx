import Image from "next/image";
import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import Stars from "./Stars";
import { testimonials } from "@/lib/data";
import { blurFor } from "@/lib/blur-map";

/** East African customer testimonials — stagger fade-up on scroll. */
export default function Testimonials() {
  return (
    <div className="fm-testimonials">
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 120}>
          <figure className="fm-testimonial">
            <Quote className="quote-mark" aria-hidden="true" />
            <blockquote>{t.text}</blockquote>
            <figcaption className="fm-testi-person">
              <Image
                src={t.avatar}
                alt={`${t.name}, ${t.area}`}
                width={48}
                height={48}
                placeholder="blur"
                blurDataURL={blurFor(t.avatar)}
              />
              <span>
                <span className="fm-testi-name">{t.name}</span>
                <br />
                <span className="fm-testi-area">
                  {t.area} · <span className="fm-testi-role">{t.role}</span>
                </span>
              </span>
              <Stars rating={t.rating} size={13} />
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
