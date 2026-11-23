"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatZar } from "@/lib/format";
import type { Product } from "@/lib/types";

/** One exhibition piece above the catalogue. Pointer shift stays inside the frame. */
export function ShopSpotlight({ product }: { product: Product }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 768px)");
    if (reduce.matches || !fine.matches || !wide.matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      media.style.transform = `translate3d(${(nx * 14).toFixed(2)}px, ${(ny * 10).toFixed(2)}px, 0)`;
    };
    const onLeave = () => {
      media.style.transform = "";
    };
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return (
    <section className="shop-spotlight" aria-labelledby="shop-spotlight-title">
      <div className="container-page">
        <Link href={`/shop/${product.slug}`} className="shop-spotlight-grid">
          <div>
            <p className="shop-spotlight-kicker">In the room</p>
            <h2 id="shop-spotlight-title" className="shop-spotlight-title font-display">
              {product.name}
            </h2>
            <p className="shop-spotlight-line">{product.tagline}</p>
            <p className="shop-spotlight-price">
              {formatZar(product.priceZar)}
              <span>{product.size}</span>
            </p>
            <span className="shop-spotlight-link">View this formula</span>
          </div>
          <div ref={frameRef} className="shop-spotlight-frame">
            <div ref={mediaRef} className="shop-spot-media">
              <Image
                src={product.image}
                alt=""
                fill
              sizes="(max-width: 767px) 70vw, 360px"
              priority
              className="object-contain"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
