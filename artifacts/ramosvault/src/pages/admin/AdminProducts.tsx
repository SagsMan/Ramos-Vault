import { useState } from "react";
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import type { Product } from "../../types";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  image: "",
  status: "available",
  featured: false,
  enabled: true,
  createdAt: new Date().toISOString().split("T")[0],
};

export default function AdminProducts() {
  const { products, categories, updateProduct, addProduct, deleteProduct, settings } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

  const filtered = products.filter(p =>
    (catFilter === "all" || p.categoryId === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); };
  const openEdit = (p: Product) => { const { id: _id, ...rest } = p; setForm(rest); setEditId(p.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.categoryId || !form.price) { toast({ title: "Fill all required fields", variant: "destructive" }); return; }
    if (editId) updateProduct(editId, form);
    else addProduct(form);
    setShowForm(false);
    toast({ title: editId ? "Product updated!" : "Product added!" });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) { deleteProduct(id); toast({ title: "Product deleted" }); }
  };

  const up = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold">Products</h1><p className="text-sm text-muted-foreground">{products.length} total products</p></div>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" />Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editId ? "Edit" : "Add"} Product</h2>
            <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={e => up("name", e.target.value)} placeholder="Full product name" data-testid="input-product-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.categoryId} onValueChange={v => up("categoryId", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price ({settings.currencySymbol}) *</Label>
              <Input type="number" value={form.price || ""} onChange={e => up("price", parseFloat(e.target.value) || 0)} placeholder="0" data-testid="input-product-price" />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity (pcs)</Label>
              <Input type="number" value={form.quantity || ""} onChange={e => up("quantity", parseInt(e.target.value) || 0)} placeholder="0" data-testid="input-product-qty" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => up("status", v as "available" | "sold_out")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <textarea className="w-full h-20 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" value={form.description} onChange={e => up("description", e.target.value)} placeholder="Product description" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => up("featured", e.target.checked)} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.enabled} onChange={e => up("enabled", e.target.checked)} />
                <span className="text-sm">Enabled</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} data-testid="button-save-product">{editId ? "Update" : "Add"} Product</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PRODUCT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">PRICE</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">QTY</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cat = categories.find(c => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{p.name}</p>
                        {p.featured && <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full">Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{cat?.name}</td>
                    <td className="px-4 py-3 text-right font-bold">{settings.currencySymbol}{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${p.quantity === 0 ? "text-red-500" : "text-green-500"}`}>{p.quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => updateProduct(p.id, { enabled: !p.enabled })} className="transition-colors">
                        {p.enabled ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Edit2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
