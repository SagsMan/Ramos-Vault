import { Link, useLocation } from "wouter";
import { ShoppingCart, Phone, Globe, Heart, Gift, Smartphone, Wallet, BarChart3, TrendingUp } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import MarqueeBanner from "../components/home/MarqueeBanner";
import CategorySection from "../components/products/CategorySection";
import { Button } from "../components/ui/button";

const quickActions = [
  { icon: <ShoppingCart className="h-6 w-6" />, label: "Buy Account", href: "/category/facebook", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  { icon: <Phone className="h-6 w-6" />, label: "Buy USA Numbers", href: "/category/miscellaneous", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { icon: <Globe className="h-6 w-6" />, label: "Other Countries", href: "/category/twitter", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { icon: <Heart className="h-6 w-6" />, label: "Instagram", href: "/category/instagram", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { icon: <Gift className="h-6 w-6" />, label: "VPN Tools", href: "/category/vpn", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", badge: "HOT" },
  { icon: <Smartphone className="h-6 w-6" />, label: "TikTok Accts", href: "/category/tiktok", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", badge: "NEW" },
];

export default function Home() {
  const { user } = useAuth();
  const { categories, products, settings } = useApp();
  const [, navigate] = useLocation();

  const enabledCats = categories.filter(c => c.enabled).sort((a, b) => a.order - b.order);

  const getLevelColor = (level: string) => {
    const m: Record<string, string> = { bronze: "text-orange-400", silver: "text-gray-400", gold: "text-yellow-400", platinum: "text-cyan-400" };
    return m[level] || "text-gray-400";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <MarqueeBanner />
      <div className="px-4 py-4">
        {/* Hero / User Card */}
        {user ? (
          <div className="rounded-2xl category-banner p-5 mb-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute right-12 bottom-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white font-bold">{user.username}</p>
                    {user.verified && <span className="text-blue-300 text-xs">✓</span>}
                  </div>
                  <p className="text-white/60 text-sm">Welcome back!</p>
                </div>
              </div>
              <div className="sm:ml-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Available Balance</p>
                <p className="text-white font-bold text-2xl">{settings.currencySymbol}{user.balance.toLocaleString()}</p>
                <p className="text-white/40 text-xs mt-0.5">$1 = {settings.currencySymbol}{settings.exchangeRate.toLocaleString()}</p>
                <div className="flex gap-2 mt-3">
                  <Link href="/add-funds">
                    <Button size="sm" variant="secondary" className="text-xs h-7 bg-white/20 hover:bg-white/30 text-white border-0">
                      + Add Money
                    </Button>
                  </Link>
                  <Link href="/transactions">
                    <Button size="sm" variant="ghost" className="text-xs h-7 text-white/70 hover:text-white hover:bg-white/10 border-0">
                      History
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-3">
              <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-white/10 ${getLevelColor(user.loyaltyLevel)}`}>
                {user.loyaltyLevel} Member · {user.loyaltyPoints.toLocaleString()} pts
              </span>
              <span className="text-white/40 text-xs">Referral: {user.referralCode}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl category-banner p-6 mb-5 relative overflow-hidden text-center">
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="relative">
              <h1 className="text-white font-bold text-xl mb-1">{settings.siteName}</h1>
              <p className="text-white/70 text-sm mb-4">{settings.siteDescription}</p>
              <div className="flex gap-2 justify-center flex-wrap mb-4">
                {[{icon:<TrendingUp className="h-4 w-4"/>,label:"100K+ Users"},{icon:<BarChart3 className="h-4 w-4"/>,label:"14.9M+ Sold"},{icon:<Wallet className="h-4 w-4"/>,label:"Secure Payments"}].map(s=>(
                  <div key={s.label} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-white/80 text-xs">
                    {s.icon}{s.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate("/register")} size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold">Get Started</Button>
                <Button onClick={() => navigate("/login")} size="sm" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 border-white/20">Sign In</Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}>
              <div className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all ${action.color}`}>
                {action.badge && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full leading-none">
                    {action.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center">{action.icon}</div>
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Sections */}
        {enabledCats.map(cat => {
          const catProducts = products.filter(p => p.categoryId === cat.id && p.enabled);
          return <CategorySection key={cat.id} category={cat} products={catProducts} />;
        })}
      </div>
    </div>
  );
}
