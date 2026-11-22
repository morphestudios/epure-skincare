import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <section className="relative min-h-[min(92vh,920px)] overflow-hidden bg-espresso">
        <Image
          src="/images/lifestyle/hero.jpg"
          alt="Soft spa light during a calm facial treatment ritual"
          fill
          priority
          className="animate-image-reveal object-cover object-[center_30%] opacity-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/50 to-espresso/25" />
        <div className="container-page relative flex min-h-[min(92vh,920px)] flex-col justify-end pb-16 pt-28 md:pb-24">
          <p className="animate-fade-up font-display text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-8xl">
            ÉPURE
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl font-display text-3xl font-normal leading-tight text-ivory/95 sm:text-4xl">
            Quiet formulas for considered skin.
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-md text-[1.05rem] leading-relaxed text-ivory/80">
            Clinical minimalism with warm sensory luxury—edited rituals for Cape light
            and unhurried mornings.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn bg-ivory text-espresso hover:bg-sand">
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="btn border border-ivory/50 bg-transparent text-ivory hover:bg-ivory/10"
            >
              Our approach
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad" id="collection">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">The collection</p>
              <h2 className="mt-3 font-display text-4xl text-espresso md:text-5xl">
                Formulas for the daily ritual
              </h2>
              <p className="mt-4 text-muted">
                Nine carefully edited products spanning cleanse, treat, moisturize, and
                protect—priced in South African Rand.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Reveal key={product.slug} delayMs={index * 80}>
                <ProductCard product={product} priority={index < 2} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <Link href="/shop" className="btn btn-secondary">
              View all products
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-sand/25">
        <div className="container-page section-pad grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/lifestyle/ritual.jpg"
                alt="Hands preparing a calm skincare ritual at a sunlit table"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <div>
              <p className="eyebrow">Philosophy</p>
              <h2 className="mt-3 font-display text-4xl text-espresso md:text-5xl">
                Fewer steps. Better texture.
              </h2>
              <p className="mt-5 max-w-md text-muted">
                ÉPURE edits the routine down to what feels essential: soft cleansing,
                barrier-minded moisture, and finishes that respect skin’s natural
                cadence. No noise—just sensorial clarity.
              </p>
              <Link href="/about" className="btn btn-primary mt-8">
                Read our story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad overflow-hidden">
        <div className="container-page grid items-stretch gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="relative min-h-[22rem] overflow-hidden lg:min-h-full">
              <Image
                src="/images/textures/botanical.jpg"
                alt="Soft botanical foliage in warm natural light"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="flex flex-col justify-center bg-surface px-8 py-12 sm:px-12 lg:px-14">
              <p className="eyebrow">Materials</p>
              <h2 className="mt-3 font-display text-4xl text-espresso">
                Warm light. Quiet glass.
              </h2>
              <p className="mt-5 max-w-md text-muted">
                From amber droppers to soft creams, every texture is chosen for how it
                feels in the hand and settles on skin—never for spectacle.
              </p>
              <Link href="/shop" className="btn btn-secondary mt-8 self-start">
                Explore textures
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-page grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Sensorial textures",
              copy: "Balms that melt, serums that press in, creams with a quiet matte glow.",
            },
            {
              title: "Edited assortment",
              copy: "A focused lineup so choosing feels calm—not like scrolling a catalogue.",
            },
            {
              title: "Cape Town rooted",
              copy: "A house inspired by soft Atlantic light and measured luxury.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delayMs={index * 90}>
              <div className="border-t border-line pt-6">
                <h3 className="font-display text-2xl text-espresso">{item.title}</h3>
                <p className="mt-3 text-muted">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
