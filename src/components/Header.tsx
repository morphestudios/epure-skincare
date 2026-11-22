"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/90 backdrop-blur-md">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-[1.55rem] leading-none tracking-[0.02em] text-espresso"
        >
          ÉPURE
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[0.78rem] uppercase tracking-[0.16em] text-espresso"
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="nav-link text-[0.78rem] uppercase tracking-[0.16em] text-espresso"
            aria-label={hydrated ? `Cart, ${itemCount} items` : "Cart"}
          >
            Cart{hydrated && itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-espresso md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="flex w-4 flex-col gap-1.5">
              <span className={`h-px w-full bg-espresso transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-full bg-espresso transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-px w-full bg-espresso transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`border-t border-line bg-ivory md:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-[0.85rem] uppercase tracking-[0.16em] text-espresso"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            className="py-3 text-[0.85rem] uppercase tracking-[0.16em] text-taupe"
          >
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
