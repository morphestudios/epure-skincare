import type { Metadata } from "next";
import Link from "next/link";
import { AboutFrieze, AboutPlate } from "@/components/about/AboutMotion";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "The art of being — ÉPURE’s story of attention, ritual, and material sensibility. A fictional Cape Town skincare house.",
};

const CHAPTERS = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#ritual", label: "Ritual" },
  { href: "#sensibility", label: "Sensibility" },
  { href: "#invitation", label: "Invitation" },
] as const;

const BEATS = [
  {
    title: "Warmth",
    copy: "Water first. Then a balm that melts, so the day can leave the skin without a performance.",
  },
  {
    title: "Pressure",
    copy: "A serum pressed in with the palm. One gesture, not a stack of steps added for their own sake.",
  },
  {
    title: "Stillness",
    copy: "Moisture that settles. The mirror can wait; the morning does not need an audience.",
  },
] as const;

const MATERIALS = [
  {
    title: "Limestone",
    copy: "Porous and warm. A surface that holds light instead of shining it back.",
  },
  {
    title: "Silk",
    copy: "Champagne cloth with a quiet weight. Softness, cut to a clear edge.",
  },
  {
    title: "Light",
    copy: "A narrow warmth, closer to late afternoon than to a spotlight.",
  },
] as const;

