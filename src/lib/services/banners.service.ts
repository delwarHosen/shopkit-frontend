import { banners } from "@/data/banners";
import type { Banner } from "@/types/shop";

export async function getBanners(): Promise<Banner[]> {
  return banners;
}
