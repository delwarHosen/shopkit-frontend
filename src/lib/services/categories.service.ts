import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, CategoryWithCount } from "@/types/shop";

export async function getCategories(): Promise<CategoryWithCount[]> {
  return categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categoryId === c.id).length,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}
