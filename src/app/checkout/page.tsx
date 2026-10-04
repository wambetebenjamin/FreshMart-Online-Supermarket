import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your FreshMart order — M-Pesa or pay on delivery, same-day slots across Nairobi.",
};

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="fm-container">
        <h1 style={{ fontSize: 28 }}>Checkout</h1>
        <p style={{ color: "var(--fm-muted)", marginTop: 0 }}>
          Order by 10am for same-day delivery. We deliver everywhere within Nairobi.
        </p>
        <CheckoutForm />
      </div>
    </section>
  );
}
