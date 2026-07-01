import { useState } from "react";
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import type { Category } from "../../types";

const EMPTY: Omit<Category, "id"> = { name: "", slug: "", icon: "Package", color: "#1877F2", description: "", enabled: true, order: 99 };

export default function AdminCategories() {
  const { categories, products, updateCategory, addCategory, deleteCategory } = useApp();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Category, "id">>(EMPTY);

  const up = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (c: Category) => { const { id: _id, ...rest } = c; setForm(rest); setEditId(c.id); setShowForm(true); };
  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };

  const handleSave = () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (editId) updateCategory(editId, { ...form, slug: form.slug || slug });
    else addCategory({ ...form, slug: form.slug || slug });
    setShowForm(false);
    toast({ title: editId ? "Category updated!" : "Category added!" });
  };

  const handleDelete = (id: string, name: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) { toast({ title: "Cannot delete", description: "Remove all products in this category first", variant: "destructive" }); return; }
    if (confirm(`Delete category "${name}"?`)) { deleteCategory(id); toast({ title: "Deleted" }); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold">Categories</h1><p className="text-sm text-muted-foreground">{categories.length} categories</p></div>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" />Add Category</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editId ? "Edit" : "Add"} Category</h2>
            <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category Name *</Label>
              <Input value={form.name} onChange={e => up("name", e.target.value)} placeholder="e.g. Facebook" data-testid="input-category-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => up("slug", e.target.value)} placeholder="e.g. facebook (auto-generated)" />
            </div>
            <div className="space-y-1.5">
              <Label>Color (hex)</Label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => up("color", e.target.value)} className="w-10 h-10 rounded border border-input cursor-pointer" />
                <Input value={form.color} onChange={e => up("color", e.target.value)} placeholder="#1877F2" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" value={form.order} onChange={e => up("order", parseInt(e.target.value) || 99)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => up("description", e.target.value)} placeholder="Short category description" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={e => up("enabled", e.target.checked)} />
              <span className="text-sm">Enabled</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} data-testid="button-save-category">{editId ? "Update" : "Add"} Category</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">PRODUCTS</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">ORDER</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">ENABLED</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.sort((a, b) => a.order - b.order).map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <tr key={cat.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{count}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{cat.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => updateCategory(cat.id, { enabled: !cat.enabled })}>
                      {cat.enabled ? <ToggleRight className="h-5 w-5 text-green-500 mx-auto" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground mx-auto" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Edit2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
