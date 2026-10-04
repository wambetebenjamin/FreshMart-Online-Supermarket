import { ClipboardCheck, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: ShoppingCart,
    title: "Browse & Add to Cart",
    text: "Shop over 500 fresh lines from your phone. Live search finds the exact cut, crate or crate-free option you need.",
  },
  {
    icon: ClipboardCheck,
    title: "Place Order",
    text: "Check out with M-Pesa or pay on delivery. Pick the delivery slot that fits your day — morning to evening.",
  },
  {
    icon: PackageCheck,
    title: "We Pack Fresh",
    text: "Your order is picked the same day it ships — produce from the morning market, meat cut to order, dairy kept cold.",
  },
  {
    icon: Truck,
    title: "Delivered to You",
    text: "Our riders bring it to your door anywhere in Nairobi in refrigerated boxes. Order by 10am for same-day delivery.",
  },
];

/** 4-step animated horizontal timeline — steps fade in on scroll, 100ms stagger. */
export default function HowItWorks() {
  return (
    <div className="fm-timeline">
      {STEPS.map((step, i) => (
        <Reveal key={step.title} delay={i * 100}>
          <div className="fm-step">
            <span className="fm-step-num">{i + 1}</span>
            <step.icon className="step-icon" aria-hidden="true" />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
