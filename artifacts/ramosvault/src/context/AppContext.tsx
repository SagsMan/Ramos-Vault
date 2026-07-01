import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Order, Transaction, Notification, AppSettings, Announcement, Banner, Category, Product, SupportTicket } from "../types";
import { MOCK_ORDERS, MOCK_TRANSACTIONS, DEFAULT_SETTINGS, MOCK_ANNOUNCEMENTS, MOCK_BANNERS, CATEGORIES, PRODUCTS } from "../data/mockData";
import { useAuth } from "./AuthContext";

interface AppContextType {
  // Data
  categories: Category[];
  products: Product[];
  orders: Order[];
  transactions: Transaction[];
  notifications: Notification[];
  announcements: Announcement[];
  banners: Banner[];
  settings: AppSettings;
  tickets: SupportTicket[];

  // Actions
  placeOrder: (productId: string, quantity: number) => { success: boolean; error?: string };
  addFunds: (amount: number, method: string) => { success: boolean };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  createTicket: (subject: string, message: string, priority: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  requestRefill: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  applyCoupon: (code: string, amount: number) => { valid: boolean; discount: number; error?: string };

  // Admin actions
  updateCategory: (id: string, data: Partial<Category>) => void;
  addCategory: (data: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  addProduct: (data: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (data: Partial<AppSettings>) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  addBanner: (data: Omit<Banner, "id">) => void;
  deleteBanner: (id: string) => void;
  addAnnouncement: (data: Omit<Announcement, "id">) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  allOrders: Order[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>(() => {
    const s = localStorage.getItem("rv_categories");
    return s ? JSON.parse(s) : CATEGORIES;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const s = localStorage.getItem("rv_products");
    return s ? JSON.parse(s) : PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const s = localStorage.getItem("rv_orders");
    return s ? JSON.parse(s) : MOCK_ORDERS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const s = localStorage.getItem("rv_transactions");
    return s ? JSON.parse(s) : MOCK_TRANSACTIONS;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const s = localStorage.getItem("rv_notifications");
    return s ? JSON.parse(s) : [];
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const s = localStorage.getItem("rv_announcements");
    return s ? JSON.parse(s) : MOCK_ANNOUNCEMENTS;
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    const s = localStorage.getItem("rv_banners");
    return s ? JSON.parse(s) : MOCK_BANNERS;
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = localStorage.getItem("rv_settings");
    return s ? JSON.parse(s) : DEFAULT_SETTINGS;
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const s = localStorage.getItem("rv_tickets");
    return s ? JSON.parse(s) : [];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("rv_categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("rv_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("rv_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("rv_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("rv_notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("rv_announcements", JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem("rv_banners", JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem("rv_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("rv_tickets", JSON.stringify(tickets)); }, [tickets]);

  const userOrders = orders.filter(o => o.userId === user?.id);
  const userTransactions = transactions.filter(t => t.userId === user?.id);
  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string, type: Notification["type"] = "info") => {
    if (!user) return;
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const placeOrder = (productId: string, quantity: number) => {
    if (!user) return { success: false, error: "Please login first" };
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, error: "Product not found" };
    if (product.quantity < quantity) return { success: false, error: "Insufficient stock" };
    const total = product.price * quantity;
    if (user.balance < total) return { success: false, error: `Insufficient balance. You need ${settings.currencySymbol}${total.toLocaleString()}` };

    const cat = categories.find(c => c.id === product.categoryId);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      productId,
      productName: product.name,
      categoryName: cat?.name || "Unknown",
      quantity,
      totalPrice: total,
      status: "completed",
      credentials: `account${Math.random().toString(36).slice(2)}@mail.com:SecurePass${Math.floor(Math.random() * 9999)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      userId: user.id,
      type: "purchase",
      amount: -total,
      description: `Purchase: ${product.name} x${quantity}`,
      status: "completed",
      reference: newOrder.id,
      createdAt: new Date().toISOString(),
    };

    // Update product quantity
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: p.quantity - quantity, status: p.quantity - quantity <= 0 ? "sold_out" : "available" } : p));
    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTxn, ...prev]);
    updateUser({ balance: user.balance - total, loyaltyPoints: user.loyaltyPoints + Math.floor(total / 1000) });
    addNotification("Order Completed!", `Your order for ${product.name} has been processed.`, "success");
    return { success: true };
  };

  const addFunds = (amount: number, method: string) => {
    if (!user) return { success: false };
    const txn: Transaction = {
      id: `TXN-${Date.now()}`,
      userId: user.id,
      type: "deposit",
      amount,
      description: `Wallet top-up via ${method}`,
      status: "completed",
      reference: `DEP-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [txn, ...prev]);
    updateUser({ balance: user.balance + amount });
    addNotification("Funds Added!", `${settings.currencySymbol}${amount.toLocaleString()} has been added to your wallet.`, "success");
    return { success: true };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => n.userId === user?.id ? { ...n, read: true } : n));
  };

  const createTicket = (subject: string, message: string, priority: string) => {
    if (!user) return;
    const ticket: SupportTicket = {
      id: `TKT-${Date.now()}`,
      userId: user.id,
      subject,
      message,
      status: "open",
      priority: priority as SupportTicket["priority"],
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [ticket, ...prev]);
  };

  const replyTicket = (ticketId: string, message: string) => {
    if (!user) return;
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      replies: [...t.replies, { id: `r-${Date.now()}`, ticketId, userId: user.id, username: user.username, message, isAdmin: user.role === "admin", createdAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    } : t));
  };

  const requestRefill = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "processing", updatedAt: new Date().toISOString() } : o));
    addNotification("Refill Requested", "Your refill request has been submitted.", "info");
  };

  const cancelOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (!ord || !user) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled", updatedAt: new Date().toISOString() } : o));
    const refundTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      userId: user.id,
      type: "refund",
      amount: ord.totalPrice,
      description: `Refund for cancelled order ${orderId}`,
      status: "completed",
      reference: orderId,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [refundTxn, ...prev]);
    updateUser({ balance: user.balance + ord.totalPrice });
    addNotification("Order Cancelled", "Your order has been cancelled and refunded.", "info");
  };

  const applyCoupon = (code: string, amount: number) => {
    const coupons: Record<string, { type: "percentage" | "fixed"; value: number; min: number }> = {
      "VAULT10": { type: "percentage", value: 10, min: 5000 },
      "RAMOS20": { type: "percentage", value: 20, min: 20000 },
      "NEWUSER": { type: "fixed", value: 1000, min: 3000 },
    };
    const coupon = coupons[code.toUpperCase()];
    if (!coupon) return { valid: false, discount: 0, error: "Invalid coupon code" };
    if (amount < coupon.min) return { valid: false, discount: 0, error: `Minimum order of ₦${coupon.min.toLocaleString()} required` };
    const discount = coupon.type === "percentage" ? Math.floor(amount * coupon.value / 100) : coupon.value;
    return { valid: true, discount };
  };

  // Admin actions
  const updateCategory = (id: string, data: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const addCategory = (data: Omit<Category, "id">) => setCategories(prev => [...prev, { ...data, id: `cat-${Date.now()}` }]);
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  const updateProduct = (id: string, data: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const addProduct = (data: Omit<Product, "id">) => setProducts(prev => [...prev, { ...data, id: `p-${Date.now()}` }]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const updateSettings = (data: Partial<AppSettings>) => setSettings(prev => ({ ...prev, ...data }));
  const updateBanner = (id: string, data: Partial<Banner>) => setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  const addBanner = (data: Omit<Banner, "id">) => setBanners(prev => [...prev, { ...data, id: `b-${Date.now()}` }]);
  const deleteBanner = (id: string) => setBanners(prev => prev.filter(b => b.id !== id));
  const addAnnouncement = (data: Omit<Announcement, "id">) => setAnnouncements(prev => [{ ...data, id: `ann-${Date.now()}` }, ...prev]);
  const updateAnnouncement = (id: string, data: Partial<Announcement>) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  return (
    <AppContext.Provider value={{
      categories, products, orders: userOrders, transactions: userTransactions,
      notifications: userNotifications, announcements, banners, settings, tickets,
      placeOrder, addFunds, markNotificationRead, markAllNotificationsRead, unreadCount,
      createTicket, replyTicket, requestRefill, cancelOrder, applyCoupon,
      updateCategory, addCategory, deleteCategory, updateProduct, addProduct, deleteProduct,
      updateSettings, updateBanner, addBanner, deleteBanner,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      allOrders: orders,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
