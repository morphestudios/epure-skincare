"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { QuantitySelector } from "@/components/QuantitySelector";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
      <QuantitySelector
        id={`qty-${slug}`}
        value={quantity}
        onChange={setQuantity}
      />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={`btn min-w-[12rem] transition-colors ${
            added ? "border border-espresso bg-sand text-espresso" : "btn-primary"
          }`}
          aria-live="polite"
          onClick={() => {
            addItem(slug, quantity);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2400);
          }}
        >
          {added ? "Added to bag" : "Add to bag"}
        </button>
        {added ? (
          <Link
            href="/cart"
            className="text-[0.78rem] uppercase tracking-[0.14em] text-taupe"
          >
            View bag
          </Link>
        ) : (
          <span className="invisible text-[0.78rem] uppercase tracking-[0.14em]" aria-hidden>
            View bag
          </span>
        )}
      </div>
    </div>
  );
}
