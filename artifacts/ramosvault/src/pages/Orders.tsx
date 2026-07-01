import { useState } from "react";
import { Link } from "wouter";
import { Package, Copy, RefreshCw, X, AlertCircle, CheckCircle, Clock, Receipt } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import InvoiceModal from "../components/shared/InvoiceModal";
import type { Order } from "../types";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="h-3.5 w-3.5" /> },
  processing: { label: "Processing", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <RefreshCw className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <X className="h-3.5 w-3.5" /> },
  refund_requested: { label: "Refund Req.", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

export default function Orders() {
  const { user } = useAuth();
  const { orders, requestRefill, cancelOrder, settings } = useApp();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
      <p className="text-muted-foreground">Please sign in to view orders</p>
      <Link href="/login"><Button size="sm">Sign In</Button></Link>
    </div>
  );

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const copyCredentials = (creds: string) => {
    navigator.clipboard.writeText(creds);
    toast({ title: "Copied!", description: "Credentials copied to clipboard" });
  };

  const handleRefill = (id: string) => {
    requestRefill(id);
    toast({ title: "Refill Requested", description: "We'll process your refill shortly" });
  };

  const handleCancel = (id: string) => {
    cancelOrder(id);
    toast({ title: "Order Cancelled", description: "Refund added to your wallet" });
  };

  return (
    <>
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">My Orders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{orders.length} total orders</p>
          </div>
          <Link href="/"><Button size="sm" variant="outline">+ Buy More</Button></Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {["all", "completed", "processing", "pending", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              {f === "all" ? `All (${orders.length})` : `${STATUS_CONFIG[f]?.label} (${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-medium text-muted-foreground">No orders found</p>
            <Link href="/"><Button size="sm" className="mt-3">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expanded === order.id;
              return (
                <div key={order.id} className="bg-card border border-card-border rounded-xl overflow-hidden">
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{order.productName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{order.categoryName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`flex-shrink-0 flex items-center gap-1 text-xs border ${cfg.color}`}>
                          {cfg.icon}{cfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">ID: <span className="font-mono text-foreground">{order.id}</span></span>
                        <span className="text-xs text-muted-foreground">Qty: <span className="text-foreground font-medium">{order.quantity}</span></span>
                        <span className="text-sm font-bold text-primary">{settings.currencySymbol}{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {order.credentials && order.status === "completed" && (
                      <button onClick={() => setExpanded(isExpanded ? null : order.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                        {isExpanded ? "Hide" : "View"} Credentials
                      </button>
                    )}
                    {order.status === "completed" && (
                      <button onClick={() => handleRefill(order.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors border border-border flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />Refill
                      </button>
                    )}
                    {(order.status === "pending" || order.status === "processing") && (
                      <button onClick={() => handleCancel(order.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors border border-destructive/20 flex items-center gap-1">
                        <X className="h-3 w-3" />Cancel
                      </button>
                    )}
                    {/* Receipt / Invoice export */}
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/20 flex items-center gap-1"
                    >
                      <Receipt className="h-3 w-3" />Receipt
                    </button>
                  </div>

                  {/* Credentials */}
                  {isExpanded && order.credentials && (
                    <div className="mx-4 mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Credentials</p>
                        <button onClick={() => copyCredentials(order.credentials!)}
                          className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Copy className="h-3 w-3" />Copy All
                        </button>
                      </div>
                      <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground">{order.credentials}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
