import { Link } from "wouter";
import { ShoppingBag, Wallet, TrendingUp, Clock, Star, Gift, CreditCard, CheckCircle, Package, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Badge } from "../components/ui/badge";

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, transactions, settings } = useApp();

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <p className="text-muted-foreground">Please sign in to view your dashboard</p>
      <Link href="/login"><div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer">Sign In</div></Link>
    </div>
  );

  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalSpent = transactions.filter(t => t.type === "purchase" && t.status === "completed").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalDeposited = transactions.filter(t => t.type === "deposit" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);

  const levelColors: Record<string, string> = {
    bronze: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    silver: "text-gray-300 bg-gray-500/10 border-gray-500/20",
    gold: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    platinum: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  };

  const statusColors: Record<string, string> = {
    completed: "text-green-500 bg-green-500/10",
    pending: "text-amber-500 bg-amber-500/10",
    processing: "text-blue-500 bg-blue-500/10",
    cancelled: "text-red-500 bg-red-500/10",
    refund_requested: "text-purple-500 bg-purple-500/10",
  };

  const quickLinks = [
    { icon: <ShoppingBag className="h-5 w-5" />, label: "My Orders", href: "/orders", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Add Funds", href: "/add-funds", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Transactions", href: "/transactions", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: <Gift className="h-5 w-5" />, label: "Referrals", href: "/referral", color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: <Star className="h-5 w-5" />, label: "Support", href: "/tickets", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: <Package className="h-5 w-5" />, label: "Buy Now", href: "/", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero Card */}
      <div className="rounded-2xl category-banner p-5 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-lg">{user.username}</p>
                {user.verified && <CheckCircle className="h-4 w-4 text-blue-300" />}
              </div>
              <p className="text-white/60 text-sm">{user.email}</p>
              <Badge className={`text-[10px] mt-1 capitalize border ${levelColors[user.loyaltyLevel]}`}>
                {user.loyaltyLevel} · {user.loyaltyPoints.toLocaleString()} pts
              </Badge>
            </div>
          </div>
          <div className="sm:ml-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[180px]">
            <p className="text-white/60 text-xs mb-1">Wallet Balance</p>
            <p className="text-white font-bold text-2xl">{settings.currencySymbol}{user.balance.toLocaleString()}</p>
            <Link href="/add-funds">
              <div className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-white text-xs font-medium cursor-pointer text-center">
                + Add Money
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Wallet Balance", value: `${settings.currencySymbol}${user.balance.toLocaleString()}`, icon: <Wallet className="h-4 w-4" />, color: "text-primary" },
          { label: "Total Orders", value: orders.length.toString(), icon: <ShoppingBag className="h-4 w-4" />, color: "text-violet-500" },
          { label: "Total Spent", value: `${settings.currencySymbol}${totalSpent.toLocaleString()}`, icon: <TrendingUp className="h-4 w-4" />, color: "text-green-500" },
          { label: "Total Deposited", value: `${settings.currencySymbol}${totalDeposited.toLocaleString()}`, icon: <CreditCard className="h-4 w-4" />, color: "text-blue-500" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <p className="text-xl font-bold truncate">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {quickLinks.map(l => (
          <Link key={l.label} href={l.href}>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-card-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${l.bg} ${l.color} flex items-center justify-center`}>{l.icon}</div>
              <span className="text-xs font-medium text-center leading-tight">{l.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Recent Orders</h2>
          <Link href="/orders" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No orders yet. <Link href="/" className="text-primary hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{o.productName}</p>
                  <p className="text-xs text-muted-foreground">{o.categoryName} · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{settings.currencySymbol}{o.totalPrice.toLocaleString()}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[o.status]}`}>
                    {o.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" />Your Referral Code</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Earn {settings.currencySymbol}{settings.referralBonus.toLocaleString()} for each friend who signs up</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-background border border-border rounded-lg px-3 py-2 font-mono font-bold text-primary text-sm">{user.referralCode}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(user.referralCode); }}
              className="px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
