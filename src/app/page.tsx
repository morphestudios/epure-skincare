import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <section className="relative min-h-[min(88vh,820px)] overflow-hidden bg-espresso">
        <Image
          src="/images/lifestyle/hero.jpg"
          alt="Soft spa light during a calm facial treatment ritual"
          fill
          priority
          className="animate-image-reveal object-cover object-[center_28%] opacity-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/50 to-espresso/25" />
        <div className="container-page relative flex min-h-[min(88vh,820px)] flex-col justify-end pb-14 pt-24 md:pb-20">
          <p className="animate-fade-up font-display text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-8xl">
            ÉPURE
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-xl font-display text-3xl font-normal leading-tight text-ivory/95 sm:text-4xl">
            Quiet formulas for considered skin.
          </h1>
          <p className="animate-fade-up-delay-2 mt-3 max-w-md text-[1.05rem] leading-relaxed text-ivory/80">
            Clinical minimalism with warm sensory luxury—edited rituals for Cape light
            and unhurried mornings.
          </p>
          <div className="animate-fade-up-delay-2 mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn bg-ivory text-espresso hover:bg-sand">
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="btn border border-ivory/80 bg-espresso/25 text-ivory hover:bg-ivory/15"
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
              <h2 className="mt-2 font-display text-4xl text-espresso md:text-[2.75rem]">
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

      <section className="border-y border-line bg-sand/25">
        <div className="container-page section-pad grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
              <Image
                src="/images/lifestyle/ritual.jpg"
                alt="Hands preparing a calm skincare ritual at a sunlit table"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div>
              <p className="eyebrow">Philosophy</p>
              <h2 className="mt-2 font-display text-4xl text-espresso md:text-[2.75rem]">
                Fewer steps. Better texture.
              </h2>
              <p className="mt-4 max-w-md text-muted">
                ÉPURE edits the routine down to what feels essential: soft cleansing,
                barrier-minded moisture, and finishes that respect skin’s natural
                cadence. No noise—just sensorial clarity.
              </p>
              <ul className="mt-8 space-y-5 border-t border-line pt-6">
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
                ].map((item) => (
                  <li key={item.title}>
                    <h3 className="font-display text-xl text-espresso">{item.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-muted">{item.copy}</p>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn btn-primary mt-8">
                Read our story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-stretch overflow-hidden border border-line lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[22rem] lg:min-h-full lg:aspect-auto">
              <Image
                src="/images/textures/botanical.jpg"
                alt="Soft botanical foliage in warm natural light"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={90}>
            <div className="flex flex-col justify-center bg-surface px-7 py-10 sm:px-10 lg:px-12">
              <p className="eyebrow">Materials</p>
              <h2 className="mt-2 font-display text-4xl text-espresso">
                Warm light. Quiet glass.
              </h2>
              <p className="mt-4 max-w-md text-muted">
                From amber droppers to soft creams, every texture is chosen for how it
                feels in the hand and settles on skin—never for spectacle.
              </p>
              <Link href="/shop" className="btn btn-secondary mt-7 self-start">
                Explore textures
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
