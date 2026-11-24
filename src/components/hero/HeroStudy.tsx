"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroStudy() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className={`hero-study${entered ? " is-entered" : ""}`}
      aria-labelledby="hero-study-title"
    >
      <div className="hero-study-field" aria-hidden="true" />
      <picture className="hero-study-haze-picture">
        <source
          media="(min-width: 768px)"
          srcSet="/images/lifestyle/hero-study-desktop.webp"
        />
        <img
          src="/images/lifestyle/hero-study-mobile.webp"
          alt=""
          className="hero-study-haze"
        />
      </picture>
      <picture className="hero-study-picture">
        <source
          media="(min-width: 768px)"
          srcSet="/images/lifestyle/hero-study-desktop.webp"
          width={2000}
          height={1250}
        />
        <img
          src="/images/lifestyle/hero-study-mobile.webp"
          width={780}
          height={1520}
          alt="Luminous Serum on limestone, with champagne silk across the foreground."
          className="hero-study-photo"
        />
      </picture>
      <div className="hero-study-copy">
        <p className="hero-study-kicker">The art of ritual</p>
        <h2 id="hero-study-title" className="hero-study-title font-display">
          <span className="hero-study-line">Quiet</span>
          <span className="hero-study-line">formulas</span>
          <span className="hero-study-title-rest">for considered skin.</span>
        </h2>
        <p className="hero-study-deck">
          Cinematic minimalism with warm sensory luxury—edited rituals for Cape
          light and unhurried mornings.
        </p>
        <div className="hero-study-actions">
          <Link href="/shop" className="btn bg-ivory text-espresso hover:bg-sand">
            Shop the collection
          </Link>
          <Link href="/about" className="hero-study-quiet">
            Our approach
          </Link>
        </div>
      </div>
    </section>
  );
}
