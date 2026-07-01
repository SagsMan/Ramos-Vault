import { useState } from "react";
import { Search, Eye, X, RefreshCw, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";

export default function AdminOrders() {
  const { allOrders, settings } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = allOrders.filter(o =>
    (statusFilter === "all" || o.status === statusFilter) &&
    (o.id.includes(search) || o.productName.toLowerCase().includes(search.toLowerCase()) || o.userId.includes(search))
  );

  const statusColors: Record<string, string> = {
    completed: "bg-green-500/10 text-green-500",
    pending: "bg-amber-500/10 text-amber-500",
    processing: "bg-blue-500/10 text-blue-500",
    cancelled: "bg-red-500/10 text-red-500",
    refund_requested: "bg-purple-500/10 text-purple-500",
  };

  const selectedOrder = allOrders.find(o => o.id === selected);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">All Orders</h1>
        <p className="text-sm text-muted-foreground">{allOrders.length} total orders</p>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by order ID, product, user..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ORDER</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">PRODUCT</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">AMOUNT</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer ${selected === o.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(o.id)}>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-xs truncate max-w-[180px]">{o.productName}</p>
                      <p className="text-xs text-muted-foreground">{o.categoryName}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-sm">{settings.currencySymbol}{o.totalPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-muted rounded"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder ? (
          <div className="bg-card border border-card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Order Details</h3>
              <button onClick={() => setSelected(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono text-xs">{selectedOrder.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-right max-w-[150px] text-xs">{selectedOrder.productName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{selectedOrder.categoryName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{selectedOrder.quantity}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">{settings.currencySymbol}{selectedOrder.totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-xs">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><Badge className={`text-xs ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</Badge></div>
            </div>
            {selectedOrder.credentials && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-semibold mb-1">Credentials</p>
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">{selectedOrder.credentials}</pre>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={() => toast({ title: "Status updated!" })} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-xs hover:bg-green-500/20 transition-colors">
                <CheckCircle className="h-3.5 w-3.5" />Complete
              </button>
              <button onClick={() => toast({ title: "Processing..." })} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-xs hover:bg-blue-500/20 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />Process
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-xl p-4 flex items-center justify-center text-muted-foreground text-sm">
            Select an order to view details
          </div>
        )}
      </div>
    </div>
  );
}
