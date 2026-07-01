import type { Category, Product, User, Order, Transaction, Banner, Announcement, AppSettings, AnalyticsData } from "../types";

export const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Facebook", slug: "facebook", icon: "SiFacebook", color: "#1877F2", description: "Aged Facebook accounts with marketplace & friends", enabled: true, order: 1 },
  { id: "cat-2", name: "Instagram", slug: "instagram", icon: "SiInstagram", color: "#E1306C", description: "Instagram accounts with followers", enabled: true, order: 2 },
  { id: "cat-3", name: "TikTok", slug: "tiktok", icon: "SiTiktok", color: "#010101", description: "Aged TikTok accounts", enabled: true, order: 3 },
  { id: "cat-4", name: "Twitter", slug: "twitter", icon: "SiX", color: "#000000", description: "Twitter/X aged accounts with followers", enabled: true, order: 4 },
  { id: "cat-5", name: "Telegram", slug: "telegram", icon: "SiTelegram", color: "#26A5E4", description: "Telegram aged accounts", enabled: true, order: 5 },
  { id: "cat-6", name: "VPN", slug: "vpn", icon: "Shield", color: "#22C55E", description: "Premium VPN subscriptions", enabled: true, order: 6 },
  { id: "cat-7", name: "Mails", slug: "mails", icon: "SiGmail", color: "#EA4335", description: "Aged email accounts", enabled: true, order: 7 },
  { id: "cat-8", name: "Facebook Dating", slug: "facebook-dating", icon: "SiFacebook", color: "#6B21A8", description: "Activated Facebook Dating profiles", enabled: true, order: 8 },
  { id: "cat-9", name: "Facebook Special Offer", slug: "facebook-special", icon: "SiFacebook", color: "#1877F2", description: "High quality Facebook accounts", enabled: true, order: 9 },
  { id: "cat-10", name: "Miscellaneous", slug: "miscellaneous", icon: "Package", color: "#F59E0B", description: "Reddit, Discord, Quora & more", enabled: true, order: 10 },
  { id: "cat-11", name: "Web Development", slug: "web-development", icon: "Globe", color: "#0EA5E9", description: "Web dev tools & accounts", enabled: true, order: 11 },
  { id: "cat-12", name: "Update 2025", slug: "update-2025", icon: "Package", color: "#8B5CF6", description: "Latest 2025 account updates", enabled: true, order: 12 },
];

