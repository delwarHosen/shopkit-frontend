"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { clientConfig } from "@/config/client";
import { mainNav } from "@/config/nav";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { categoryLabel, isActive, stripLocale } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import {
  closeMobileMenu,
  closeSearch,
  toggleMobileMenu,
  toggleSearch,
} from "@/store/slices/uiSlice";
import type { CategoryWithCount } from "@/types/shop";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { containerCls, iconBtn } from "./styles";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ categories }: { categories: CategoryWithCount[] }) {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const current = stripLocale(pathname);

  const cartCount = useAppSelector(selectCartCount);
  const cartHydrated = useAppSelector((s) => s.cart.hydrated);
  const wishCount = useAppSelector(selectWishlistCount);
  const wishHydrated = useAppSelector((s) => s.wishlist.hydrated);
  const searchOpen = useAppSelector((s) => s.ui.searchOpen);

  // পেজ বদলালে মেনু ও সার্চ বন্ধ
  useEffect(() => {
    dispatch(closeMobileMenu());
    dispatch(closeSearch());
  }, [pathname, dispatch]);

  const linkCls = (active: boolean) =>
    `rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
      active ? "text-primary" : "text-foreground"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className={`${containerCls} flex h-16 items-center gap-2`}>
          <button
            type="button"
            className={`${iconBtn} md:hidden`}
            aria-label={dict.header.menu}
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <Menu className="size-5" />
          </button>

          <Logo />

          {/* ডেস্কটপ নেভিগেশন */}
          <nav className="ms-4 hidden items-center md:flex" aria-label="Main">
            {mainNav.map((item) => (
              <div key={item.key} className="flex items-center">
                <LocaleLink
                  href={item.href}
                  className={linkCls(isActive(current, item.href))}
                  aria-current={
                    isActive(current, item.href) ? "page" : undefined
                  }
                >
                  {dict.nav[item.key]}
                </LocaleLink>

                {/* "সব পণ্য" এর পরে ক্যাটাগরি ড্রপডাউন */}
                {item.key === "shop" && (
                  <div className="group relative">
                    <button
                      type="button"
                      className={`${linkCls(isActive(current, "/categories"))} inline-flex items-center gap-1`}
                      aria-haspopup="true"
                    >
                      {dict.nav.categories}
                      <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                    </button>
                    <div className="invisible absolute start-0 top-full z-50 w-72 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="rounded-(--radius) border border-border bg-background p-2 shadow-lg">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <LocaleLink
                              href={`/categories/${c.slug}`}
                              className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                            >
                              <span>{categoryLabel(dict, c)}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatNumber(c.productCount, locale)}{" "}
                                {dict.header.products}
                              </span>
                            </LocaleLink>
                          </li>
                        ))}
                        <li className="mt-1 border-t border-border pt-1">
                          <LocaleLink
                            href="/categories"
                            className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                          >
                            {dict.header.allCategories}
                          </LocaleLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* বড় স্ক্রিনে সার্চ বার হেডারেই */}
          <SearchBar className="mx-4 hidden max-w-sm flex-1 lg:block" />

          <div className="ms-auto flex items-center gap-0.5">
            <button
              type="button"
              className={`${iconBtn} lg:hidden`}
              aria-label={dict.search.open}
              aria-expanded={searchOpen}
              onClick={() => dispatch(toggleSearch())}
            >
              <Search className="size-5" />
            </button>

            <LanguageSwitcher />
            <ThemeToggle className="hidden md:inline-flex" />

            {clientConfig.features.wishlist && (
              <LocaleLink
                href="/wishlist"
                className={`${iconBtn} hidden md:inline-flex`}
                aria-label={dict.nav.wishlist}
              >
                <Heart className="size-5" />
                {wishHydrated && wishCount > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold leading-5 text-white">
                    {formatNumber(wishCount, locale)}
                  </span>
                )}
              </LocaleLink>
            )}

            <LocaleLink
              href="/account"
              className={`${iconBtn} hidden md:inline-flex`}
              aria-label={dict.nav.account}
            >
              <User className="size-5" />
            </LocaleLink>

            <LocaleLink
              href="/cart"
              className={`${iconBtn} hidden md:inline-flex`}
              aria-label={dict.nav.cart}
            >
              <ShoppingBag className="size-5" />
              {cartHydrated && cartCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
                  {formatNumber(cartCount, locale)}
                </span>
              )}
            </LocaleLink>
          </div>
        </div>

        {/* মোবাইল/ট্যাবলেটে সার্চ বার (বাটনে চাপলে নামে) */}
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="border-t border-border lg:hidden"
            >
              <div className={`${containerCls} py-3`}>
                <SearchBar
                  autoFocus
                  onNavigate={() => dispatch(closeSearch())}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu categories={categories} />
    </>
  );
}
