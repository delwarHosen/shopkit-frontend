"use client";

import { Heart } from "lucide-react";
import { clientConfig } from "@/config/client";
import { useDictionary } from "@/i18n/I18nProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/wishlistSlice";

type Props = {
  productId: string;
  variant?: "overlay" | "inline";
  className?: string;
};

export function WishlistButton({
  productId,
  variant = "overlay",
  className = "",
}: Props) {
  const dict = useDictionary();
  const dispatch = useAppDispatch();
  const active = useAppSelector(
    (s) => s.wishlist.hydrated && s.wishlist.ids.includes(productId),
  );

  if (!clientConfig.features.wishlist) return null;

  const base =
    variant === "overlay"
      ? "grid size-9 place-items-center rounded-full bg-background/90 shadow-md backdrop-blur"
      : "grid size-11 shrink-0 place-items-center rounded-full border border-border hover:bg-muted";

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? dict.wishlist.remove : dict.wishlist.add}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
      }}
      className={`${base} transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary ${className}`}
    >
      <Heart
        className={`size-5 transition-colors ${active ? "fill-rose-500 text-rose-500" : ""}`}
      />
    </button>
  );
}
