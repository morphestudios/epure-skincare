import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ÉPURE—a Cape Town skincare house focused on clinical minimalism and warm sensory luxury.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div>
              <p className="eyebrow">About</p>
              <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
                A quieter kind of luxury
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                ÉPURE is a Cape Town skincare house shaped by clinical clarity and the
                warmth of Atlantic light—never loud, never overclaimed. Every formula
                is written for how it feels in the hand and settles on skin.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src="/images/lifestyle/self-care.jpg"
                alt="Soft cream ritual in warm bathroom light"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-sand/20">
        <div className="container-page section-pad grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Material honesty",
              copy: "Textures that feel true to their purpose—balms that melt, fluids that sheer, oils that settle.",
            },
            {
              title: "Edited rituals",
              copy: "Fewer products, clearer roles. The assortment is designed so a routine can stay short and sensory.",
            },
            {
              title: "Measured language",
              copy: "We speak about feel, finish, and ritual—not invented studies, certifications, or clinical guarantees.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delayMs={index * 90}>
              <article>
                <h2 className="font-display text-3xl text-espresso">{item.title}</h2>
                <p className="mt-4 text-muted">{item.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/lifestyle/treatment.jpg"
                alt="Esthetician applying a gentle facial treatment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="max-w-xl">
              <p className="eyebrow">Studio notes</p>
              <h2 className="mt-3 font-display text-4xl text-espresso">
                Care without noise
              </h2>
              <p className="mt-5 text-muted">
                Product stories focus on feel, finish, and how a formula fits into a
                day. Pricing is shown in ZAR for a South African retail context. Cart
                data stays in your browser; checkout never asks for card details.
              </p>
              <Link href="/shop" className="btn btn-primary mt-8">
                Explore the shop
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
