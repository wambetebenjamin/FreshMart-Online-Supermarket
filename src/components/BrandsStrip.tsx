import { Leaf } from "lucide-react";
import Marquee from "./Marquee";
import { brands } from "@/lib/data";

/** Kenyan & East African brand partners — continuous marquee, pauses on hover. */
export default function BrandsStrip() {
  return (
    <Marquee duration={36}>
      {brands.map((brand) => (
        <span className="brand-chip" key={brand}>
          <Leaf aria-hidden="true" />
          {brand}
        </span>
      ))}
    </Marquee>
  );
}
