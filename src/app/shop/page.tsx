import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { filterAndSortProducts } from "@/data/products";
import type { SortOption } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the ÉPURE skincare collection—cleansers, serums, moisturizers, treatments, oils, and SPF priced in ZAR.",
};

type ShopSearchParams = Promise<{
  category?: string;
  concern?: string;
  sort?: string;
  q?: string;
}>;

function FiltersFallback() {
  return <div className="skeleton h-40 w-full" aria-hidden />;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "featured";
  const products = filterAndSortProducts({
    category: params.category,
    concern: params.concern,
    sort,
    query: params.q,
  });

  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Shop</p>
          <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
            The collection
          </h1>
          <p className="mt-4 text-muted">
            Filter by category or skin concern, then sort to find the right texture
            for your ritual.
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<FiltersFallback />}>
            <ShopFilters />
          </Suspense>
        </div>

        <p className="mt-8 text-sm text-taupe" aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {products.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No products match"
              description="Try clearing a filter or searching a different term."
              actionHref="/shop"
              actionLabel="Reset filters"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
