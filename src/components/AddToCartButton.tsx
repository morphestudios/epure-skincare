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
        className="btn btn-primary min-w-[12rem]"
        onClick={() => {
          addItem(slug, quantity);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
