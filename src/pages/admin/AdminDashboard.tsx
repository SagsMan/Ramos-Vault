import { Link } from "wouter";
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, Package, Settings, Tag, Image, Megaphone } from "lucide-react";
import { ANALYTICS_DATA, MOCK_USERS } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard() {
  const { products, categories, allOrders, settings } = useApp();
  const data = ANALYTICS_DATA;

  const stats = [
    { label: "Total Revenue", value: `${settings.currencySymbol}${data.totalRevenue.toLocaleString()}`, change: `+${data.revenueGrowth}%`, icon: <DollarSign className="h-5 w-5" />, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Orders", value: allOrders.length.toString(), change: `+${data.ordersGrowth}%`, icon: <ShoppingBag className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Users", value: data.totalUsers.toLocaleString(), change: `+${data.usersGrowth}%`, icon: <Users className="h-5 w-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Active Products", value: products.filter(p => p.enabled).length.toString(), change: `${products.filter(p => p.status === "available").length} in stock`, icon: <Package className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const adminLinks = [
    { href: "/admin/categories", icon: <Tag className="h-5 w-5" />, label: "Categories", count: categories.length, color: "text-blue-500", bg: "bg-blue-500/10" },
    { href: "/admin/products", icon: <Package className="h-5 w-5" />, label: "Products", count: products.length, color: "text-violet-500", bg: "bg-violet-500/10" },
    { href: "/admin/users", icon: <Users className="h-5 w-5" />, label: "Users", count: data.totalUsers, color: "text-green-500", bg: "bg-green-500/10" },
    { href: "/admin/orders", icon: <ShoppingBag className="h-5 w-5" />, label: "Orders", count: allOrders.length, color: "text-amber-500", bg: "bg-amber-500/10" },
    { href: "/admin/banners", icon: <Image className="h-5 w-5" />, label: "Banners", count: 2, color: "text-pink-500", bg: "bg-pink-500/10" },
    { href: "/admin/analytics", icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { href: "/admin/announcements", icon: <Megaphone className="h-5 w-5" />, label: "Announcements", color: "text-red-500", bg: "bg-red-500/10" },
    { href: "/admin/settings", icon: <Settings className="h-5 w-5" />, label: "Settings", color: "text-muted-foreground", bg: "bg-muted" },
  ];

  const statusColors: Record<string, string> = {
    completed: "text-green-500",
    processing: "text-blue-500",
    pending: "text-amber-500",
    cancelled: "text-red-500",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>{s.icon}</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />{s.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart (simple bar) */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Revenue This Week</h2>
          <Link href="/admin/analytics" className="text-xs text-primary hover:underline flex items-center gap-1">View full analytics <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
        <div className="flex items-end gap-2 h-32">
          {data.dailyRevenue.map(d => {
            const maxRev = Math.max(...data.dailyRevenue.map(r => r.revenue));
            const pct = (d.revenue / maxRev) * 100;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/20 rounded-t-lg relative group cursor-pointer" style={{ height: `${pct}%` }}>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {settings.currencySymbol}{(d.revenue/1000).toFixed(0)}K · {d.orders} orders
                  </div>
                  <div className="w-full h-full bg-primary rounded-t-lg opacity-70 hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[9px] text-muted-foreground">{d.date}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {adminLinks.map(l => (
          <Link key={l.label} href={l.href}>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-card-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer">
              <div className={`w-9 h-9 ${l.bg} ${l.color} rounded-xl flex items-center justify-center`}>{l.icon}</div>
              <span className="text-[10px] font-medium text-center leading-tight">{l.label}</span>
              {l.count !== undefined && <span className="text-[10px] text-muted-foreground">{l.count}</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {allOrders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{o.productName}</p>
                  <p className="text-[10px] text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{settings.currencySymbol}{o.totalPrice.toLocaleString()}</p>
                  <span className={`text-[10px] font-medium ${statusColors[o.status] || "text-muted-foreground"}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category stats */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <h2 className="font-semibold text-sm mb-3">Top Categories</h2>
          <div className="space-y-2">
            {data.categoryStats.map(c => {
              const maxOrders = Math.max(...data.categoryStats.map(s => s.orders));
              const pct = (c.orders / maxOrders) * 100;
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{c.orders} orders · {settings.currencySymbol}{(c.revenue/1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
