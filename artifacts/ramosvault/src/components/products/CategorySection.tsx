import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiTelegram, SiGmail } from "react-icons/si";
import { Shield, Package, Globe } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Category, Product } from "../../types";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  defaultExpanded?: boolean;
}

const categoryIconMap: Record<string, React.ReactNode> = {
  "cat-1": <SiFacebook className="h-6 w-6 text-white" />,
  "cat-2": <SiInstagram className="h-6 w-6 text-white" />,
  "cat-3": <SiTiktok className="h-6 w-6 text-white" />,
  "cat-4": <SiX className="h-6 w-6 text-white" />,
  "cat-5": <SiTelegram className="h-6 w-6 text-white" />,
  "cat-6": <Shield className="h-6 w-6 text-white" />,
  "cat-7": <SiGmail className="h-6 w-6 text-white" />,
  "cat-8": <SiFacebook className="h-6 w-6 text-white" />,
  "cat-9": <SiFacebook className="h-6 w-6 text-white" />,
  "cat-10": <Package className="h-6 w-6 text-white" />,
  "cat-11": <Globe className="h-6 w-6 text-white" />,
  "cat-12": <Package className="h-6 w-6 text-white" />,
};

const PREVIEW_COUNT = 3;

export default function CategorySection({ category, products, defaultExpanded = false }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const visibleProducts = expanded ? products : products.slice(0, PREVIEW_COUNT);
  const icon = categoryIconMap[category.id] || <Package className="h-6 w-6 text-white" />;

  if (products.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Category Banner */}
      <div className="category-banner rounded-xl p-4 mb-3 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              {icon}
            </div>
            <h2 className="text-white font-bold text-base uppercase tracking-wide">{category.name}</h2>
          </div>
          <Link href={`/category/${category.slug}`}>
            <div className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer group">
              See More
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-2">
        {visibleProducts.map(p => (
          <ProductCard key={p.id} product={p} category={category} />
        ))}
      </div>

      {/* Load more */}
      {products.length > PREVIEW_COUNT && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full mt-3 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
          data-testid={`button-expand-${category.id}`}
        >
          {expanded ? "Show less" : `Load more products (${products.length - PREVIEW_COUNT} more)`}
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "-rotate-90" : "rotate-90"}`} />
        </button>
      )}
    </div>
  );
}
