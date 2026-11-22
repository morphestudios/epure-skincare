import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
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
  return (
    <>
      <div className="skeleton h-14 w-full lg:hidden" aria-hidden />
      <div className="skeleton hidden h-40 w-full lg:block" aria-hidden />
    </>
  );
}

function ResultsFallback() {
  return (
    <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-y-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-3" aria-hidden>
          <div className="skeleton aspect-[4/5] w-full" />
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

async function ShopResults({ searchParams }: { searchParams: ShopSearchParams }) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "featured";
  const products = filterAndSortProducts({
    category: params.category,
    concern: params.concern,
    sort,
    query: params.q,
  });

  return (
    <>
      <div className="mt-5 sm:mt-8 md:mt-10">
        <Suspense fallback={<FiltersFallback />}>
          <ShopFilters productCount={products.length} />
        </Suspense>
      </div>

      <p className="mt-6 hidden text-sm text-taupe lg:block" aria-live="polite">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 lg:mt-8">
          <EmptyState
            title="No products match"
            description="Try clearing a filter or searching a different term."
            actionHref="/shop"
            actionLabel="Reset filters"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-y-12">
          {products.map((product, index) => (
            <Reveal key={product.slug} delayMs={Math.min(index, 5) * 70}>
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Shop</p>
          <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl md:mt-3 md:text-6xl">
            The collection
          </h1>
          <p className="mt-3 hidden text-muted sm:block md:mt-4">
            Filter by category or skin concern, then sort to find the right texture
            for your ritual.
          </p>
        </div>

        <Suspense fallback={<ResultsFallback />}>
          <ShopResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
