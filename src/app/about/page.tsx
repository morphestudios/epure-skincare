import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ÉPURE—a fictional Cape Town skincare house focused on clinical minimalism and warm sensory luxury.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="mt-3 font-display text-5xl text-espresso md:text-6xl">
              A quieter kind of luxury
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              ÉPURE is a fictional skincare house imagined for this portfolio demo.
              The brand language borrows from clinical clarity and the warmth of
              Cape light—never loud, never overclaimed.
            </p>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1596755389378-c31d21fd24b0?auto=format&fit=crop&w=1400&q=80"
              alt="Soft mist bottle illustrating ÉPURE’s minimal product aesthetic"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
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
              title: "Responsible fiction",
              copy: "This site is a design and engineering demo. It does not invent clinical studies, certifications, or endorsements.",
            },
          ].map((item) => (
            <article key={item.title}>
              <h2 className="font-display text-3xl text-espresso">{item.title}</h2>
              <p className="mt-4 text-muted">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-4xl text-espresso">Studio notes</h2>
          <p className="mt-5 text-muted">
            Product stories focus on feel, finish, and how a formula fits into a day.
            Copy avoids medical promises. Pricing is shown in ZAR for a South African
            retail context. Cart data stays in your browser; checkout is labeled as a
            demo and never asks for card details.
          </p>
          <Link href="/shop" className="btn btn-primary mt-8">
            Explore the shop
          </Link>
        </div>
      </section>
    </>
  );
}
