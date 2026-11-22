import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <section className="relative min-h-[min(92vh,920px)] overflow-hidden bg-espresso">
        <Image
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80"
          alt="Soft natural light across linen and skincare textures"
          fill
          priority
          className="animate-image-reveal object-cover object-center opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/45 to-espresso/20" />
        <div className="container-page relative flex min-h-[min(92vh,920px)] flex-col justify-end pb-16 pt-28 md:pb-24">
          <p className="animate-fade-up font-display text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-8xl">
            ÉPURE
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl font-display text-3xl font-normal leading-tight text-ivory/95 sm:text-4xl">
            Quiet formulas for considered skin.
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-md text-[1.05rem] text-ivory/80">
            Clinical minimalism with warm sensory luxury—crafted as a portfolio demo
            of elevated e-commerce design.
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

      <section className="section-pad">
        <div className="container-page">
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
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-12">
            <Link href="/shop" className="btn btn-secondary">
              View all products
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-sand/25">
        <div className="container-page section-pad grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80"
              alt="Hands preparing a calm skincare ritual at a sunlit table"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
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
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-3">
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
              copy: "A fictional house inspired by soft Atlantic light and measured luxury.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-line pt-6">
              <h3 className="font-display text-2xl text-espresso">{item.title}</h3>
              <p className="mt-3 text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
