import type { Product, ProductCategory, SkinConcern, SortOption } from "@/lib/types";

export const CATEGORIES: ProductCategory[] = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Treatments",
  "Oils",
  "SPF",
];

export const CONCERNS: SkinConcern[] = [
  "Dryness",
  "Sensitivity",
  "Dullness",
  "Barrier Support",
  "Uneven Texture",
  "Fine Lines",
];

export const products: Product[] = [
  {
    slug: "luminous-serum",
    name: "Luminous Serum",
    tagline: "A lightweight daily concentrate with a soft satin finish.",
    description:
      "Formulated for morning and evening rituals, Luminous Serum layers easily under moisturizer. Niacinamide and fermented rice filtrate give the texture a quiet luminosity without fragrance overload. Designed for skin that feels flat by midday and needs a polished, even-looking finish.",
    priceZar: 895,
    size: "30 ml",
    category: "Serums",
    concerns: ["Dullness", "Uneven Texture"],
    ingredients: [
      "Aqua",
      "Niacinamide",
      "Saccharomyces Ferment Filtrate",
      "Glycerin",
      "Sodium Hyaluronate",
      "Panthenol",
      "Allantoin",
      "Xanthan Gum",
    ],
    howToUse:
      "After cleansing, dispense two pumps onto damp skin. Press gently over face and neck, then follow with moisturizer.",
    image:
      "https://images.unsplash.com/photo-1620916561256-420163b90d18?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Amber dropper bottle of Luminous Serum on warm stone",
    featured: true,
  },
  {
    slug: "velvet-cleansing-balm",
    name: "Velvet Cleansing Balm",
    tagline: "A melting balm that lifts makeup and the day with ease.",
    description:
      "Velvet Cleansing Balm opens as a cushioned balm and emulsifies into a soft milk with water. Squalane and jojoba esters help dissolve SPF and long-wear makeup while leaving skin comfortable—never squeaky. A calm first step for evenings when skin feels coated.",
    priceZar: 620,
    size: "100 ml",
    category: "Cleansers",
    concerns: ["Dryness", "Sensitivity"],
    ingredients: [
      "Caprylic/Capric Triglyceride",
      "Squalane",
      "Jojoba Esters",
      "Polyglyceryl-3 Diisostearate",
      "Helianthus Annuus Seed Oil",
      "Tocopherol",
      "Bisabolol",
    ],
    howToUse:
      "Massage a pearl-sized amount onto dry skin. Add water to emulsify, then rinse thoroughly. Follow with a second cleanse if preferred.",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Creamy cleansing balm jar with soft natural light",
    featured: true,
  },
  {
    slug: "barrier-recovery-cream",
    name: "Barrier Recovery Cream",
    tagline: "A dense yet breathable cream for replenished comfort.",
    description:
      "Barrier Recovery Cream is built around ceramides, cholesterol, and fatty acids in a sensorial, non-greasy texture. It settles into skin with a soft matte glow—ideal after travel, air-conditioning, or any stretch when the barrier feels thin and reactive.",
    priceZar: 980,
    size: "50 ml",
    category: "Moisturizers",
    concerns: ["Barrier Support", "Dryness", "Sensitivity"],
    ingredients: [
      "Aqua",
      "Ceramide NP",
      "Ceramide AP",
      "Cholesterol",
      "Shea Butter",
      "Glycerin",
      "Squalane",
      "Centella Asiatica Extract",
      "Carbomer",
    ],
    howToUse:
      "Apply a pea-sized amount morning and night after serum. Press into cheeks and forehead until absorbed.",
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "White jar of Barrier Recovery Cream beside linen",
    featured: true,
  },
  {
    slug: "mineral-soft-mist",
    name: "Mineral Soft Mist",
    tagline: "A fine mineral mist to refresh and set the ritual.",
    description:
      "Mineral Soft Mist delivers a whisper-fine veil of thermal mineral water with glycerin for a momentarily refreshed feel. Use between layers, after makeup, or mid-afternoon when skin needs a cool reset without disrupting texture.",
    priceZar: 485,
    size: "100 ml",
    category: "Treatments",
    concerns: ["Sensitivity", "Dullness"],
    ingredients: [
      "Aqua",
      "Glycerin",
      "Sodium Chloride",
      "Magnesium Sulfate",
      "Potassium Sulfate",
      "Phenoxyethanol",
    ],
    howToUse:
      "Hold 20 cm from the face and mist two to three times. Allow to settle, or blot lightly before the next step.",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd24b0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Frosted mist bottle with water droplets",
  },
  {
    slug: "night-renewal-oil",
    name: "Night Renewal Oil",
    tagline: "A golden facial oil for evening replenishment.",
    description:
      "Night Renewal Oil blends rosehip, meadowfoam, and bakuchiol in a dry-touch finish that sinks in within minutes. Intended as the last step of an evening ritual when skin feels depleted and ready for overnight care—without heavy residue on pillowcases.",
    priceZar: 1120,
    size: "30 ml",
    category: "Oils",
    concerns: ["Fine Lines", "Dryness", "Dullness"],
    ingredients: [
      "Rosa Canina Seed Oil",
      "Meadowfoam Seed Oil",
      "Squalane",
      "Bakuchiol",
      "Tocopherol",
      "Lavandula Angustifolia Oil",
    ],
    howToUse:
      "Warm three drops between palms and press over face and neck as the final evening step. Can be mixed into cream.",
    image:
      "https://images.unsplash.com/photo-1608248543807-ec263c9f3f14?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Golden facial oil bottle with dropper on dark wood",
    featured: true,
  },
  {
    slug: "gentle-enzyme-polish",
    name: "Gentle Enzyme Polish",
    tagline: "A weekly polish with papaya enzyme and fine rice powder.",
    description:
      "Gentle Enzyme Polish combines papain with micronized rice for a soft physical-and-enzymatic polish. Use once or twice weekly when texture feels rough around the T-zone. Rinses clean to leave skin smoother to the touch, ready for serum.",
    priceZar: 540,
    size: "75 ml",
    category: "Treatments",
    concerns: ["Uneven Texture", "Dullness"],
    ingredients: [
      "Aqua",
      "Oryza Sativa Powder",
      "Papain",
      "Glycerin",
      "Kaolin",
      "Aloe Barbadensis Leaf Juice",
      "Citric Acid",
    ],
    howToUse:
      "On damp skin, massage in circular motions for 45 seconds. Rinse with lukewarm water. Avoid the eye area.",
    image:
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Neutral tube of Gentle Enzyme Polish on ceramic",
  },
  {
    slug: "eye-contour-concentrate",
    name: "Eye Contour Concentrate",
    tagline: "A cool gel-cream for the delicate eye area.",
    description:
      "Eye Contour Concentrate is a featherweight gel-cream with caffeine and peptides for a refreshed look around the orbital area. The applicator tip stays cool; the finish is barely there. Pair with moisturizer if the under-eye feels particularly dry.",
    priceZar: 750,
    size: "15 ml",
    category: "Treatments",
    concerns: ["Fine Lines", "Dullness"],
    ingredients: [
      "Aqua",
      "Caffeine",
      "Palmitoyl Tripeptide-5",
      "Glycerin",
      "Sodium Hyaluronate",
      "Niacinamide",
      "Carbomer",
    ],
    howToUse:
      "Pat a rice-grain amount around the orbital bone morning and night. Do not pull or tug the skin.",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Compact eye concentrate bottle on marble surface",
  },
  {
    slug: "daily-spf-fluid",
    name: "Daily SPF Fluid",
    tagline: "A sheer mineral fluid for everyday outdoor moments.",
    description:
      "Daily SPF Fluid is a lightweight mineral sunscreen with zinc oxide in a barely-tinted base that settles into most skin tones without a chalky cast. Built for city days and soft outdoor light—finish with mist if you prefer a dewier look.",
    priceZar: 680,
    size: "40 ml",
    category: "SPF",
    concerns: ["Barrier Support", "Uneven Texture"],
    ingredients: [
      "Aqua",
      "Zinc Oxide",
      "Caprylic/Capric Triglyceride",
      "Glycerin",
      "Silica",
      "Iron Oxides",
      "Tocopherol",
    ],
    howToUse:
      "As the last daytime skincare step, apply two finger-lengths to face and neck. Reapply as needed when outdoors.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Minimalist bottle of Daily SPF Fluid in soft daylight",
  },
  {
    slug: "calming-tonic",
    name: "Calming Tonic",
    tagline: "An alcohol-free tonic to prepare skin for the next step.",
    description:
      "Calming Tonic is an alcohol-free, lightly hydrating liquid with panthenol and oat extract. Sweep on after cleansing to remove the last traces of balm and leave skin quietly settled before serum. No sting, no tight finish.",
    priceZar: 510,
    size: "150 ml",
    category: "Cleansers",
    concerns: ["Sensitivity", "Barrier Support"],
    ingredients: [
      "Aqua",
      "Panthenol",
      "Avena Sativa Kernel Extract",
      "Glycerin",
      "Allantoin",
      "Sodium PCA",
      "Citric Acid",
    ],
    howToUse:
      "Saturate a cotton pad or pour into palms and press over face after cleansing. Do not rinse.",
    image:
      "https://images.unsplash.com/photo-1571781926291-c77dafcfcbaf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Clear bottle of Calming Tonic with soft botanical backdrop",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function filterAndSortProducts(options: {
  category?: string;
  concern?: string;
  sort?: SortOption;
  query?: string;
}): Product[] {
  const { category, concern, sort = "featured", query } = options;

  let result = [...products];

  if (category && category !== "all") {
    result = result.filter((product) => product.category === category);
  }

  if (concern && concern !== "all") {
    result = result.filter((product) =>
      product.concerns.includes(concern as SkinConcern),
    );
  }

  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q),
    );
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.priceZar - b.priceZar);
      break;
    case "price-desc":
      result.sort((a, b) => b.priceZar - a.priceZar);
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      break;
  }

  return result;
}
