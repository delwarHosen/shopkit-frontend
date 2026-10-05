import { reviews } from "@/data/reviews";
import type { Review } from "@/types/shop";

export async function getReviewsByProduct(
  productId: string,
): Promise<Review[]> {
  return reviews.filter((r) => r.productId === productId);
}
