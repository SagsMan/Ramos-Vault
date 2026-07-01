export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  enabled: boolean;
  order: number;
  productCount?: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  status: "available" | "sold_out";
  featured: boolean;
  enabled: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  currency: string;
  avatar?: string;
  verified: boolean;
  status: "active" | "banned" | "suspended";
  referralCode: string;
  loyaltyPoints: number;
  loyaltyLevel: "bronze" | "silver" | "gold" | "platinum";
  createdAt: string;
  lastLogin: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "refund_requested";
  credentials?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "purchase" | "refund" | "cashback" | "referral";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  enabled: boolean;
  order: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  replies: TicketReply[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  username: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success";
  enabled: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  enabled: boolean;
  expiresAt: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  categoryStats: { name: string; orders: number; revenue: number }[];
  recentOrders: Order[];
}

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  currencySymbol: string;
  exchangeRate: number;
  whatsappLink: string;
  telegramLink: string;
  twitterLink: string;
  instagramLink: string;
  supportEmail: string;
  referralBonus: number;
  cashbackRate: number;
  autoCancelHours: number;
}
