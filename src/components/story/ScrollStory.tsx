"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const total = rect.height + view;
      const raw = (view - rect.top) / total;
      setProgress(Math.max(0, Math.min(1, raw)));
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
  }, [ref]);

  return progress;
}

function StoryReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`story-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Editorial section 1 — choreographed mask + parallax ritual */
export function RitualScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const mask = 18 + progress * 42;
  const shift = (progress - 0.5) * 48;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line bg-[#f3eee6]"
      aria-labelledby="ritual-heading"
    >
      <div className="container-page section-pad grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <StoryReveal>
          <div
            className="story-mask relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]"
            style={
              {
                "--mask-inset": `${Math.max(0, 28 - progress * 28)}%`,
                clipPath: `inset(${Math.max(0, 12 - progress * 12)}% ${Math.max(0, 18 - progress * 18)}% ${Math.max(0, 16 - progress * 16)}% ${Math.max(0, 10 - progress * 10)}% round 0px)`,
              } as CSSProperties
            }
          >
            <div
              className="absolute inset-[-12%] will-change-transform"
              style={{
                transform: `translate3d(0, ${shift * -0.35}px, 0) scale(${1.04 + progress * 0.04})`,
              }}
            >
              <Image
                src="/images/lifestyle/ritual.jpg"
                alt="Hands preparing a calm skincare ritual at a sunlit table"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent"
              style={{ opacity: 0.35 + progress * 0.25 }}
            />
            <div
              className="pointer-events-none absolute bottom-5 left-5 right-5 h-px bg-ivory/50"
              style={{ transform: `scaleX(${0.2 + progress * 0.8})`, transformOrigin: "left" }}
            />
          </div>
        </StoryReveal>

        <StoryReveal delayMs={90}>
          <div>
            <p className="eyebrow">Philosophy</p>
            <h2
              id="ritual-heading"
              className="mt-2 font-display text-4xl text-espresso md:text-[2.85rem]"
            >
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
              ].map((item, index) => (
                <li
                  key={item.title}
                  className="story-line"
                  style={
                    {
                      "--line-delay": `${120 + index * 70}ms`,
                      opacity: progress > 0.28 + index * 0.08 ? 1 : 0.35,
                      transform: `translateY(${progress > 0.28 + index * 0.08 ? 0 : 8}px)`,
                    } as CSSProperties
                  }
                >
                  <h3 className="font-display text-xl text-espresso">{item.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-muted">{item.copy}</p>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn btn-primary mt-8">
              Read our story
            </Link>
          </div>
        </StoryReveal>
      </div>

      {/* Decorative progress rail — cinematic cue, not content */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-espresso/40"
        style={{ width: `${mask}%` }}
        aria-hidden
      />
    </section>
  );
}

/** Editorial section 2 — pinned-feel material sequence with split mask */
export function MaterialScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const reveal = Math.max(0, Math.min(1, (progress - 0.15) / 0.55));

  return (
    <section
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
      aria-labelledby="materials-heading"
    >
      <div className="container-page">
        <div className="relative grid overflow-hidden border border-line lg:grid-cols-[1.05fr_0.95fr]">
          <StoryReveal>
            <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[24rem] lg:min-h-[32rem]">
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  clipPath: `inset(0 ${Math.max(0, 100 - reveal * 100)}% 0 0)`,
                }}
              >
                <Image
                  src="/images/textures/botanical.jpg"
                  alt="Soft botanical foliage in warm natural light"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{
                    transform: `scale(${1.08 - reveal * 0.06}) translate3d(0, ${(0.5 - progress) * 24}px, 0)`,
                  }}
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0 0 0 ${Math.min(100, reveal * 100)}%)`,
                }}
              >
                <Image
                  src="/images/textures/spa-stones.jpg"
                  alt="Smooth spa stones in soft sculptural light"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{
                    transform: `scale(${1.04 + reveal * 0.04}) translate3d(0, ${(progress - 0.5) * 30}px, 0)`,
                  }}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-ivory/70"
                style={{ left: `${reveal * 100}%`, opacity: reveal > 0.02 && reveal < 0.98 ? 1 : 0 }}
                aria-hidden
              />
            </div>
          </StoryReveal>

          <StoryReveal delayMs={80}>
            <div className="flex flex-col justify-center bg-surface px-7 py-10 sm:px-10 lg:px-12">
              <p className="eyebrow">Materials</p>
              <h2
                id="materials-heading"
                className="mt-2 font-display text-4xl text-espresso"
              >
                Warm light. Quiet glass.
              </h2>
              <p className="mt-4 max-w-md text-muted">
                From amber droppers to soft creams, every texture is chosen for how it
                feels in the hand and settles on skin—never for spectacle.
              </p>
              <div className="mt-7 space-y-3">
                {["Amber glass", "Matte ceramic", "Stone & linen"].map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.16em] text-espresso"
                    style={{
                      opacity: 0.35 + Math.min(1, Math.max(0, reveal * 1.4 - i * 0.2)) * 0.65,
                    }}
                  >
                    <span className="h-px w-8 bg-taupe" />
                    {label}
                  </div>
                ))}
              </div>
              <Link href="/shop" className="btn btn-secondary mt-8 self-start">
                Explore textures
              </Link>
            </div>
          </StoryReveal>
        </div>
      </div>
    </section>
  );
}
