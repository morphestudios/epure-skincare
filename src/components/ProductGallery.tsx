"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div>
      <div className="product-media relative aspect-[4/5]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || productName}
          fill
          priority
          className="object-cover animate-image-reveal"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2" aria-label={`${productName} gallery`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={`product-media relative aspect-square w-full border ${
                  index === active ? "border-espresso" : "border-transparent"
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
