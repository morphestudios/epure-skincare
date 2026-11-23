"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ExhibitionGallery({
  images,
  productName,
  caption,
}: {
  images: ProductImage[];
  productName: string;
  caption?: string;
}) {
  const [active, setActive] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  function step(direction: 1 | -1) {
    setActive((index) => (index + direction + count) % count);
  }

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo || count < 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    if (reduce.matches || !fine.matches || !wide.matches) return;

    const frame = photo.parentElement;
    if (!frame) return;

    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      photo.style.transform = `translate3d(${(nx * 8).toFixed(2)}px, ${(ny * 6).toFixed(2)}px, 0)`;
    };
    const onLeave = () => {
      photo.style.transform = "";
    };
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="exhibition-gallery">
      <div
        className="exhibition-frame"
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
        <div ref={photoRef} className="exhibition-photo">
          {images.map((image, index) => (
            <span
              key={image.src}
              className={`exhibition-layer${index === active ? " is-on" : ""}`}
              aria-hidden={index !== active}
            >
              <Image
                src={image.src}
                alt={index === active ? image.alt || productName : ""}
                fill
                priority={index === 0}
                className="object-contain object-center"
                sizes="(max-width: 1099px) min(92vw, 560px), 560px"
              />
            </span>
          ))}
        </div>
      </div>
      {count > 1 || caption ? (
        <div className="exhibition-foot">
          {count > 1 ? (
            <ul className="exhibition-thumbs" aria-label={`${productName} gallery`}>
              {images.map((image, index) => (
                <li key={image.src}>
                  <button
                    type="button"
                    className="exhibition-thumb"
                    aria-label={`View image ${index + 1} of ${count}`}
                    aria-pressed={index === active}
                    onClick={() => setActive(index)}
                  >
                    <span className="exhibition-thumb-index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="exhibition-thumb-frame">
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        className="object-contain object-center"
                        sizes="96px"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          {caption ? <p className="exhibition-caption">{caption}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
