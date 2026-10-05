import type { Category } from "@/types/shop";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

export const categories: Category[] = [
  {
    id: "c-panjabi",
    slug: "panjabi",
    name: "পাঞ্জাবি",
    description: "উৎসব ও দৈনন্দিন পরিধানের পাঞ্জাবি",
    image: img("cat-panjabi"),
  },
  {
    id: "c-kurti",
    slug: "kurti",
    name: "মেয়েদের কুর্তি",
    description: "আরামদায়ক ও স্টাইলিশ কুর্তি কালেকশন",
    image: img("cat-kurti"),
  },
  {
    id: "c-shoes",
    slug: "shoes",
    name: "জুতা",
    description: "ফরমাল থেকে ক্যাজুয়াল, সব ধরনের জুতা",
    image: img("cat-shoes"),
  },
  {
    id: "c-watch",
    slug: "watches",
    name: "ঘড়ি ও অ্যাক্সেসরিজ",
    description: "ঘড়ি, সানগ্লাস ও আরও অনেক কিছু",
    image: img("cat-watch"),
  },
  {
    id: "c-electronics",
    slug: "electronics",
    name: "ইলেকট্রনিক্স",
    description: "ইয়ারবাডস, চার্জার ও স্মার্ট গ্যাজেট",
    image: img("cat-electronics"),
  },
  {
    id: "c-bags",
    slug: "bags",
    name: "ব্যাগ",
    description: "ব্যাকপ্যাক, হ্যান্ডব্যাগ ও ট্রাভেল ব্যাগ",
    image: img("cat-bags"),
  },
];
