import { useState } from "react";
import { User, Mail, Shield, Bell, Key, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("profile");

  if (!user) return <div className="flex items-center justify-center min-h-96 text-muted-foreground">Please sign in</div>;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ username: form.username });
    setSaving(false);
    toast({ title: "Profile updated!" });
  };

  const levelColors: Record<string, string> = {
    bronze: "from-orange-400 to-orange-600",
    silver: "from-gray-300 to-gray-500",
    gold: "from-yellow-400 to-yellow-600",
    platinum: "from-cyan-400 to-cyan-600",
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Profile Settings</h1>

      {/* Profile card */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${levelColors[user.loyaltyLevel]} flex items-center justify-center text-white font-bold text-2xl`}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">{user.username}</p>
              {user.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColors[user.loyaltyLevel]} text-white mt-1 inline-block`}>
              {user.loyaltyLevel} Member
            </span>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Loyalty Points</p>
            <p className="text-2xl font-bold text-primary">{user.loyaltyPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Username</Label>
            <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} data-testid="input-username" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email Address</Label>
            <Input value={form.email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Contact support to change your email</p>
          </div>
          <div className="space-y-1.5">
            <Label>Referral Code</Label>
            <div className="flex gap-2">
              <Input value={user.referralCode} readOnly className="font-mono" />
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(user.referralCode)}>Copy</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Member Since</p>
              <p className="font-medium mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Last Login</p>
              <p className="font-medium mt-0.5">{new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Account Status</span>
            </div>
            <span className="text-xs font-bold text-green-500 uppercase">{user.status}</span>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Key className="h-3.5 w-3.5" />Current Password</Label>
            <Input type="password" placeholder="Enter current password" data-testid="input-current-password" />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" data-testid="input-new-password" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Password</Label>
            <Input type="password" placeholder="Repeat new password" data-testid="input-confirm-password" />
          </div>
          <Button className="w-full" onClick={() => toast({ title: "Password updated!" })}>Update Password</Button>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-3">
          {[
            { label: "Order Updates", desc: "Get notified when your order status changes", default: true },
            { label: "Promotions & Offers", desc: "Receive discount codes and special offers", default: true },
            { label: "New Stock Alerts", desc: "Know when new products are added", default: false },
            { label: "Security Alerts", desc: "Login attempts and account changes", default: true },
          ].map(n => (
            <label key={n.label} className="flex items-start justify-between gap-3 p-3 hover:bg-muted/30 rounded-lg cursor-pointer">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked={n.default} className="mt-0.5" />
            </label>
          ))}
          <Button className="w-full mt-2" onClick={() => toast({ title: "Preferences saved!" })}>Save Preferences</Button>
        </div>
      )}
    </div>
  );
}
