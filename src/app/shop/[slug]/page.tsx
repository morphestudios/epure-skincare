import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductExhibition } from "@/components/product/ProductExhibition";
import { getProductBySlug, products } from "@/data/products";

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

  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (item.category === product.category ||
          item.concerns.some((concern) => product.concerns.includes(concern))),
    )
    .slice(0, 3);

  return (
    <ProductExhibition
      product={product}
      related={related}
      index={products.findIndex((item) => item.slug === product.slug)}
    />
  );
}

export default function ProductPage({ params }: { params: ProductParams }) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