export const PRODUCTS: Product[] = [
  // Facebook
  { id: "p-1", categoryId: "cat-1", name: "8-15 years USA Facebook with 100+ friends & Active marketplace 85% have create profile very strong accounts", description: "Premium aged US Facebook accounts with active marketplace access", price: 9870, quantity: 6, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-2", categoryId: "cat-1", name: "8-15 years GERMANY Facebook with 0-50 friends & Active marketplace 60% have create profile", description: "German Facebook accounts with marketplace", price: 6540, quantity: 76, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-3", categoryId: "cat-1", name: "8-10 years DIFFERENT COUNTRIES Facebook with 30-5,000 friends Active marketplaces (MAJORITY USA, EU, UK, FRANCE)", description: "Multi-country Facebook accounts with large friend lists", price: 6990, quantity: 289, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-4", categoryId: "cat-1", name: "8-15 years EUROPE Facebook with 0-50 friends & Active marketplace 70% have create profile Very beautiful accounts", description: "European Facebook accounts with marketplace", price: 6340, quantity: 136, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-5", categoryId: "cat-1", name: "4-10 year Facebook with 0-50 friends & Active marketplace 85% have create profile very strong accounts", description: "Mid-aged Facebook accounts", price: 4980, quantity: 82, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Instagram
  { id: "p-6", categoryId: "cat-2", name: "6-10 YEARS 500+ FOLLOWER Instagram account MOST ACCOUNTS HAS POST VERY STRONG <USE 2FA>", description: "Aged Instagram accounts with 500+ followers and posts", price: 4450, quantity: 0, image: "", status: "sold_out", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-7", categoryId: "cat-2", name: "6-10 YEARS 1,000+ FOLLOWER Instagram account MOST ACCOUNTS HAS POST VERY STRONG <USE 2FA>", description: "Aged Instagram accounts with 1000+ followers", price: 6980, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-8", categoryId: "cat-2", name: "7-10 YEARS 2,000+ FOLLOWER Instagram account MOST ACCOUNTS HAS POST VERY STRONG <USE 2FA>", description: "Premium Instagram accounts with 2000+ followers", price: 7890, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-9", categoryId: "cat-2", name: "5-8 YEARS 200+ FOLLOWER Instagram account USA accounts VERY STRONG <USE 2FA>", description: "US Instagram accounts with followers", price: 3200, quantity: 45, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // TikTok
  { id: "p-10", categoryId: "cat-3", name: "AGED UK TikTok with 0-50 followers (LOGIN MAIL ON OUTLOOK.LIVE.COM) USE UK VPN TO LOGIN", description: "UK aged TikTok accounts via Outlook", price: 999, quantity: 692, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-11", categoryId: "cat-3", name: "AGED Canada TikTok 0-50 followers (LOGIN MAIL ON OUTLOOK.LIVE.COM) USE VPN TO LOGIN", description: "Canadian TikTok accounts via Outlook", price: 998, quantity: 577, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-12", categoryId: "cat-3", name: "AGED USA TikTok 0-50 followers (LOGIN MAIL ON OUTLOOK.LIVE.COM) USE VPN TO LOGIN", description: "US TikTok accounts via Outlook", price: 999, quantity: 881, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-13", categoryId: "cat-3", name: "AGED UK 100+ followers TIKTOK (LOGIN MAIL ON OUTLOOK.LIVE.COM) USE VPN TO LOGIN", description: "UK TikTok accounts with 100+ followers", price: 1990, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-14", categoryId: "cat-3", name: "AGED ITALY 0-50 followers TikTok (LOGIN MAIL ON OUTLOOK.LIVE.COM) USE UK VPN TO LOGIN", description: "Italian TikTok accounts", price: 900, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Twitter
  { id: "p-15", categoryId: "cat-4", name: "10-20 years old EUROPE TWITTER with 30-50 followers and nice profile <LOGIN MAIL ON FIRSTMAIL.LTD>", description: "Old European Twitter accounts with followers", price: 3480, quantity: 284, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-16", categoryId: "cat-4", name: "11-20 years old EUROPE TWITTER with 50-100 followers and nice profile <LOGIN MAIL ON FIRSTMAIL.LTD>", description: "Old European Twitter with 50-100 followers", price: 3690, quantity: 400, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-17", categoryId: "cat-4", name: "11-20 years old EUROPE TWITTER with 100-200 followers and nice profile <LOGIN MAIL ON MAIL.TM>", description: "European Twitter with 100-200 followers", price: 4150, quantity: 55, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-18", categoryId: "cat-4", name: "11-20 years old EUROPE TWITTER with 200-500 followers and nice profile <LOGIN MAIL ON MAIL.TM>", description: "Premium European Twitter with 200-500 followers", price: 4980, quantity: 99, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-19", categoryId: "cat-4", name: "11-20 years old EUROPE TWITTER with 500-1000 followers and nice profile <LOGIN MAIL ON GMXMAIL APP>", description: "High follower Twitter accounts", price: 7980, quantity: 31, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-20", categoryId: "cat-4", name: "VERIFIED EUROPE BLUE BADGE X with 100-500 followers VERY STRONG", description: "Verified blue badge Twitter/X accounts", price: 4980, quantity: 82, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },

  // VPN
  { id: "p-21", categoryId: "cat-6", name: "HMA VPN: This is the best vpn for Everything you can use it for fb dating and any app (one user per log) 1 month login", description: "HMA VPN 1 month subscription", price: 3230, quantity: 224, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-22", categoryId: "cat-6", name: "EXPRESS VPN monthly quality vpn works on iphone, android & laptop (ALL DEVICES) USE PASSWORD AS LAPTOP", description: "Express VPN monthly subscription all devices", price: 3450, quantity: 189, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-23", categoryId: "cat-6", name: "NORD VPN: 1 YEAR high quality Nord VPN works on all Devices", description: "NordVPN 1 year subscription", price: 14999, quantity: 5, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-24", categoryId: "cat-6", name: "PIA VPN: 1 Year Quality Pia vpn suitable for different apps can work on all phones and MacBook", description: "PIA VPN 1 year subscription", price: 9999, quantity: 5, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Mails
  { id: "p-25", categoryId: "cat-7", name: "USA Aged Hotmail account", description: "Aged US Hotmail accounts", price: 250, quantity: 4561, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-26", categoryId: "cat-7", name: "USA GMXmail.com email easy login just login here on GMX MAIL APP", description: "GMX mail accounts easy login", price: 198, quantity: 327, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-27", categoryId: "cat-7", name: "USE VPN Aged USA Mail.com mails login this mail on mail.com", description: "US Mail.com aged accounts", price: 199, quantity: 313, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-28", categoryId: "cat-7", name: "2 years old rambler mail login on mail.ru app", description: "Rambler mail accounts 2 years old", price: 180, quantity: 1822, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-29", categoryId: "cat-7", name: "OLD EUROPE Gmail 2010+ 2FA activated (JUST USE 2FA TO LOGIN VERY EASY NO NEED FOR NUMBERS)", description: "Old European Gmail with 2FA", price: 3590, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Miscellaneous
  { id: "p-30", categoryId: "cat-10", name: "2 year old USA Reddit with 0-50 karma Male or female profile", description: "Aged Reddit accounts USA", price: 744, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-31", categoryId: "cat-10", name: "3 year old USA Reddit with 0-50 karma Male or female profile", description: "3-year old Reddit USA accounts", price: 990, quantity: 82, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-32", categoryId: "cat-10", name: "Aged USA Quora account coins mail (login mail on mail.ru app)", description: "Quora accounts with coins", price: 1450, quantity: 40, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-33", categoryId: "cat-10", name: "AGED EUROPE DISCORD account contains mail (login mail on OUTLOOK.LIVE) ACCOUNT HAS 2fa very strong", description: "European Discord with 2FA", price: 1999, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-34", categoryId: "cat-10", name: "OLD EUROPE THREADS ACCOUNT BERY STRONG", description: "Old European Threads accounts", price: 1710, quantity: 0, image: "", status: "sold_out", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Facebook Dating
  { id: "p-35", categoryId: "cat-8", name: "1-6 YEARS MALE FACEBOOK DATING Already Activated Dating profile Dating location (NEW YORK) has switch", description: "Male Facebook Dating US accounts NY", price: 18990, quantity: 18, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-36", categoryId: "cat-8", name: "6-10 YEARS FEMALE FACEBOOK DATING Already Activated Dating profile Dating location [NEW YORK] has switch", description: "Female Facebook Dating NY accounts", price: 19980, quantity: 16, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
  { id: "p-37", categoryId: "cat-8", name: "7-10 YEARS FACEBOOK GET STARTED DATING (USA) Some has switch profiles and Active marketplace with", description: "USA Facebook Dating starter profiles", price: 14890, quantity: 18, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Facebook Special Offer
  { id: "p-38", categoryId: "cat-9", name: "HIGH QUALITY FACEBOOK with 30-500 friends MAJORITY USA with marketplace VERY STRONG ACCOUNTS", description: "High quality US Facebook with marketplace", price: 8500, quantity: 45, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-39", categoryId: "cat-9", name: "SPECIAL EUROPE Facebook 5-15 years with marketplace VERY STRONG", description: "Special European Facebook accounts", price: 7200, quantity: 30, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Update 2025
  { id: "p-40", categoryId: "cat-12", name: "ANY MOVIES ON THE INTERNET TOTALLY FOR FREE (not Netflix app)", description: "Stream any movie free online tool", price: 990, quantity: 842, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-41", categoryId: "cat-12", name: "PREMIUM STREAMING ACCOUNTS 2025 Updated", description: "Premium streaming updated for 2025", price: 1500, quantity: 200, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },

  // Telegram
  { id: "p-42", categoryId: "cat-5", name: "Aged Telegram account 2-5 years OLD EU with sessions", description: "Old European Telegram with sessions", price: 2500, quantity: 150, image: "", status: "available", featured: true, enabled: true, createdAt: "2025-01-01" },
  { id: "p-43", categoryId: "cat-5", name: "Aged USA Telegram account 3-7 years with sessions VERY STRONG", description: "Old US Telegram with sessions", price: 3200, quantity: 80, image: "", status: "available", featured: false, enabled: true, createdAt: "2025-01-01" },
];

export const MOCK_USERS: User[] = [
  { id: "u-1", username: "admin", email: "admin@ramosvault.com", role: "admin", balance: 500000, currency: "NGN", verified: true, status: "active", referralCode: "ADMIN001", loyaltyPoints: 10000, loyaltyLevel: "platinum", createdAt: "2024-01-01", lastLogin: "2025-07-01" },
  { id: "u-2", username: "demo_user", email: "user@ramosvault.com", role: "user", balance: 25000, currency: "NGN", verified: true, status: "active", referralCode: "USER002", loyaltyPoints: 500, loyaltyLevel: "silver", createdAt: "2024-06-01", lastLogin: "2025-07-01" },
];

export const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", userId: "u-2", productId: "p-10", productName: "AGED UK TikTok with 0-50 followers", categoryName: "TikTok", quantity: 2, totalPrice: 1998, status: "completed", credentials: "user@outlook.com:Password123", createdAt: "2025-06-28T10:00:00Z", updatedAt: "2025-06-28T10:05:00Z" },
  { id: "ORD-002", userId: "u-2", productId: "p-25", productName: "USA Aged Hotmail account", categoryName: "Mails", quantity: 5, totalPrice: 1250, status: "completed", credentials: "hotmail1@hotmail.com:Pass1\nhotmail2@hotmail.com:Pass2", createdAt: "2025-06-27T14:30:00Z", updatedAt: "2025-06-27T14:31:00Z" },
  { id: "ORD-003", userId: "u-2", productId: "p-21", productName: "HMA VPN 1 month", categoryName: "VPN", quantity: 1, totalPrice: 3230, status: "processing", createdAt: "2025-07-01T09:00:00Z", updatedAt: "2025-07-01T09:00:00Z" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-001", userId: "u-2", type: "deposit", amount: 50000, description: "Wallet top-up via bank transfer", status: "completed", reference: "REF123456", createdAt: "2025-06-25T12:00:00Z" },
  { id: "TXN-002", userId: "u-2", type: "purchase", amount: -1998, description: "Purchase: AGED UK TikTok x2", status: "completed", reference: "ORD-001", createdAt: "2025-06-28T10:00:00Z" },
  { id: "TXN-003", userId: "u-2", type: "purchase", amount: -1250, description: "Purchase: USA Aged Hotmail x5", status: "completed", reference: "ORD-002", createdAt: "2025-06-27T14:30:00Z" },
  { id: "TXN-004", userId: "u-2", type: "cashback", amount: 500, description: "Loyalty cashback reward", status: "completed", reference: "CB-001", createdAt: "2025-06-26T08:00:00Z" },
];

export const MOCK_BANNERS: Banner[] = [
  { id: "b-1", title: "Welcome to RamosVault", description: "Your trusted source for premium digital accounts", image: "", link: "/", enabled: true, order: 1, createdAt: "2025-01-01" },
  { id: "b-2", title: "New Stock Added!", description: "Fresh TikTok and Twitter accounts just added", image: "", link: "/category/tiktok", enabled: true, order: 2, createdAt: "2025-01-01" },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "New stock dropped!", content: "Fresh TikTok USA accounts available — buy now before they sell out!", type: "success", enabled: true, createdAt: "2025-07-01" },
  { id: "ann-2", title: "Discount weekend", content: "Use code VAULT10 for 10% off all orders this weekend!", type: "info", enabled: true, createdAt: "2025-06-30" },
];

export const MARQUEE_MESSAGES = [
  "100,000+ happy customers worldwide!",
  "14.9M+ accounts sold and counting!",
  "New stock just dropped!",
  "Join our WhatsApp for updates & giveaways!",
  "Lightning-fast delivery guaranteed!",
  "Secure. Fast. Reliable. — RamosVault",
  "10% discount on orders above ₦50,000!",
];

export const DEFAULT_SETTINGS: AppSettings = {
  siteName: "RamosVault",
  siteDescription: "Secure. Fast. Reliable. — Premium digital accounts marketplace",
  maintenanceMode: false,
  currencySymbol: "₦",
  exchangeRate: 1420,
  whatsappLink: "https://wa.me/+2348000000000",
  telegramLink: "https://t.me/ramosvault",
  twitterLink: "https://twitter.com/ramosvault",
  instagramLink: "https://instagram.com/ramosvault",
  supportEmail: "support@ramosvault.com",
  referralBonus: 500,
  cashbackRate: 2,
  autoCancelHours: 24,
};

export const ANALYTICS_DATA: AnalyticsData = {
  totalRevenue: 4892000,
  totalOrders: 1847,
  totalUsers: 3241,
  totalProducts: 43,
  revenueGrowth: 18.5,
  ordersGrowth: 12.3,
  usersGrowth: 24.1,
  dailyRevenue: [
    { date: "Jun 25", revenue: 120000, orders: 45 },
    { date: "Jun 26", revenue: 185000, orders: 72 },
    { date: "Jun 27", revenue: 142000, orders: 58 },
    { date: "Jun 28", revenue: 210000, orders: 84 },
    { date: "Jun 29", revenue: 175000, orders: 68 },
    { date: "Jun 30", revenue: 230000, orders: 91 },
    { date: "Jul 01", revenue: 198000, orders: 76 },
  ],
  categoryStats: [
    { name: "Facebook", orders: 420, revenue: 2100000 },
    { name: "TikTok", orders: 380, revenue: 380000 },
    { name: "Twitter", orders: 290, revenue: 1100000 },
    { name: "VPN", orders: 210, revenue: 650000 },
    { name: "Mails", orders: 280, revenue: 180000 },
    { name: "Instagram", orders: 160, revenue: 900000 },
    { name: "Miscellaneous", orders: 107, revenue: 220000 },
  ],
  recentOrders: MOCK_ORDERS,
};
