import { Star } from "lucide-react";

export default function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="fm-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? undefined : "is-off"}
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}
