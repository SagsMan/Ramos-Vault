import { useState } from "react";
import { Search, ShieldBan, ShieldCheck, Eye } from "lucide-react";
import { MOCK_USERS } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import type { User } from "../../types";

export default function AdminUsers() {
  const { settings } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(() => {
    const stored = JSON.parse(localStorage.getItem("rv_users") || "[]");
    return [...MOCK_USERS, ...stored.filter((u: User) => !MOCK_USERS.find(m => m.id === u.id))];
  });

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
    toast({ title: "User status updated" });
  };

  const levelColors: Record<string, string> = {
    bronze: "text-orange-400",
    silver: "text-gray-400",
    gold: "text-yellow-400",
    platinum: "text-cyan-400",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold">Users</h1><p className="text-sm text-muted-foreground">{users.length} registered users</p></div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by username or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">USER</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ROLE</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">BALANCE</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">LEVEL</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">JOINED</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{user.username}</p>
                          {user.verified && <ShieldCheck className="h-3 w-3 text-blue-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs capitalize">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{settings.currencySymbol}{user.balance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium capitalize ${levelColors[user.loyaltyLevel]}`}>{user.loyaltyLevel}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.status === "active" ? "bg-green-500/10 text-green-500" :
                      user.status === "banned" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      {user.role !== "admin" && (
                        <button onClick={() => toggleBan(user.id)} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title={user.status === "banned" ? "Unban" : "Ban"}>
                          <ShieldBan className={`h-3.5 w-3.5 ${user.status === "banned" ? "text-green-500" : "text-destructive"}`} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
