"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/EmptyState";
import { QuantitySelector } from "@/components/QuantitySelector";
import { formatZar } from "@/lib/format";

export function CartView() {
  const { lines, subtotal, hydrated, setQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        {[1, 2].map((item) => (
          <div key={item} className="skeleton h-28 w-full" />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the collection and add formulas that suit your ritual."
        actionHref="/shop"
        actionLabel="Continue shopping"
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
      <ul className="space-y-6" aria-label="Cart items">
        {lines.map((line) => (
          <li
            key={line.slug}
            className="grid gap-4 border-b border-line pb-6 sm:grid-cols-[7rem_1fr_auto]"
          >
            <Link href={`/shop/${line.slug}`} className="product-media aspect-square">
              <Image
                src={line.product.image}
                alt={line.product.imageAlt}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </Link>
            <div>
              <Link href={`/shop/${line.slug}`} className="font-display text-2xl text-espresso">
                {line.product.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{line.product.size}</p>
              <p className="mt-2 text-espresso">{formatZar(line.product.priceZar)}</p>
              <div className="mt-4">
                <QuantitySelector
                  id={`cart-qty-${line.slug}`}
                  value={line.quantity}
                  onChange={(value) => setQuantity(line.slug, value)}
                  min={1}
                />
              </div>
              <button
                type="button"
                className="btn btn-ghost mt-3 text-[0.72rem]"
                onClick={() => removeItem(line.slug)}
              >
                Remove
              </button>
            </div>
            <p className="text-right text-espresso sm:pt-1">
              {formatZar(line.product.priceZar * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="h-fit border border-line bg-surface p-6">
        <h2 className="font-display text-2xl text-espresso">Summary</h2>
        <div className="mt-6 flex items-center justify-between text-[0.95rem]">
          <span className="text-muted">Subtotal</span>
          <span className="text-espresso">{formatZar(subtotal)}</span>
        </div>
        <p className="mt-3 text-sm text-taupe">
          Shipping calculated at checkout. This is a demo storefront—no payment is taken.
        </p>
        <Link href="/checkout" className="btn btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>
        <Link href="/shop" className="btn btn-ghost mt-3 w-full justify-center">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
