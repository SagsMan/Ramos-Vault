import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, Package } from "lucide-react";
import { ANALYTICS_DATA } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function AdminAnalytics() {
  const { settings, products, allOrders } = useApp();
  const data = ANALYTICS_DATA;

  const maxRev = Math.max(...data.dailyRevenue.map(d => d.revenue));
  const maxOrders = Math.max(...data.dailyRevenue.map(d => d.orders));
  const maxCatOrders = Math.max(...data.categoryStats.map(c => c.orders));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Real-time store performance metrics</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: `${settings.currencySymbol}${(data.totalRevenue/1000).toFixed(0)}K`, change: `+${data.revenueGrowth}%`, icon: <DollarSign className="h-5 w-5" />, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Total Orders", value: allOrders.length.toLocaleString(), change: `+${data.ordersGrowth}%`, icon: <ShoppingBag className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Users", value: data.totalUsers.toLocaleString(), change: `+${data.usersGrowth}%`, icon: <Users className="h-5 w-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Active Products", value: products.filter(p => p.enabled && p.status === "available").length.toString(), change: `${products.filter(p => p.status === "sold_out").length} sold out`, icon: <Package className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>{s.icon}</div>
              <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
                <TrendingUp className="h-3 w-3" />{s.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Daily Revenue (Last 7 Days)</h2>
        </div>
        <div className="flex items-end gap-2 h-40 mb-2">
          {data.dailyRevenue.map(d => {
            const pct = (d.revenue / maxRev) * 100;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full group relative flex flex-col justify-end" style={{ height: `${pct}%` }}>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {settings.currencySymbol}{(d.revenue/1000).toFixed(0)}K · {d.orders} orders
                  </div>
                  <div className="w-full rounded-t-lg bg-primary/30 hover:bg-primary transition-colors cursor-pointer" style={{ height: "100%" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {data.dailyRevenue.map(d => (
            <div key={d.date} className="flex-1 text-center text-[9px] text-muted-foreground">{d.date}</div>
          ))}
        </div>
      </div>

      {/* Orders chart */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4"><ShoppingBag className="h-4 w-4 text-blue-500" />Daily Orders</h2>
          <div className="flex items-end gap-2 h-28 mb-2">
            {data.dailyRevenue.map(d => {
              const pct = (d.orders / maxOrders) * 100;
              return (
                <div key={d.date} className="flex-1 flex flex-col justify-end h-full">
                  <div className="w-full rounded-t-lg bg-blue-500/30 hover:bg-blue-500/60 transition-colors" style={{ height: `${pct}%` }} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            {data.dailyRevenue.map(d => (
              <div key={d.date} className="flex-1 text-center text-[9px] text-muted-foreground">{d.orders}</div>
            ))}
          </div>
        </div>

        {/* Category performance */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4"><ArrowUpRight className="h-4 w-4 text-primary" />Category Performance</h2>
          <div className="space-y-3">
            {data.categoryStats.slice(0, 6).map(c => {
              const pct = (c.orders / maxCatOrders) * 100;
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{c.orders} orders · {settings.currencySymbol}{(c.revenue/1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Category Revenue Summary</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">ORDERS</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">REVENUE</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">SHARE</th>
            </tr>
          </thead>
          <tbody>
            {data.categoryStats.map(c => (
              <tr key={c.name} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-right">{c.orders.toLocaleString()}</td>
                <td className="px-5 py-3 text-right font-semibold">{settings.currencySymbol}{c.revenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-muted-foreground">{((c.revenue / data.totalRevenue) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
