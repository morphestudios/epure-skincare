import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your ÉPURE order. Portfolio concept checkout — no payments are processed.",
};

export default function CheckoutPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl md:text-6xl">
          Review & confirm
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Enter shipping details to complete your preview. Totals update as you shop;
          no payment is collected on this site.
        </p>
        <div className="mt-8 md:mt-10">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
