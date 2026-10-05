import type { Review } from "@/types/shop";
import { products } from "./products";

const authors = [
  "রহিম উদ্দিন",
  "ফারজানা আক্তার",
  "তানভীর হাসান",
  "সুমাইয়া ইসলাম",
  "মাহফুজ আলম",
  "নুসরাত জাহান",
];
const comments: [number, string][] = [
  [5, "দারুণ মান, ছবির মতোই পেয়েছি। দ্রুত ডেলিভারি পেয়েছি।"],
  [5, "দামের তুলনায় অনেক ভালো। আবার কিনব।"],
  [4, "মোটামুটি ভালো, সাইজ একটু ছোট মনে হলো।"],
  [4, "প্যাকেজিং সুন্দর ছিল, পণ্যও ভালো।"],
  [5, "বন্ধুকেও সাজেস্ট করেছি, সবাই পছন্দ করেছে।"],
  [3, "ঠিকঠাক, তবে ডেলিভারিতে একটু দেরি হয়েছে।"],
];

// প্রতি পণ্যের জন্য ৪টা করে রিভিউ (ডিটারমিনিস্টিক)
export const reviews: Review[] = products.flatMap((p, pi) =>
  Array.from({ length: 4 }, (_, i) => {
    const [rating, comment] = comments[(pi + i) % comments.length];
    return {
      id: `r-${p.id}-${i}`,
      productId: p.id,
      author: authors[(pi * 2 + i) % authors.length],
      rating,
      comment,
      verified: (pi + i) % 3 !== 0,
      createdAt: new Date(
        new Date("2026-10-01T10:00:00+06:00").getTime() -
          (pi * 3 + i * 5 + 2) * 86_400_000,
      ).toISOString(),
    };
  }),
);
