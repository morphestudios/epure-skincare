"use client";

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
      <button
        type="button"
        className={`btn min-w-[12rem] transition-colors ${
          added ? "border border-espresso bg-sand text-espresso" : "btn-primary"
        }`}
        aria-live="polite"
        onClick={() => {
          addItem(slug, quantity);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2000);
        }}
      >
        {added ? "Added to bag" : "Add to bag"}
      </button>
    </div>
  );
}
