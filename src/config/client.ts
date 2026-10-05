export const clientConfig = {
  name: "ডেমো স্টোর",
  tagline: "আপনার পছন্দের সবকিছু এক জায়গায়",
  theme: {
    primary: "#0f766e",
    primaryForeground: "#ffffff",
    radius: "0.75rem",
  },
  currency: { code: "BDT", symbol: "৳" },
  languages: ["bn", "en"],
  features: {
    bkash: true,
    nagad: true,
    cod: true,
    courier: ["steadfast", "pathao"],
    reviews: true,
    wishlist: true,
    aiDescription: false,
  },
} as const;

export type ClientConfig = typeof clientConfig;
