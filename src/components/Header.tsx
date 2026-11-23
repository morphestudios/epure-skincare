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
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-line bg-ivory/95 shadow-[0_8px_24px_rgba(31,27,24,0.04)] backdrop-blur-md"
          : "border-transparent bg-ivory/80 backdrop-blur-sm"
      }`}
    >
      <div
        className={`container-page flex items-center justify-between gap-4 transition-[height] duration-300 ${
          scrolled ? "h-14" : "h-[4.25rem]"
        }`}
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display text-[1.55rem] leading-none tracking-[0.02em] text-espresso transition-[letter-spacing,opacity] duration-300 hover:tracking-[0.05em]"
        >
          ÉPURE
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[0.78rem] uppercase tracking-[0.16em] text-espresso"
              aria-current={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            onClick={closeMenu}
            className="nav-link inline-flex min-h-11 min-w-11 items-center text-[0.78rem] uppercase tracking-[0.16em] text-espresso"
            aria-label={hydrated ? `Cart, ${itemCount} items` : "Cart"}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>
              Cart{hydrated && itemCount > 0 ? ` (${itemCount})` : ""}
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-line text-espresso md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="flex w-4 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-espresso transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-espresso transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-espresso transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
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
              onClick={closeMenu}
              className="py-3 text-[0.85rem] uppercase tracking-[0.16em] text-espresso"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            onClick={closeMenu}
            className="py-3 text-[0.85rem] uppercase tracking-[0.16em] text-taupe"
          >
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
