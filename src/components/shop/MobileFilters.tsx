"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/I18nProvider";
import { FilterPanel, type PanelProps } from "./FilterPanel";

export function MobileFilters({
  activeCount,
  ...panel
}: PanelProps & { activeCount: number }) {
  const dict = useDictionary();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        {dict.listing.filters}
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label={dict.listing.filters}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl bg-background shadow-2xl lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-lg font-semibold">
                  {dict.listing.filters}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={dict.listing.closeFilters}
                  className="grid size-9 place-items-center rounded-full hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 py-5">
                <FilterPanel {...panel} />
              </div>
              <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground"
                >
                  {dict.listing.showResults}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
