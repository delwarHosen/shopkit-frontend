// key গুলো ডিকশনারির nav.* এর সাথে মেলে
export const mainNav = [
  { key: "home", href: "/" },
  { key: "shop", href: "/products" },
  { key: "offers", href: "/offers" },
  { key: "track", href: "/track-order" },
] as const;

export type NavKey = (typeof mainNav)[number]["key"];