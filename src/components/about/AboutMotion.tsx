"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useOpenOnce(ref: RefObject<HTMLElement | null>) {
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
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open, ref]);

  return open;
}

/** Architectural crop of the bathroom still. The image moves; the caption does not. */
export function AboutPlate({
  src,
  alt,
  sizes,
  position = "center 62%",
  className = "",
  priority = false,
  parallax = true,
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
  className?: string;
  priority?: boolean;
  parallax?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const open = useOpenOnce(frameRef);

  useEffect(() => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media || !parallax) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 767px)");
    if (reduce.matches || phone.matches) return;

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const rect = frame.getBoundingClientRect();
      const view = window.innerHeight || 1;
      if (rect.bottom < -40 || rect.top > view + 40) return;
      const raw = (view * 0.45 - (rect.top + rect.height * 0.5)) / view;
      const shift = Math.max(-1, Math.min(1, raw)) * 16;
      media.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax]);

  return (
    <div
      ref={frameRef}
      className={`editorial-mask overflow-hidden ${className} ${open ? "is-open" : ""}`}
    >
      <div ref={mediaRef} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
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

/** CSS material study. Planes settle once; labels stay still. */
export function AboutFrieze({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 767px)");
    if (reduce.matches || phone.matches) return;
    const planes = [...root.querySelectorAll<HTMLElement>("[data-drift]")];

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const rect = root.getBoundingClientRect();
      const view = window.innerHeight || 1;
      if (rect.bottom < -40 || rect.top > view + 40) return;
      const raw = Math.max(-1, Math.min(1, (view * 0.5 - (rect.top + rect.height * 0.45)) / view));
      planes.forEach((plane) => {
        const range = Number(plane.dataset.drift) || 0;
        plane.style.transform = `translate3d(0, ${(raw * range).toFixed(2)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      planes.forEach((plane) => {
        plane.style.transform = "";
      });
    };
  }, []);

  return (
    <div ref={ref} className="about-frieze">
      {children}
    </div>
  );
}
