import { useState } from "react";
import { CreditCard, Smartphone, Bitcoin, Building, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

const PAYMENT_METHODS = [
  { id: "bank", label: "Bank Transfer", icon: <Building className="h-5 w-5" />, color: "text-blue-500", desc: "Transfer to our bank account" },
  { id: "card", label: "Debit/Credit Card", icon: <CreditCard className="h-5 w-5" />, color: "text-violet-500", desc: "Visa, Mastercard, Verve" },
  { id: "crypto", label: "Cryptocurrency", icon: <Bitcoin className="h-5 w-5" />, color: "text-amber-500", desc: "USDT, BTC, ETH" },
  { id: "mobile", label: "Mobile Money", icon: <Smartphone className="h-5 w-5" />, color: "text-green-500", desc: "MTN, Airtel, Glo" },
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function AddFunds() {
  const { user } = useAuth();
  const { addFunds, settings, applyCoupon } = useApp();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) return (
    <div className="flex items-center justify-center min-h-96">
      <p className="text-muted-foreground">Please sign in to add funds</p>
    </div>
  );

  const numAmount = parseFloat(amount) || 0;
  const finalAmount = Math.max(0, numAmount - discount);

  const handleCoupon = () => {
    const result = applyCoupon(coupon, numAmount);
    if (result.valid) {
      setDiscount(result.discount);
      toast({ title: "Coupon applied!", description: `You saved ${settings.currencySymbol}${result.discount.toLocaleString()}` });
    } else {
      toast({ title: "Invalid coupon", description: result.error, variant: "destructive" });
    }
  };

  const handleDeposit = async () => {
    if (numAmount < 100) { toast({ title: "Minimum amount is ₦100", variant: "destructive" }); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addFunds(finalAmount, PAYMENT_METHODS.find(m => m.id === method)?.label || method);
    setLoading(false);
    setSuccess(true);
    setAmount("");
    setDiscount(0);
    setCoupon("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Add Funds</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Current balance: <span className="font-semibold text-foreground">{settings.currencySymbol}{user.balance.toLocaleString()}</span></p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Funds Added Successfully!</p>
            <p className="text-sm opacity-80">{settings.currencySymbol}{finalAmount.toLocaleString()} has been added to your wallet.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {/* Amount */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <Label className="mb-3 block font-semibold">Amount to Deposit</Label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{settings.currencySymbol}</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="pl-8 text-lg font-semibold h-12"
              min="100"
              data-testid="input-amount"
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(a.toString())}
                className={`text-xs py-2 rounded-lg border transition-all ${parseFloat(amount) === a ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                {settings.currencySymbol}{a >= 1000 ? `${a/1000}K` : a}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Exchange rate: $1 = {settings.currencySymbol}{settings.exchangeRate.toLocaleString()}</p>
        </div>

        {/* Payment Method */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <Label className="mb-3 block font-semibold">Payment Method</Label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/50"}`}
                data-testid={`button-method-${m.id}`}>
                <span className={m.color}>{m.icon}</span>
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment instructions */}
        {method === "bank" && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Building className="h-4 w-4 text-blue-500" />Bank Transfer Details</h3>
            <div className="space-y-1.5 text-sm">
              {[["Bank", "First Bank Nigeria"], ["Account Name", "RamosVault Ltd"], ["Account Number", "1234567890"], ["Reference", user.referralCode]].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}:</span>
                  <span className="font-medium font-mono">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Use your referral code as payment reference</p>
          </div>
        )}

        {method === "crypto" && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Bitcoin className="h-4 w-4 text-amber-500" />Crypto Wallet Address</h3>
            <div className="space-y-2">
              {[["USDT (TRC20)", "TRmosVault9xAbCdEfGhIjKlMnOpQrStUv"], ["BTC", "bc1qramosvault1234abcdefghijklmnop"]].map(([net, addr]) => (
                <div key={net} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{net}:</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate max-w-[180px]">{addr}</code>
                    <button onClick={() => navigator.clipboard.writeText(addr)} className="text-xs text-primary hover:underline flex-shrink-0">Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupon */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <Label className="mb-2 block font-semibold">Coupon Code <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
          <div className="flex gap-2">
            <Input placeholder="Enter coupon code (e.g. VAULT10)" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} className="font-mono uppercase" data-testid="input-coupon" />
            <Button onClick={handleCoupon} variant="outline" type="button">Apply</Button>
          </div>
          {discount > 0 && <p className="text-xs text-green-500 mt-1.5">Discount: -{settings.currencySymbol}{discount.toLocaleString()}</p>}
        </div>

        {/* Summary */}
        {numAmount > 0 && (
          <div className="bg-card border border-card-border rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>{settings.currencySymbol}{numAmount.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-{settings.currencySymbol}{discount.toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total to pay</span><span className="text-primary">{settings.currencySymbol}{finalAmount.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>Credit to wallet</span><span>+{settings.currencySymbol}{finalAmount.toLocaleString()}</span></div>
            </div>
          </div>
        )}

        <Button onClick={handleDeposit} disabled={!numAmount || loading} className="h-12 text-base font-semibold" data-testid="button-deposit">
          {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : `Add ${settings.currencySymbol}${finalAmount.toLocaleString()} to Wallet`}
        </Button>
      </div>
    </div>
  );
}
