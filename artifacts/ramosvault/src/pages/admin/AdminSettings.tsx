import { useState } from "react";
import { Settings, Globe, MessageCircle, DollarSign, Gift, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...settings });
  const [tab, setTab] = useState("general");

  const up = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Settings saved!" });
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="h-4 w-4" /> },
    { id: "social", label: "Social Links", icon: <Globe className="h-4 w-4" /> },
    { id: "finance", label: "Finance", icon: <DollarSign className="h-4 w-4" /> },
    { id: "rewards", label: "Rewards", icon: <Gift className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your RamosVault store</p>
      </div>

      {/* Maintenance mode warning */}
      {form.maintenanceMode && (
        <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">Maintenance mode is ON — users will see a maintenance page</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
        {tab === "general" && (
          <>
            <div className="space-y-1.5">
              <Label>Site Name</Label>
              <Input value={form.siteName} onChange={e => up("siteName", e.target.value)} data-testid="input-site-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Site Description</Label>
              <Input value={form.siteDescription} onChange={e => up("siteDescription", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Support Email</Label>
              <Input type="email" value={form.supportEmail} onChange={e => up("supportEmail", e.target.value)} />
            </div>
            <label className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <div>
                <p className="font-medium text-sm">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Temporarily disable the store for users</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${form.maintenanceMode ? "bg-amber-500" : "bg-muted"}`} onClick={() => up("maintenanceMode", !form.maintenanceMode)}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.maintenanceMode ? "left-7" : "left-1"}`} />
              </div>
            </label>
          </>
        )}

        {tab === "social" && (
          <>
            {[
              { key: "whatsappLink" as const, label: "WhatsApp Link", icon: <MessageCircle className="h-4 w-4 text-green-500" />, placeholder: "https://wa.me/..." },
              { key: "telegramLink" as const, label: "Telegram Link", icon: <Globe className="h-4 w-4 text-blue-500" />, placeholder: "https://t.me/..." },
              { key: "twitterLink" as const, label: "Twitter/X Link", icon: <Globe className="h-4 w-4" />, placeholder: "https://twitter.com/..." },
              { key: "instagramLink" as const, label: "Instagram Link", icon: <Globe className="h-4 w-4 text-pink-500" />, placeholder: "https://instagram.com/..." },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="flex items-center gap-1.5">{f.icon}{f.label}</Label>
                <Input value={form[f.key]} onChange={e => up(f.key, e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </>
        )}

        {tab === "finance" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Currency Symbol</Label>
                <Input value={form.currencySymbol} onChange={e => up("currencySymbol", e.target.value)} placeholder="₦" />
              </div>
              <div className="space-y-1.5">
                <Label>Exchange Rate (per $1 USD)</Label>
                <Input type="number" value={form.exchangeRate} onChange={e => up("exchangeRate", parseFloat(e.target.value) || 1)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Auto-Cancel Orders After (hours)</Label>
              <Input type="number" value={form.autoCancelHours} onChange={e => up("autoCancelHours", parseInt(e.target.value) || 24)} />
            </div>
          </>
        )}

        {tab === "rewards" && (
          <>
            <div className="space-y-1.5">
              <Label>Referral Bonus ({form.currencySymbol})</Label>
              <Input type="number" value={form.referralBonus} onChange={e => up("referralBonus", parseFloat(e.target.value) || 0)} />
              <p className="text-xs text-muted-foreground">Amount credited to both referrer and referee</p>
            </div>
            <div className="space-y-1.5">
              <Label>Cashback Rate (%)</Label>
              <Input type="number" value={form.cashbackRate} onChange={e => up("cashbackRate", parseFloat(e.target.value) || 0)} min="0" max="100" />
              <p className="text-xs text-muted-foreground">Percentage of purchase amount returned as loyalty points</p>
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full" data-testid="button-save-settings">Save Settings</Button>
      </div>
    </div>
  );
}
