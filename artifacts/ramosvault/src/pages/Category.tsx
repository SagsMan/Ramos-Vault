import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Filter, SortAsc } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/products/ProductCard";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function Category() {
  const [, params] = useRoute("/category/:slug");
  const [, navigate] = useLocation();
  const { categories, products } = useApp();
  const [sort, setSort] = useState("default");
  const [filter, setFilter] = useState("all");

  const category = categories.find(c => c.slug === params?.slug);
  if (!category) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <p className="text-muted-foreground">Category not found</p>
      <Button onClick={() => navigate("/")} variant="outline">Go Home</Button>
    </div>
  );

  let catProducts = products.filter(p => p.categoryId === category.id && p.enabled);

  if (filter === "available") catProducts = catProducts.filter(p => p.status === "available");
  if (filter === "sold_out") catProducts = catProducts.filter(p => p.status === "sold_out");
  if (filter === "featured") catProducts = catProducts.filter(p => p.featured);

  if (sort === "price_asc") catProducts = [...catProducts].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") catProducts = [...catProducts].sort((a, b) => b.price - a.price);
  if (sort === "qty_asc") catProducts = [...catProducts].sort((a, b) => a.quantity - b.quantity);
  if (sort === "qty_desc") catProducts = [...catProducts].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold">{category.name}</h1>
          <p className="text-xs text-muted-foreground">{catProducts.length} products available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">In Stock</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 text-xs w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="qty_desc">Most Stock</SelectItem>
              <SelectItem value="qty_asc">Least Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex gap-1">
          {["all","available","sold_out"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              {f === "all" ? "All" : f === "available" ? "In Stock" : "Sold Out"}
            </button>
          ))}
        </div>
      </div>

      {catProducts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-sm">Try a different filter or check back later</p>
        </div>
      ) : (
        <div className="space-y-2">
          {catProducts.map(p => <ProductCard key={p.id} product={p} category={category} />)}
        </div>
      )}
    </div>
  );
}
