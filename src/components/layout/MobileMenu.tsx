"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Phone, User, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { clientConfig } from "@/config/client";
import { mainNav } from "@/config/nav";
import { useDictionary } from "@/i18n/I18nProvider";
import { categoryLabel, isActive, stripLocale } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import type { CategoryWithCount } from "@/types/shop";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { iconBtn } from "./styles";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const dict = useDictionary();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.mobileMenuOpen);
  const current = stripLocale(usePathname());

  // মেনু খোলা থাকলে পেছনের স্ক্রল বন্ধ, Esc দিয়ে বন্ধ
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && dispatch(closeMobileMenu());
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dispatch]);

  const rowCls = (active: boolean) =>
    `flex items-center rounded-[var(--radius)] px-3 py-3 text-base font-medium transition-colors hover:bg-muted ${
      active ? "bg-muted text-primary" : ""
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeMobileMenu())}
            aria-hidden
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={dict.header.menu}
            className="fixed inset-y-0 inset-s-0 z-50 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-background shadow-xl md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4 pt-[env(safe-area-inset-top)]">
              <Logo />
              <button
                type="button"
                className={iconBtn}
                aria-label={dict.header.closeMenu}
                onClick={() => dispatch(closeMobileMenu())}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-3" aria-label="Mobile">
              {mainNav.map((item) => (
                <LocaleLink
                  key={item.key}
                  href={item.href}
                  className={rowCls(isActive(current, item.href))}
                >
                  {dict.nav[item.key]}
                </LocaleLink>
              ))}

              <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {dict.nav.categories}
              </p>
              {categories.map((c) => (
                <LocaleLink
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className={rowCls(isActive(current, `/categories/${c.slug}`))}
                >
                  {categoryLabel(dict, c)}
                </LocaleLink>
              ))}

              <div className="mt-4 border-t border-border pt-3">
                {clientConfig.features.wishlist && (
                  <LocaleLink
                    href="/wishlist"
                    className={`${rowCls(false)} gap-3`}
                  >
                    <Heart className="size-5" /> {dict.nav.wishlist}
                  </LocaleLink>
                )}
                <LocaleLink
                  href="/account"
                  className={`${rowCls(false)} gap-3`}
                >
                  <User className="size-5" /> {dict.nav.account}
                </LocaleLink>
              </div>
            </nav>

            <div className="flex items-center justify-between border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <a
                href={`tel:${clientConfig.contact.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                dir="ltr"
              >
                <Phone className="size-4" /> {clientConfig.contact.phone}
              </a>
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
