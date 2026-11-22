import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatZar } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="product-media aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={800}
            height={1000}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="mt-4 space-y-1.5">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-taupe">
            {product.category}
          </p>
          <h3 className="font-display text-2xl text-espresso transition-colors group-hover:text-taupe">
            {product.name}
          </h3>
          <p className="text-[0.95rem] text-muted">{product.tagline}</p>
          <p className="pt-1 text-[0.95rem] text-espresso">{formatZar(product.priceZar)}</p>
        </div>
      </Link>
    </article>
  );
}
