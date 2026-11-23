"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = images[active] ?? images[0];
  const count = images.length;

  function step(direction: 1 | -1) {
    setActive((index) => (index + direction + count) % count);
  }

  if (!current) return null;

  return (
    <div>
      <div
        className="product-gallery-frame product-media relative aspect-[1122/1402]"
        tabIndex={count > 1 ? 0 : undefined}
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
        onTouchStart={(event) => {
          const point = event.changedTouches[0];
          touch.current = { x: point.clientX, y: point.clientY };
        }}
        onTouchEnd={(event) => {
          if (!touch.current || count < 2) return;
          const point = event.changedTouches[0];
          const dx = point.clientX - touch.current.x;
          const dy = point.clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
          step(dx < 0 ? 1 : -1);
        }}
        aria-label={count > 1 ? `${productName}, image ${active + 1} of ${count}` : undefined}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || productName}
          fill
          priority={active === 0}
          className="object-contain object-center"
          sizes="(max-width: 1024px) min(92vw, 560px), 560px"
        />
      </div>
      {count > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2" aria-label={`${productName} gallery`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={`product-media relative aspect-[1122/1402] w-full border ${
                  index === active ? "border-espresso" : "border-transparent"
                }`}
                aria-label={`View image ${index + 1} of ${count}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="140px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
