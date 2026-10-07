"use client";

import { useDictionary } from "@/i18n/I18nProvider";
import type { OrderStatus } from "@/types/shop";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  processing: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  shipped: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  returned: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const dict = useDictionary();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {dict.orderStatus[status]}
    </span>
  );
}
