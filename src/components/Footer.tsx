import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-espresso text-ivory">
      <div className="container-page pt-20 pb-12">
        <p className="font-display text-5xl leading-none md:text-6xl">ÉPURE</p>
        <p className="mt-4 max-w-md text-sand">The art of ritual, edited for quiet daily care.</p>
        <div className="mt-12 h-px bg-ivory/15" />
        <div className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-sand">The house</p>
            <p className="max-w-xs text-[0.95rem] leading-relaxed text-sand">
              Clinical minimalism with warm sensory luxury. A fictional Cape Town
              skincare house, priced in ZAR.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-sand">Explore</p>
            <ul className="space-y-2 text-[0.95rem]">
              <li>
                <Link href="/shop" className="hover:text-sand">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sand">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-sand">
                  Bag
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-sand">Visit</p>
            <p className="text-[0.95rem] leading-relaxed text-sand">
              14 Buitenkant Street
              <br />
              Cape Town, 8001
              <br />
              South Africa
            </p>
            <p className="mt-4 text-[0.95rem]">
              <a className="text-ivory hover:text-sand" href="mailto:hello@epure.studio">
                hello@epure.studio
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-page flex flex-col gap-2 py-5 text-[0.8rem] text-sand sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ÉPURE Skincare</p>
          <p>Priced in ZAR · Checkout is a preview</p>
        </div>
      </div>
    </footer>
  );
}
