import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your ÉPURE Skincare bag. Cart persists in your browser.",
};

export default function CartPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
          Your selection
        </h1>
        <div className="mt-10">
          <CartView />
        </div>
      </div>
    </div>
  );
}
