import { Copy, Gift, Users, TrendingUp, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

export default function Referral() {
  const { user } = useAuth();
  const { settings } = useApp();
  const { toast } = useToast();

  if (!user) return <div className="flex items-center justify-center min-h-96 text-muted-foreground">Please sign in</div>;

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!` });
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Join RamosVault", text: `Use my referral code ${user.referralCode} and get ₦${settings.referralBonus} bonus!`, url: referralLink });
    } else {
      copy(referralLink, "Referral link");
    }
  };

  const stats = [
    { label: "Total Referrals", value: "0", icon: <Users className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Earnings", value: `${settings.currencySymbol}0`, icon: <TrendingUp className="h-5 w-5" />, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending Bonus", value: `${settings.currencySymbol}0`, icon: <Gift className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Referral Program</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Earn {settings.currencySymbol}{settings.referralBonus.toLocaleString()} for every friend you refer</p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl category-banner p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-white" />
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-1">{settings.currencySymbol}{settings.referralBonus.toLocaleString()} per referral</h2>
          <p className="text-white/70 text-sm">Your friend also gets {settings.currencySymbol}{settings.referralBonus.toLocaleString()} when they sign up!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4 text-center">
            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral code */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <h3 className="font-semibold mb-3">Your Referral Code</h3>
        <div className="flex gap-2 mb-3">
          <code className="flex-1 px-4 py-3 bg-muted rounded-xl font-mono font-bold text-primary text-lg text-center border border-border">
            {user.referralCode}
          </code>
          <button onClick={() => copy(user.referralCode, "Referral code")} className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <Copy className="h-4 w-4" />Copy
          </button>
        </div>

        <h3 className="font-semibold mb-2 text-sm">Your Referral Link</h3>
        <div className="flex gap-2">
          <input value={referralLink} readOnly className="flex-1 px-3 py-2 bg-muted rounded-lg text-xs font-mono text-muted-foreground border border-border" />
          <button onClick={() => copy(referralLink, "Referral link")} className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button onClick={share} className="w-full h-12 text-base font-semibold gap-2">
        <Share2 className="h-5 w-5" />Share & Earn
      </Button>

      {/* How it works */}
      <div className="mt-6 bg-card border border-card-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: "1", title: "Share your code", desc: "Share your referral link or code with friends" },
            { step: "2", title: "Friend signs up", desc: "Your friend creates an account using your code" },
            { step: "3", title: "Both earn bonus", desc: `You both receive ${settings.currencySymbol}${settings.referralBonus.toLocaleString()} in your wallets` },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">{s.step}</div>
              <div>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
