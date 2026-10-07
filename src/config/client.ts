export const clientConfig = {
  name: { bn: "ডেমো স্টোর", en: "Demo Store" },
  tagline: {
    bn: "আপনার পছন্দের সবকিছু এক জায়গায়",
    en: "Everything you love, in one place",
  },
  announcement: {
    bn: "সারা দেশে ক্যাশ অন ডেলিভারি • ৳৩,০০০-এর ওপরে অর্ডারে ফ্রি ডেলিভারি",
    en: "Cash on delivery nationwide • Free delivery on orders over ৳3,000",
  },
  contact: {
    phone: "+8801700000000",
    email: "hello@demostore.com",
    address: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
    hours: {
      bn: "প্রতিদিন সকাল ১০টা থেকে রাত ৯টা",
      en: "Daily, 10 AM to 9 PM",
    },
  },
  // ফাঁকা স্ট্রিং রাখলে আইকন দেখাবে না
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "",
    whatsapp: "https://wa.me/8801700000000",
  },
  theme: {
    primary: "#0f766e",
    primaryForeground: "#ffffff",
    radius: "0.75rem",
  },
  currency: { code: "BDT", symbol: "৳" },
  // ডেলিভারি চার্জ: ঢাকা জেলার ভেতরে/বাইরে। freeOver এর বেশি কেনাকাটায় ফ্রি (০ দিলে বন্ধ)
  shipping: { insideDhaka: 60, outsideDhaka: 120, freeOver: 3000 },
  // বিকাশ/নগদ পার্সোনাল নম্বর (ক্রেতা এখানে সেন্ড মানি করবে)
  payments: { bkashNumber: "01700000000", nagadNumber: "01700000000" },
  // একটাই ভাষা রাখলে (যেমন ["bn"]) ভাষা বাটন নিজে থেকে লুকিয়ে যাবে
  languages: ["bn", "en"],
  features: {
    bkash: true,
    nagad: true,
    cod: true,
    card: true,
    courier: ["steadfast", "pathao"],
    reviews: true,
    wishlist: true,
    aiDescription: false,
  },
} as const;

export type ClientConfig = typeof clientConfig;
