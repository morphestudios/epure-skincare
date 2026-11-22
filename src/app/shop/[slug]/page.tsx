import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { getProductBySlug, products } from "@/data/products";
import { formatZar } from "@/lib/format";

type ProductParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: ProductParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} · ÉPURE`,
      description: product.tagline,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

function ProductFallback() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="skeleton h-4 w-40" aria-hidden />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="skeleton aspect-[4/5] w-full" aria-hidden />
          <div className="space-y-4">
            <div className="skeleton h-3 w-24" aria-hidden />
            <div className="skeleton h-12 w-3/4" aria-hidden />
            <div className="skeleton h-5 w-full" aria-hidden />
            <div className="skeleton h-8 w-40" aria-hidden />
            <div className="skeleton h-24 w-full" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: ProductParams }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [{ src: product.image, alt: product.imageAlt }];

  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (item.category === product.category ||
          item.concerns.some((concern) => product.concerns.includes(concern))),
    )
    .slice(0, 3);

  return (
    <div className="section-pad">
      <div className="container-page">
        <nav className="text-sm text-taupe" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="hover:text-espresso">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-espresso">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={gallery} productName={product.name} />

          <div>
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{product.tagline}</p>
            <p className="mt-6 text-2xl text-espresso">
              {formatZar(product.priceZar)}
              <span className="ml-3 text-base text-taupe">{product.size}</span>
            </p>
            <p className="mt-6 max-w-xl text-muted">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.concerns.map((concern) => (
                <span
                  key={concern}
                  className="border border-line px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-taupe"
                >
                  {concern}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <AddToCartButton slug={product.slug} />
            </div>

            <div className="mt-12 space-y-8 border-t border-line pt-8">
              <section>
                <h2 className="font-display text-2xl text-espresso">How to use</h2>
                <p className="mt-3 text-muted">{product.howToUse}</p>
              </section>
              <section>
                <h2 className="font-display text-2xl text-espresso">Ingredients</h2>
                <ul className="mt-3 columns-1 gap-8 text-muted sm:columns-2">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient} className="mb-1">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-espresso">You may also like</h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delayMs={index * 80}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: ProductParams }) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
