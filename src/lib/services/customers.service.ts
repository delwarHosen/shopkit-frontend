import { customers } from "@/data/customers";
import { orders } from "@/data/orders";
import type {
  CustomerFilters,
  CustomerWithStats,
  Paginated,
} from "@/types/shop";

function withStats(): CustomerWithStats[] {
  return customers.map((c) => {
    const own = orders.filter((o) => o.customerId === c.id);
    const valid = own.filter(
      (o) => o.status !== "cancelled" && o.status !== "returned",
    );
    const last = [...own].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )[0];
    return {
      ...c,
      totalOrders: own.length,
      totalSpent: valid.reduce((n, o) => n + o.total, 0),
      lastOrderAt: last?.createdAt,
    };
  });
}

export async function getCustomers(
  filters: CustomerFilters = {},
): Promise<Paginated<CustomerWithStats>> {
  const { q, page = 1, pageSize = 10 } = filters;
  let list = withStats().sort((a, b) => b.totalSpent - a.totalSpent);
  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.includes(term),
    );
  }
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getCustomerById(
  id: string,
): Promise<CustomerWithStats | null> {
  return withStats().find((c) => c.id === id) ?? null;
}
