"use client";

import { motion } from "framer-motion";
import {
  LayoutGrid,
  Home,
  Search,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { isActive, stripLocale } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/slices/cartSlice";
import { toggleSearch } from "@/store/slices/uiSlice";

type Item = {
  key: "home" | "categories" | "cart" | "account";
  href: string;
  icon: LucideIcon;
};

const left: Item[] = [
  { key: "home", href: "/", icon: Home },
  { key: "categories", href: "/categories", icon: LayoutGrid },
];
const right: Item[] = [
  { key: "cart", href: "/cart", icon: ShoppingBag },
  { key: "account", href: "/account", icon: User },
];

// শুধু মোবাইলে দেখায় (md এর নিচে)
export function BottomNav() {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const current = stripLocale(usePathname());
  const cartCount = useAppSelector(selectCartCount);
  const cartHydrated = useAppSelector((s) => s.cart.hydrated);
  const searchOpen = useAppSelector((s) => s.ui.searchOpen);

  const cellCls =
    "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors";

  const renderLink = ({ key, href, icon: Icon }: Item) => {
    const active = isActive(current, href);
    return (
      <LocaleLink
        key={key}
        href={href}
        className={`${cellCls} ${active ? "text-primary" : "text-muted-foreground"}`}
        aria-current={active ? "page" : undefined}
      >
        {active && (
          <motion.span
            layoutId="bottom-nav-pill"
            className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        )}
        <span className="relative">
          <Icon className="size-5" />
          {key === "cart" && cartHydrated && cartCount > 0 && (
            <span className="absolute -inset-e-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
              {formatNumber(cartCount, locale)}
            </span>
          )}
        </span>
        {dict.bottomNav[key]}
      </LocaleLink>
    );
  };

  return (
    <nav
      aria-label="Bottom"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="flex h-16">
        {left.map(renderLink)}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            dispatch(toggleSearch());
          }}
          aria-expanded={searchOpen}
          className={`${cellCls} ${searchOpen ? "text-primary" : "text-muted-foreground"}`}
        >
          <Search className="size-5" />
          {dict.bottomNav.search}
        </button>
        {right.map(renderLink)}
      </div>
    </nav>
  );
}
