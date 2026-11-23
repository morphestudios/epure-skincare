import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getFeaturedProducts } from "@/data/products";
import { formatZar } from "@/lib/format";
import type { Product } from "@/lib/types";

function Plate({ product, sizes }: { product: Product; sizes: string }) {
  return (
    <div className="home-plate">
      <Image src={product.image} alt="" fill sizes={sizes} className="home-plate-img" />
    </div>
  );
}

export function HomeCollection() {
  const [feature, ...companions] = getFeaturedProducts();
  if (!feature) return null;

  return (
    <section className="home-collection section-pad" id="collection">
      <div className="container-page">
        <Reveal className="home-collection-layout">
          <div className="home-collection-intro">
            <p className="eyebrow">The collection</p>
            <h2 className="home-collection-title font-display text-espresso">
              Formulas for
              <span className="block">the daily ritual</span>
            </h2>
          </div>

          <Link href="/shop" className="home-collection-all btn btn-secondary">
            View all products
          </Link>

          <div className="home-collection-stage">
            <Link href={`/shop/${feature.slug}`} className="home-feature home-link">
              <Plate product={feature} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 56vw, 570px" />
              <div className="home-feature-copy">
                <p className="home-feature-kicker">{feature.category}</p>
                <h3 className="home-feature-name font-display">{feature.name}</h3>
                <p className="home-feature-line">{feature.tagline}</p>
                <p className="home-feature-price">
                  {formatZar(feature.priceZar)}
                  <span>{feature.size}</span>
                </p>
              </div>
            </Link>

            <div className="home-companions">
              {companions.map((product) => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="home-companion home-link">
                  <Plate product={product} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 30vw, 380px" />
                  <h3 className="home-companion-name font-display">{product.name}</h3>
                  <p className="home-companion-price">{formatZar(product.priceZar)}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
