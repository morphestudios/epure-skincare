import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroImmersive } from "@/components/hero/HeroImmersive";
import {
  MaterialScrollStory,
  RitualScrollStory,
} from "@/components/story/ScrollStory";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <HeroImmersive />

      <section className="section-pad" id="collection">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">The collection</p>
              <h2 className="heading-reveal mt-2 font-display text-4xl text-espresso md:text-[2.75rem]">
                Formulas for the daily ritual
              </h2>
              <p className="mt-3 text-muted">
                Nine carefully edited products spanning cleanse, treat, moisturize, and
                protect—priced in South African Rand.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Reveal key={product.slug} delayMs={index * 70}>
                <ProductCard product={product} priority={index < 2} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Link href="/shop" className="btn btn-secondary">
              View all products
            </Link>
          </Reveal>
        </div>
      </section>

      <RitualScrollStory />
      <MaterialScrollStory />
    </>
  );
}
