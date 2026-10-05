import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type {
  FilterMeta,
  Paginated,
  Product,
  ProductFilters,
} from "@/types/shop";

const DEFAULT_PAGE_SIZE = 12;

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Paginated<Product>> {
  const {
    category,
    q,
    minPrice,
    maxPrice,
    inStock,
    onSale,
    sort = "newest",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;

  let list = [...products];

  if (category) {
    const cat = categories.find((c) => c.slug === category);
    list = cat ? list.filter((p) => p.categoryId === cat.id) : [];
  }
  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    list = list.filter((p) =>
      [p.name, p.brand, ...p.tags].some((s) => s.toLowerCase().includes(term)),
    );
  }
  if (minPrice != null) list = list.filter((p) => p.price >= minPrice);
  if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice);
  if (inStock) list = list.filter((p) => p.stock > 0);
  if (onSale)
    list = list.filter((p) => p.comparePrice && p.comparePrice > p.price);

  const sorters: Record<string, (a: Product, b: Product) => number> = {
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    popular: (a, b) => b.sold - a.sold,
    rating: (a, b) => b.rating - a.rating,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  list.sort(sorters[sort] ?? sorters.newest);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: list.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return products.filter((p) => ids.includes(p.id));
}

// generateStaticParams এর জন্য
export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit);
}

export async function getSearchSuggestions(
  q: string,
  limit = 6,
): Promise<Product[]> {
  const term = q.trim().toLowerCase();
  if (term.length < 1) return [];
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term),
    )
    .slice(0, limit);
}

// ফিল্টার সাইডবারের জন্য
export async function getFilterMeta(): Promise<FilterMeta> {
  const prices = products.map((p) => p.price);
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    brands: [...new Set(products.map((p) => p.brand))],
  };
}
