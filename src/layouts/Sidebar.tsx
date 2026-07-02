import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, Package, CreditCard, Gift, Tv, HelpCircle, Settings, ShieldCheck, BarChart3, Users, LayoutDashboard, X, FileText, Phone, Megaphone, Tag, Image, ChevronDown, ChevronRight } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiTelegram } from "react-icons/si";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "cat-1": <SiFacebook className="h-4 w-4" style={{ color: "#1877F2" }} />,
  "cat-2": <SiInstagram className="h-4 w-4" style={{ color: "#E1306C" }} />,
  "cat-3": <SiTiktok className="h-4 w-4" />,
  "cat-4": <SiX className="h-4 w-4" />,
  "cat-5": <SiTelegram className="h-4 w-4" style={{ color: "#26A5E4" }} />,
  "cat-6": <ShieldCheck className="h-4 w-4 text-green-500" />,
  "cat-7": <FileText className="h-4 w-4 text-red-400" />,
  "cat-8": <SiFacebook className="h-4 w-4" style={{ color: "#A855F7" }} />,
  "cat-9": <SiFacebook className="h-4 w-4" style={{ color: "#1877F2" }} />,
  "cat-10": <Package className="h-4 w-4 text-amber-500" />,
  "cat-11": <LayoutDashboard className="h-4 w-4 text-sky-500" />,
  "cat-12": <Gift className="h-4 w-4 text-violet-500" />,
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { user, isAdmin } = useAuth();
  const { categories } = useApp();
  const [productsOpen, setProductsOpen] = useState(location.startsWith("/category"));

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  const navItem = (href: string, icon: React.ReactNode, label: string, badge?: string) => (
    <Link href={href} onClick={onClose}>
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
        isActive(href)
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}>
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{badge}</span>}
      </div>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center">
            <img src="/logo-horizontal.png" alt="RamosVault" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {isAdmin ? (
            <>
              <div className="pt-0 pb-1 px-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/70">Admin Panel</p>
              </div>
              {navItem("/admin", <ShieldCheck className="h-4 w-4 text-primary" />, "Dashboard")}
              {navItem("/admin/categories", <Tag className="h-4 w-4" />, "Categories")}
              {navItem("/admin/products", <Package className="h-4 w-4" />, "Products")}
              {navItem("/admin/users", <Users className="h-4 w-4" />, "Users")}
              {navItem("/admin/orders", <ShoppingBag className="h-4 w-4" />, "All Orders")}
              {navItem("/admin/banners", <Image className="h-4 w-4" />, "Banners")}
              {navItem("/admin/announcements", <Megaphone className="h-4 w-4" />, "Announcements")}
              {navItem("/admin/analytics", <BarChart3 className="h-4 w-4" />, "Analytics")}
              {navItem("/admin/settings", <Settings className="h-4 w-4" />, "Settings")}
            </>
          ) : (
            <>
              {navItem("/", <Home className="h-4 w-4" />, "Home")}

              {/* Products with categories */}
              <div>
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    productsOpen ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Products</span>
                  {productsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>

                {productsOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-sidebar-border space-y-0.5 animate-fade-in-up">
                    {categories.filter(c => c.enabled).sort((a, b) => a.order - b.order).map(cat => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} onClick={onClose}>
                        <div className={cn(
                          "flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
                          isActive(`/category/${cat.slug}`)
                            ? "bg-primary/20 text-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}>
                          {categoryIcons[cat.id] || <Package className="h-4 w-4" />}
                          <span className="truncate">{cat.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {user && (
                <>
                  <div className="pt-2 pb-1 px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Account</p>
                  </div>
                  {navItem("/dashboard", <LayoutDashboard className="h-4 w-4" />, "Dashboard")}
                  {navItem("/orders", <Package className="h-4 w-4" />, "My Orders")}
                  {navItem("/add-funds", <CreditCard className="h-4 w-4" />, "Add Funds")}
                  {navItem("/transactions", <BarChart3 className="h-4 w-4" />, "Transactions")}
                  {navItem("/tickets", <HelpCircle className="h-4 w-4" />, "Support Tickets")}
                  {navItem("/referral", <Gift className="h-4 w-4" />, "Referral")}
                  {navItem("/profile", <Settings className="h-4 w-4" />, "Profile")}
                </>
              )}

              <div className="pt-2 pb-1 px-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Info</p>
              </div>
              {navItem("/faq", <HelpCircle className="h-4 w-4" />, "FAQ")}
              {navItem("/contact", <Phone className="h-4 w-4" />, "Contact")}
              {navItem("/terms", <FileText className="h-4 w-4" />, "Terms & Conditions")}
              {navItem("/privacy", <FileText className="h-4 w-4" />, "Privacy Policy")}
            </>
          )}
        </div>

        {/* Footer */}
        {!user && (
          <div className="p-4 border-t border-sidebar-border flex-shrink-0">
            <Link href="/login" onClick={onClose}>
              <div className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center cursor-pointer hover:opacity-90 transition-opacity">
                Sign In / Register
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
