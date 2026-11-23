import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatZar } from "@/lib/format";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="block focus-visible:outline-offset-4">
        <div className="product-media aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={418}
            height={418}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-contain object-center animate-image-reveal"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
          />
        </div>
        <div className="mt-4 space-y-1.5">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-taupe">
            {product.category}
          </p>
          <h3 className="font-display text-[1.65rem] leading-tight text-espresso transition-colors duration-500 group-hover:text-taupe sm:text-2xl">
            {product.name}
          </h3>
          <p className="text-[0.95rem] leading-relaxed text-muted">{product.tagline}</p>
          <p className="pt-1 text-[0.95rem] tracking-wide text-espresso transition-colors duration-500 group-hover:text-taupe">
            {formatZar(product.priceZar)}
          </p>
          <span className="product-rule mt-3 block" aria-hidden />
        </div>
      </Link>
    </article>
  );
}
