import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, Package } from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Product, Category } from "../../types";

interface SearchModalProps { open: boolean; onClose: () => void; }

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { products, categories, settings } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); }
    else setQuery("");
  }, [open]);

  const results = query.trim().length > 1
    ? products.filter(p => p.enabled && (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )).slice(0, 8)
    : [];

  const catResults = query.trim().length > 1
    ? categories.filter(c => c.enabled && c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "";

  const handleProductClick = (p: Product) => {
    navigate(`/category/${categories.find(c => c.id === p.categoryId)?.slug || ""}`);
    onClose();
  };

  const handleCategoryClick = (c: Category) => {
    navigate(`/category/${c.slug}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            data-testid="input-search"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <kbd className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">Type to search products and categories</div>
          ) : results.length === 0 && catResults.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">No results for "{query}"</div>
          ) : (
            <>
              {catResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">Categories</div>
                  {catResults.map(c => (
                    <button key={c.id} onClick={() => handleCategoryClick(c)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">Products</div>
                  {results.map(p => (
                    <button key={p.id} onClick={() => handleProductClick(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{getCategoryName(p.categoryId)}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-primary">{settings.currencySymbol}{p.price.toLocaleString()}</p>
                        <p className={`text-xs ${p.status === "available" ? "text-green-500" : "text-muted-foreground"}`}>
                          {p.status === "available" ? `${p.quantity} pcs` : "Sold Out"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
