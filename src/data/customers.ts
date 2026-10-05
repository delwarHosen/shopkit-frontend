import type { Customer } from "@/types/shop";

const names = [
  ["রহিম উদ্দিন", "Dhaka"],
  ["ফারজানা আক্তার", "Chattogram"],
  ["তানভীর হাসান", "Dhaka"],
  ["সুমাইয়া ইসলাম", "Sylhet"],
  ["মাহফুজ আলম", "Chattogram"],
  ["নুসরাত জাহান", "Rajshahi"],
  ["আরিফ হোসেন", "Khulna"],
  ["জান্নাতুল ফেরদৌস", "Dhaka"],
  ["শাহরিয়ার কবির", "Cumilla"],
  ["তাসনিম মাহমুদ", "Dhaka"],
  ["ইমরান খান", "Gazipur"],
  ["রুবিনা ইয়াসমিন", "Barishal"],
] as const;

export const customers: Customer[] = names.map(([name, district], i) => ({
  id: `u-${i + 1}`,
  name,
  phone: `01${[7, 8, 9, 3, 5][i % 5]}${String(10000000 + i * 1234567).slice(0, 8)}`,
  email: `customer${i + 1}@example.com`,
  district,
  joinedAt: new Date(
    new Date("2026-10-01T10:00:00+06:00").getTime() -
      (20 + i * 17) * 86_400_000,
  ).toISOString(),
  status: i === 10 ? "blocked" : "active",
}));