export default function AboutPage() {
  return (
    <article className="about-story">
      <section
        id="philosophy"
        className="about-opening bg-espresso text-ivory"
        aria-labelledby="about-philosophy"
      >
        <div className="about-opening-grid container-page grid gap-12 py-14">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-sand">
                01 — Philosophy
              </p>
            </Reveal>
            <Reveal delayMs={80}>
              <h1
                id="about-philosophy"
                className="mt-5 font-display text-[clamp(3.5rem,11vw,8.4rem)] leading-[0.84] text-ivory"
              >
                The art
                <span className="block">of being</span>
              </h1>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-sand">
                Skincare, practiced as attention. ÉPURE is a fictional Cape Town
                house for short rituals and honest textures—language that stays
                with how a formula feels in the hand.
              </p>
            </Reveal>
            <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-x-6 gap-y-1">
              {CHAPTERS.map((chapter) => (
                <a key={chapter.href} href={chapter.href} className="about-chapter-link">
                  {chapter.label}
                </a>
              ))}
            </nav>
          </div>

          <figure className="about-aperture">
            <div className="about-aperture-stage">
              <div className="about-aperture-stone" aria-hidden />
                <AboutPlate
                className="about-aperture-frame"
                src="/images/lifestyle/studio-portrait.webp"
                alt="Simulated campaign still of a limestone bathroom: an unlabeled amber bottle on travertine, a brass tap, dried stems, and the edge of a round mirror. An architectural still life, not a portrait and not an ÉPURE product."
                sizes="(max-width: 1024px) 92vw, 58vw"
                position="40% 58%"
                priority
              />
            </div>
            <figcaption className="mt-4 max-w-sm text-[0.72rem] uppercase leading-relaxed tracking-[0.16em] text-sand">
              Simulated campaign still · limestone bath. The bottle is unlabeled and
              is not in the assortment.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="section-bridge" aria-hidden />

      <section id="ritual" className="about-ritual section-pad bg-ivory" aria-labelledby="about-ritual">
        <div className="container-page">
          <div className="about-ritual-head">
            <Reveal className="about-ritual-title">
              <p className="eyebrow">02 — The ritual</p>
              <h2
                id="about-ritual"
                className="about-ritual-heading mt-4 font-display text-espresso"
              >
                Care, held
                <span className="block">for a moment</span>
              </h2>
            </Reveal>
            <Reveal className="about-ritual-intro" delayMs={80}>
              <p className="text-muted">
                Not a long regimen. Three gestures, then the day continues. The
                point is the pause, not the number of bottles.
              </p>
            </Reveal>
          </div>

          <div className="about-ritual-stage">
            <div className="about-beats">
              {BEATS.map((beat, index) => (
                <Reveal key={beat.title} className="about-beat" delayMs={index * 90}>
                  <p className="about-beat-index" aria-hidden>
                    0{index + 1}
                  </p>
                  <h3 className="about-beat-title mt-2 font-display text-espresso">{beat.title}</h3>
                  <p className="mt-3 text-muted">{beat.copy}</p>
                </Reveal>
              ))}
            </div>

            <figure className="about-basin">
              <div className="about-basin-ground" aria-hidden />
              <AboutPlate
                className="about-basin-frame"
                src="/images/lifestyle/ritual-basin.webp"
                alt="Simulated editorial still of a hand under a brass tap at a limestone basin, with linen at the rim. Not an ÉPURE product and not a demonstration of a result."
                sizes="(max-width: 767px) 78vw, (max-width: 1023px) 280px, 384px"
                position="50% 42%"
              />
              <figcaption className="about-basin-caption">
                Simulated editorial still · limestone basin. Not a product, and not a result.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section
        id="sensibility"
        className="section-pad border-t border-line bg-ivory"
        aria-labelledby="about-sensibility"
      >
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">03 — Sensibility</p>
              <h2
                id="about-sensibility"
                className="mt-4 font-display text-5xl leading-[0.95] text-espresso md:text-6xl"
              >
                Surfaces the hand remembers
              </h2>
            </Reveal>
            <Reveal delayMs={80}>
              <p className="max-w-md text-muted lg:pb-2">
                Limestone, champagne silk, and warm light. They describe how the
                house wants to feel. They are not a claim about where a formula
                is made, or what it can promise.
              </p>
            </Reveal>
          </div>

          <figure className="about-study">
            <AboutFrieze>
              <div className="about-study-cluster">
                <div className="about-study-shadow" data-drift="8">
                  <AboutPlate
                    className="about-study-fill"
                    src="/images/textures/warm-shadow.webp"
                    alt=""
                    sizes="168px"
                    position="center"
                    parallax={false}
                  />
                </div>
                <div className="about-study-main" data-drift="6">
                  <AboutPlate
                    className="about-study-fill"
                    src="/images/textures/champagne-silk-stone.webp"
                    alt="Simulated editorial still of champagne silk draped across porous limestone. A material study, not an ÉPURE product."
                    sizes="(max-width: 767px) 86vw, 448px"
                    position="center"
                    parallax={false}
                  />
                </div>
                <div className="about-study-light" data-drift="-8">
                  <AboutPlate
                    className="about-study-fill"
                    src="/images/textures/water-light.webp"
                    alt=""
                    sizes="184px"
                    position="center"
                    parallax={false}
                  />
                </div>
              </div>
            </AboutFrieze>
            <figcaption className="about-study-caption">
              Simulated editorial stills · limestone, champagne silk, and warm light on water.
            </figcaption>
          </figure>

          <div className="about-material-copy">
            {MATERIALS.map((material) => (
              <Reveal key={material.title}>
                <h3 className="font-display text-3xl text-espresso">{material.title}</h3>
                <p className="mt-2 text-muted">{material.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-bridge-reverse" aria-hidden />

      <section
        id="invitation"
        className="about-close bg-espresso text-ivory"
        aria-labelledby="about-invitation"
      >
        <div className="container-page pb-14 pt-16 md:pb-16 md:pt-24">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-sand">
              04 — Invitation
            </p>
            <h2
              id="about-invitation"
              className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92] text-ivory"
            >
              The formulas are the rest of this page.
            </h2>
          </Reveal>
          <Reveal delayMs={90}>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-sand">
              Nine edited textures, priced in rand. Read them for feel and finish.
              Checkout on this site is a preview—nothing is charged.
            </p>
            <Link href="/shop" className="btn btn-ivory mt-10">
              Explore the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
