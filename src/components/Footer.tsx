import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-sand/35">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-espresso">ÉPURE</p>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Clinical minimalism with warm sensory luxury. Skincare formulated for
            quiet rituals and considered daily care.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-[0.95rem] text-espresso">
            <li>
              <Link href="/shop" className="hover:text-taupe">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-taupe">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-taupe">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Visit</p>
          <p className="text-[0.95rem] leading-relaxed text-muted">
            14 Buitenkant Street
            <br />
            Cape Town, 8001
            <br />
            South Africa
          </p>
          <p className="mt-4 text-[0.95rem] text-muted">hello@epure.studio</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-[0.8rem] text-taupe sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ÉPURE Skincare</p>
          <p>Priced in ZAR · Cape Town</p>
        </div>
      </div>
    </footer>
  );
}
