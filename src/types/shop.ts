export type ID = string;

/* ---------- Catalog ---------- */
export type Category = {
  id: ID;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type CategoryWithCount = Category & { productCount: number };

export type ProductOption = { name: string; values: string[] };

export type Product = {
  id: ID;
  slug: string;
  name: string;
  brand: string;
  description: string;
  highlights: string[];
  price: number;
  comparePrice?: number;
  images: string[];
  categoryId: ID;
  tags: string[];
  options: ProductOption[]; // যেমন সাইজ, রঙ
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
};

export type Review = {
  id: ID;
  productId: ID;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
};

export type Banner = {
  id: ID;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
};

/* ---------- Listing ---------- */
export type ProductSort =
  | "newest"
  | "popular"
  | "rating"
  | "price-asc"
  | "price-desc";

export type ProductFilters = {
  category?: string; // category slug
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FilterMeta = {
  minPrice: number;
  maxPrice: number;
  brands: string[];
};

/* ---------- Orders ---------- */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "bkash" | "nagad" | "cod" | "card";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type CourierName = "steadfast" | "pathao" | "redx";

export type Address = {
  line: string;
  thana: string;
  district: string;
  division: string;
};

export type OrderItem = {
  productId: ID;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
};

export type OrderEvent = { status: OrderStatus; at: string; note?: string };

export type Order = {
  id: ID;
  orderNumber: string;
  customerId: ID;
  customerName: string;
  phone: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  courier?: CourierName;
  trackingId?: string;
  email?: string;
  note?: string;
  trxId?: string;
  couponCode?: string;
  createdAt: string;
  timeline: OrderEvent[];
};

export type OrderFilters = {
  status?: OrderStatus | "all";
  q?: string;
  page?: number;
  pageSize?: number;
};

/* ---------- Customers ---------- */
export type Customer = {
  id: ID;
  name: string;
  phone: string;
  email: string;
  district: string;
  joinedAt: string;
  status: "active" | "blocked";
};

export type CustomerWithStats = Customer & {
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
};

export type CustomerFilters = { q?: string; page?: number; pageSize?: number };

/* ---------- Dashboard ---------- */
export type StatCard = { value: number; change: number }; // change = গত সময়ের তুলনায় %

export type DashboardStats = {
  revenue: StatCard;
  orders: StatCard;
  customers: StatCard;
  avgOrderValue: StatCard;
  pendingOrders: number;
  lowStockProducts: number;
};

export type SalesPoint = { date: string; revenue: number; orders: number };
export type StatusBreakdown = { status: OrderStatus; count: number };
