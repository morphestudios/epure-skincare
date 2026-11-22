import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Demo checkout for ÉPURE Skincare. Form validation only—no payments are processed.",
};

export default function CheckoutPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
          Complete your demo order
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Shipping details are validated in-browser. This portfolio demo never
          collects payment card numbers or charges a card.
        </p>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
