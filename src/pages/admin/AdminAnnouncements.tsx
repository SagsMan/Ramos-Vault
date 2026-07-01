import { useState } from "react";
import { Plus, Edit2, Trash2, X, Megaphone, ToggleLeft, ToggleRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import type { Announcement } from "../../types";

const EMPTY: Omit<Announcement, "id"> = { title: "", content: "", type: "info", enabled: true, createdAt: new Date().toISOString().split("T")[0] };

const TYPE_COLORS: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-500",
  warning: "bg-amber-500/10 text-amber-500",
  success: "bg-green-500/10 text-green-500",
};

export default function AdminAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Announcement, "id">>(EMPTY);

  const up = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));
  const openEdit = (a: Announcement) => { const { id: _id, ...rest } = a; setForm(rest); setEditId(a.id); setShowForm(true); };
  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };

  const handleSave = () => {
    if (!form.title || !form.content) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    if (editId) updateAnnouncement(editId, form);
    else addAnnouncement(form);
    setShowForm(false);
    toast({ title: editId ? "Updated!" : "Announcement added!" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold">Announcements</h1><p className="text-sm text-muted-foreground">Shown in the top banner on all pages</p></div>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editId ? "Edit" : "Add"} Announcement</h2>
            <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => up("title", e.target.value)} placeholder="e.g. New stock dropped!" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => up("type", v as Announcement["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info (Blue)</SelectItem>
                    <SelectItem value="warning">Warning (Amber)</SelectItem>
                    <SelectItem value="success">Success (Green)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Input value={form.content} onChange={e => up("content", e.target.value)} placeholder="Announcement message shown to users..." />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={e => up("enabled", e.target.checked)} />
              <span className="text-sm">Active (show to users)</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-card-border rounded-xl">
            <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No announcements yet</p>
          </div>
        ) : announcements.map(a => (
          <div key={a.id} className={`rounded-xl border p-4 flex items-start gap-3 ${TYPE_COLORS[a.type]} border-current/20`}>
            <Megaphone className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm opacity-80 mt-0.5">{a.content}</p>
              <p className="text-xs opacity-60 mt-1">{a.createdAt} · {a.enabled ? "Active" : "Inactive"}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => updateAnnouncement(a.id, { enabled: !a.enabled })}>
                {a.enabled ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 opacity-50" />}
              </button>
              <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-black/10 rounded"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) { deleteAnnouncement(a.id); toast({ title: "Deleted" }); } }} className="p-1.5 hover:bg-black/10 rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
