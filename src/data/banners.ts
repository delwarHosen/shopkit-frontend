import type { Banner } from "@/types/shop";

export const banners: Banner[] = [
  {
    id: "b1",
    title: "নতুন কালেকশন এসেছে",
    subtitle: "এই মৌসুমের সেরা পাঞ্জাবি ও কুর্তি, এখন ছাড়ে",
    cta: "কালেকশন দেখুন",
    href: "/products",
    image: "https://picsum.photos/seed/banner-1/1600/700",
  },
  {
    id: "b2",
    title: "ইলেকট্রনিক্সে ২৫% পর্যন্ত ছাড়",
    subtitle: "ইয়ারবাডস, চার্জার ও স্মার্ট ব্যান্ড",
    cta: "অফার দেখুন",
    href: "/categories/electronics",
    image: "https://picsum.photos/seed/banner-2/1600/700",
  },
  {
    id: "b3",
    title: "সারা দেশে ক্যাশ অন ডেলিভারি",
    subtitle: "পণ্য হাতে পেয়ে টাকা দিন",
    cta: "কেনাকাটা শুরু করুন",
    href: "/products",
    image: "https://picsum.photos/seed/banner-3/1600/700",
  },
];
