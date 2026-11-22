export type ProductCategory =
  | "Cleansers"
  | "Serums"
  | "Moisturizers"
  | "Treatments"
  | "Oils"
  | "SPF";

export type SkinConcern =
  | "Dryness"
  | "Sensitivity"
  | "Dullness"
  | "Barrier Support"
  | "Uneven Texture"
  | "Fine Lines";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceZar: number;
  size: string;
  category: ProductCategory;
  concerns: SkinConcern[];
  ingredients: string[];
  howToUse: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface CartItem {
  slug: string;
  quantity: number;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";
