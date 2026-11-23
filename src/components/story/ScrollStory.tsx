"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const CAMPAIGN = {
  width: 1122,
  height: 1402,
} as const;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useMaskOpen(ref: RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || open || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, open]);

  return open;
}

/** Moves only the image. Copy stays put, and phones skip the shift. */
function useImageDrift(
  sectionRef: RefObject<HTMLElement | null>,
  mediaRef: RefObject<HTMLElement | null>,
  range = 22,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(max-width: 767px)");
    if (reduce.matches || coarse.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight || 1;
      if (rect.bottom < -80 || rect.top > view + 80) return;
      const raw = (view * 0.5 - (rect.top + rect.height * 0.5)) / view;
      const shift = Math.max(-1, Math.min(1, raw)) * range;
      media.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef, mediaRef, range]);
}

function CampaignFrame({
  src,
  alt,
  sizes,
  priority = false,
  className = "relative aspect-[4/5]",
  position = "center",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const open = useMaskOpen(frameRef);
  useImageDrift(frameRef, mediaRef);

  return (
    <div
      ref={frameRef}
      className={`editorial-mask overflow-hidden ${open ? "is-open" : ""} ${className}`}
    >
      <div ref={mediaRef} className="absolute -inset-[8%] will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}

function MaterialName({ children }: { children: ReactNode }) {
  return (
    <p className="border-t border-espresso/15 py-4 font-display text-3xl text-espresso">{children}</p>
  );
}

/** Homepage ritual — a narrow still beside a large line, then three notes. */
export function RitualScrollStory() {
  return (
    <section className="home-ritual bg-espresso text-ivory" aria-labelledby="ritual-heading">
      <div className="container-page">
        <div className="home-ritual-stage">
          <figure className="home-ritual-figure">
            <CampaignFrame
              src="/images/lifestyle/ritual-hands.webp"
              alt="Simulated campaign still: a hand holds a champagne dropper of golden serum above an open palm, with champagne satin in warm light. Not a photograph of an ÉPURE product."
              sizes="(max-width: 767px) 72vw, 340px"
              position="center 28%"
              className="home-ritual-frame"
            />
            <figcaption className="home-ritual-caption">
              Simulated campaign still · {CAMPAIGN.width}×{CAMPAIGN.height}. The dropper is
              not in the assortment.
            </figcaption>
          </figure>
          <div className="home-ritual-copy">
            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-sand">Philosophy</p>
            <h2 id="ritual-heading" className="home-ritual-title font-display">
              Fewer steps.
              <span className="block">Better texture.</span>
            </h2>
            <p className="home-ritual-deck">
              ÉPURE edits the routine down to what feels essential: soft cleansing,
              barrier-minded moisture, and finishes that respect skin’s natural cadence.
              No noise—just sensorial clarity.
            </p>
          </div>
        </div>
        <ul className="home-ritual-notes">
          <li>
            <h3 className="font-display">Sensorial textures</h3>
            <p>Balms that melt, serums that press in, creams with a quiet matte glow.</p>
          </li>
          <li>
            <h3 className="font-display">Edited assortment</h3>
            <p>A focused lineup so choosing feels calm—not like scrolling a catalogue.</p>
          </li>
          <li>
            <h3 className="font-display">Cape Town rooted</h3>
            <p>A house inspired by soft Atlantic light and measured luxury.</p>
          </li>
        </ul>
        <Link href="/about" className="btn btn-ivory mt-10">
          Read our story
        </Link>
      </div>
    </section>
  );
}

/** Materials — a wide plate and a typographic index, not a side-by-side list. */
export function MaterialScrollStory() {
  return (
    <section className="home-materials section-pad" aria-labelledby="materials-heading">
      <div className="container-page">
        <p className="eyebrow">Materials</p>
        <div className="home-materials-stage">
          <h2 id="materials-heading" className="home-materials-title font-display text-espresso">
            Warm light.
            <span className="block">Quiet surface.</span>
          </h2>
          <figure className="home-materials-figure">
            <CampaignFrame
              src="/images/textures/limestone-silk.webp"
              alt="Simulated campaign still of porous limestone and draped champagne silk, used as a material study."
              sizes="(max-width: 767px) 88vw, 520px"
              position="50% 42%"
              className="home-materials-frame"
            />
            <figcaption className="mt-3 text-[0.72rem] uppercase tracking-[0.16em] text-taupe">
              Simulated campaign still
            </figcaption>
          </figure>
        </div>
        <p className="home-materials-deck text-muted">
          Limestone and champagne silk are the surfaces this house returns to. Texture
          is chosen for how it feels in the hand—never for spectacle.
        </p>
        <div className="home-materials-index">
          <MaterialName>Limestone</MaterialName>
          <MaterialName>Champagne silk</MaterialName>
          <MaterialName>Warm light</MaterialName>
        </div>
        <Link href="/shop" className="btn btn-secondary mt-8">
          Explore the collection
        </Link>
      </div>
    </section>
  );
}
