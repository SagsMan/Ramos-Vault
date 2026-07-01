import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Gift, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import type { Transaction } from "../types";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; amountColor: string }> = {
  deposit:   { label: "Deposit",   icon: <ArrowDownLeft className="h-4 w-4" />, color: "bg-green-500/10 text-green-500",  amountColor: "text-green-500" },
  purchase:  { label: "Purchase",  icon: <ArrowUpRight className="h-4 w-4" />,  color: "bg-red-500/10 text-red-500",     amountColor: "text-red-500" },
  refund:    { label: "Refund",    icon: <RefreshCw className="h-4 w-4" />,     color: "bg-blue-500/10 text-blue-500",   amountColor: "text-blue-500" },
  cashback:  { label: "Cashback",  icon: <Gift className="h-4 w-4" />,          color: "bg-amber-500/10 text-amber-500", amountColor: "text-amber-500" },
  referral:  { label: "Referral",  icon: <Gift className="h-4 w-4" />,          color: "bg-violet-500/10 text-violet-500", amountColor: "text-violet-500" },
};

export default function Transactions() {
  const { user } = useAuth();
  const { transactions, settings } = useApp();
  const [filter, setFilter] = useState("all");

  if (!user) return (
    <div className="flex items-center justify-center min-h-96 text-muted-foreground">Please sign in</div>
  );

  const filtered = filter === "all" ? transactions : transactions.filter((t: Transaction) => t.type === filter);

  const totalIn = transactions.filter((t: Transaction) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t: Transaction) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Transaction History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{transactions.length} transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total In", value: `${settings.currencySymbol}${totalIn.toLocaleString()}`, color: "text-green-500" },
          { label: "Total Out", value: `${settings.currencySymbol}${totalOut.toLocaleString()}`, color: "text-red-500" },
          { label: "Net", value: `${settings.currencySymbol}${(totalIn - totalOut).toLocaleString()}`, color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {["all", "deposit", "purchase", "refund", "cashback"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          {filtered.map((txn, i) => {
            const cfg = TYPE_CONFIG[txn.type] || TYPE_CONFIG.deposit;
            const isPositive = txn.amount > 0;
            return (
              <div key={txn.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < filtered.length - 1 ? "border-b border-border/50" : ""} hover:bg-muted/30 transition-colors`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.reference} · {new Date(txn.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{settings.currencySymbol}{Math.abs(txn.amount).toLocaleString()}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${txn.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
