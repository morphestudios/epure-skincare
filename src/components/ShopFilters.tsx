"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CONCERNS } from "@/data/products";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

function countActiveFilters(category: string, concern: string, query: string) {
  let count = 0;
  if (category !== "all") count += 1;
  if (concern !== "all") count += 1;
  if (query.trim()) count += 1;
  return count;
}

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

export function ShopFilters({ productCount }: { productCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const drawerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const category = searchParams.get("category") ?? "all";
  const concern = searchParams.get("concern") ?? "all";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const query = searchParams.get("q") ?? "";
  const activeCount = countActiveFilters(category, concern, query);

  const [draftCategory, setDraftCategory] = useState(category);
  const [draftConcern, setDraftConcern] = useState(concern);
  const [draftQuery, setDraftQuery] = useState(query);

  const update = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([key, value]) => {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/shop?${qs}` : "/shop");
      });
    },
    [router, searchParams, startTransition],
  );

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  function openDrawer() {
    setDraftCategory(category);
    setDraftConcern(concern);
    setDraftQuery(query);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const triggerNode = triggerRef.current;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel ? getFocusable(panel) : [];
    const first = focusables[0];
    window.setTimeout(() => first?.focus(), 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const items = getFocusable(panelRef.current);
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      const restore = previouslyFocused.current ?? triggerNode;
      restore?.focus();
    };
  }, [open, closeDrawer]);

  function applyDraft() {
    update({
      category: draftCategory,
      concern: draftConcern,
      q: draftQuery.trim(),
      sort,
    });
    closeDrawer();
  }

  function clearDraft() {
    setDraftCategory("all");
    setDraftConcern("all");
    setDraftQuery("");
    update({ category: "all", concern: "all", q: "", sort });
    closeDrawer();
  }

  function onDrawerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeDrawer();
    }
  }

  return (
    <div className={pending ? "opacity-70" : undefined}>
      {/* Desktop / large screens — unchanged panel */}
      <form
        className="hidden gap-4 border border-line bg-surface p-5 lg:grid lg:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          update({ q: String(form.get("q") ?? "") });
        }}
        aria-label="Filter products"
      >
        <div>
          <label htmlFor="shop-q" className="eyebrow mb-2 block">
            Search
          </label>
          <input
            id="shop-q"
            name="q"
            type="search"
            defaultValue={query}
            className="input"
            placeholder="Serum, balm, mist…"
          />
        </div>

        <div>
          <label htmlFor="shop-category" className="eyebrow mb-2 block">
            Category
          </label>
          <select
            id="shop-category"
            className="select"
            value={category}
            onChange={(event) => update({ category: event.target.value })}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="shop-concern" className="eyebrow mb-2 block">
            Skin concern
          </label>
          <select
            id="shop-concern"
            className="select"
            value={concern}
            onChange={(event) => update({ concern: event.target.value })}
          >
            <option value="all">All concerns</option>
            {CONCERNS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="shop-sort" className="eyebrow mb-2 block">
            Sort
          </label>
          <select
            id="shop-sort"
            className="select"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end lg:col-span-4">
          <button type="submit" className="btn btn-secondary">
            Apply search
          </button>
        </div>
      </form>

      {/* Mobile / tablet compact toolbar */}
      <div className="flex flex-wrap items-center gap-2 border border-line bg-surface p-2.5 sm:gap-3 sm:p-3 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          className="btn btn-secondary min-h-11 px-3 text-[0.72rem]"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={openDrawer}
        >
          Filter{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        <div className="min-w-0 flex-1">
          <label htmlFor="shop-sort-mobile" className="sr-only">
            Sort
          </label>
          <select
            id="shop-sort-mobile"
            className="select min-h-11 py-2 text-sm"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <p className="shrink-0 px-1 text-sm text-taupe" aria-live="polite">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            aria-label="Close filters"
            onClick={closeDrawer}
          />
          <div
            ref={panelRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={onDrawerKeyDown}
            className="absolute inset-x-0 bottom-0 max-h-[min(88vh,640px)] overflow-y-auto border-t border-line bg-ivory px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_40px_rgba(31,27,24,0.12)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="font-display text-2xl text-espresso">
                  Filters
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Refine by search, category, or skin concern.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost min-h-11 px-2 text-[0.72rem]"
                onClick={closeDrawer}
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="drawer-q" className="eyebrow mb-2 block">
                  Search
                </label>
                <input
                  id="drawer-q"
                  type="search"
                  className="input"
                  value={draftQuery}
                  onChange={(event) => setDraftQuery(event.target.value)}
                  placeholder="Serum, balm, mist…"
                />
              </div>

              <div>
                <label htmlFor="drawer-category" className="eyebrow mb-2 block">
                  Category
                </label>
                <select
                  id="drawer-category"
                  className="select"
                  value={draftCategory}
                  onChange={(event) => setDraftCategory(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="drawer-concern" className="eyebrow mb-2 block">
                  Skin concern
                </label>
                <select
                  id="drawer-concern"
                  className="select"
                  value={draftConcern}
                  onChange={(event) => setDraftConcern(event.target.value)}
                >
                  <option value="all">All concerns</option>
                  {CONCERNS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn btn-primary w-full" onClick={applyDraft}>
                Apply
              </button>
              <button type="button" className="btn btn-secondary w-full" onClick={clearDraft}>
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
