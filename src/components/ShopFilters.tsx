"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES, CONCERNS } from "@/data/products";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const category = searchParams.get("category") ?? "all";
  const concern = searchParams.get("concern") ?? "all";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const query = searchParams.get("q") ?? "";

  function update(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    startTransition(() => {
      router.push(`/shop?${params.toString()}`);
    });
  }

  return (
    <form
      className={`grid gap-4 border border-line bg-surface p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-4 ${pending ? "opacity-70" : ""}`}
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

      <div className="md:col-span-2 lg:col-span-4">
        <button type="submit" className="btn btn-secondary">
          Apply search
        </button>
      </div>
    </form>
  );
}
