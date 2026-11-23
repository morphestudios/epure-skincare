import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ExhibitionGallery } from "@/components/product/ExhibitionGallery";
import { Reveal } from "@/components/Reveal";
import { formatZar } from "@/lib/format";
import type { Product } from "@/lib/types";

const VARIANTS = {
  "luminous-serum": "glass",
  "night-renewal-oil": "glass",
  "velvet-cleansing-balm": "tactile",
  "barrier-recovery-cream": "tactile",
  "gentle-enzyme-polish": "tactile",
  "mineral-soft-mist": "fluid",
  "calming-tonic": "fluid",
  "daily-spf-fluid": "sculptural",
  "eye-contour-concentrate": "precision",
} as const;

export function ProductExhibition({
  product,
  related,
  index,
}: {
  product: Product;
  related: Product[];
  index: number;
}) {
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [{ src: product.image, alt: product.imageAlt }];
  const chapter = String(index + 1).padStart(2, "0");
  const [lead, ...rest] = product.name.split(" ");
  const tail = rest.join(" ");
  const extended = tail.includes(" ");
  const variant = VARIANTS[product.slug as keyof typeof VARIANTS] ?? "glass";

  return (
    <article className="product-exhibition" data-variant={variant}>
      <header className="exhibition-open">
        <div className="container-page exhibition-mast">
          <p className="exhibition-kicker">
            <span>{chapter}</span>
            <span aria-hidden>—</span>
            <span>{product.category}</span>
          </p>
          <nav className="exhibition-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>

        <div className="container-page exhibition-stage">
          <div className="exhibition-copy">
            <h1 className={`exhibition-title font-display${extended ? " is-extended" : ""}`}>
              <span>{lead}</span>
              {tail ? <span>{tail}</span> : null}
            </h1>
            <p className="exhibition-tagline">{product.tagline}</p>
            <div className="exhibition-buy">
              <p className="exhibition-price">
                <span>{formatZar(product.priceZar)}</span>
                <span className="exhibition-size">{product.size}</span>
              </p>
              <ul className="exhibition-concerns">
                {product.concerns.map((concern) => (
                  <li key={concern}>{concern}</li>
                ))}
              </ul>
              <AddToCartButton slug={product.slug} />
            </div>
          </div>

          <div className="exhibition-visual">
            <ExhibitionGallery
              images={gallery}
              productName={product.name}
              caption="Concept studio photograph"
            />
          </div>
        </div>
      </header>

      <section id="formula" className="exhibition-formula" aria-labelledby="exhibition-formula">
        <div className="container-page exhibition-formula-grid">
          <div>
            <p className="eyebrow">01 — The formula</p>
            <h2 id="exhibition-formula" className="exhibition-chapter-title font-display">
              What the texture holds
            </h2>
          </div>
          <Reveal>
            <p className="exhibition-prose">{product.description}</p>
          </Reveal>
        </div>
        <div className="exhibition-inventory">
          <div className="container-page">
            <h3 className="exhibition-list-label">Ingredients</h3>
            <ul className="exhibition-ingredients">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="ritual" className="exhibition-ritual" aria-labelledby="exhibition-ritual">
        <div className="container-page exhibition-ritual-grid">
          <p className="exhibition-ritual-kicker">02 — The ritual</p>
          <div>
            <h2 id="exhibition-ritual" className="exhibition-ritual-title font-display">
              How it is used
            </h2>
            <Reveal delayMs={80}>
              <p className="exhibition-ritual-copy">{product.howToUse}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section
          id="collection"
          className="exhibition-collection"
          aria-labelledby="exhibition-collection"
        >
          <div className="container-page">
            <p className="eyebrow">03 — The collection</p>
            <h2 id="exhibition-collection" className="exhibition-chapter-title font-display">
              Continue through the house
            </h2>
            <ol className="exhibition-pieces">
              {related.map((item, piece) => (
                <li key={item.slug}>
                  <Reveal delayMs={piece * 70}>
                  <Link href={`/shop/${item.slug}`} className="exhibition-piece">
                    <span className="exhibition-piece-media">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 767px) 78vw, 352px"
                      />
                    </span>
                    <span className="exhibition-piece-copy">
                      <span className="eyebrow">{item.category}</span>
                      <h3 className="exhibition-piece-name font-display">{item.name}</h3>
                      <span className="exhibition-piece-line">{item.tagline}</span>
                      <span className="exhibition-piece-meta">
                        {formatZar(item.priceZar)}
                        <span>{item.size}</span>
                      </span>
                    </span>
                  </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </article>
  );
}
