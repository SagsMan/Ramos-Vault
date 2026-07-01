import { useState } from "react";
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight, Image } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import type { Banner } from "../../types";

const EMPTY: Omit<Banner, "id"> = { title: "", description: "", image: "", link: "/", enabled: true, order: 99, createdAt: new Date().toISOString().split("T")[0] };

export default function AdminBanners() {
  const { banners, updateBanner, addBanner, deleteBanner } = useApp();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(EMPTY);

  const up = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));
  const openEdit = (b: Banner) => { const { id: _id, ...rest } = b; setForm(rest); setEditId(b.id); setShowForm(true); };
  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };

  const handleSave = () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    if (editId) updateBanner(editId, form);
    else addBanner(form);
    setShowForm(false);
    toast({ title: editId ? "Banner updated!" : "Banner added!" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold">Banners</h1><p className="text-sm text-muted-foreground">{banners.length} banners</p></div>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" />Add Banner</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editId ? "Edit" : "Add"} Banner</h2>
            <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => up("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Link URL</Label>
              <Input value={form.link} onChange={e => up("link", e.target.value)} placeholder="/" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => up("description", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={e => up("image", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" value={form.order} onChange={e => up("order", parseInt(e.target.value) || 99)} />
            </div>
            <label className="flex items-center gap-2 self-end cursor-pointer pb-2">
              <input type="checkbox" checked={form.enabled} onChange={e => up("enabled", e.target.checked)} />
              <span className="text-sm">Enabled</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editId ? "Update" : "Add"} Banner</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {banners.sort((a, b) => a.order - b.order).map(b => (
          <div key={b.id} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover rounded-lg" /> : <Image className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{b.title}</p>
              <p className="text-sm text-muted-foreground truncate">{b.description}</p>
              <p className="text-xs text-muted-foreground">{b.link} · Order #{b.order}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateBanner(b.id, { enabled: !b.enabled })}>
                {b.enabled ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
              </button>
              <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-muted rounded-lg"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("Delete banner?")) { deleteBanner(b.id); toast({ title: "Deleted" }); } }} className="p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4 text-destructive" /></button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border border-card-border rounded-xl">
            <Image className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No banners yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
