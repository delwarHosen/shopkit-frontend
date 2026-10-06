"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useDictionary } from "@/i18n/I18nProvider";
import { LocaleLink } from "@/i18n/LocaleLink";
import type { Product } from "@/types/shop";
import { ProductCard } from "./ProductCard";

type TabKey = "new" | "best" | "sale";
type Tab = { key: TabKey; products: Product[] };

const allLinks: Record<TabKey, string> = {
  new: "/products?sort=newest",
  best: "/products?sort=popular",
  sale: "/offers",
};

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const dict = useDictionary();
  const [active, setActive] = useState<TabKey>(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label={dict.home.tabsTitle}
          className="flex gap-1 overflow-x-auto"
        >
          {tabs.map((t) => {
            const selected = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(t.key)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:text-base ${
                  selected
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="home-tab-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{dict.home.tabs[t.key]}</span>
              </button>
            );
          })}
        </div>
        <LocaleLink
          href={allLinks[active]}
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
        >
          {dict.home.viewAll}
        </LocaleLink>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4"
        >
          {current.products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center sm:hidden">
        <LocaleLink
          href={allLinks[active]}
          className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium"
        >
          {dict.home.viewAll}
        </LocaleLink>
      </div>
    </div>
  );
}
