import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiTelegram, SiGmail } from "react-icons/si";
import { Shield, Package, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useLocation } from "wouter";
import { useToast } from "../../hooks/use-toast";
import type { Product, Category } from "../../types";

interface ProductCardProps { product: Product; category?: Category; }

const categoryIconMap: Record<string, React.ReactNode> = {
  "cat-1": <SiFacebook className="h-5 w-5" style={{ color: "#1877F2" }} />,
  "cat-2": <SiInstagram className="h-5 w-5" style={{ color: "#E1306C" }} />,
  "cat-3": <SiTiktok className="h-5 w-5" />,
  "cat-4": <SiX className="h-5 w-5" />,
  "cat-5": <SiTelegram className="h-5 w-5" style={{ color: "#26A5E4" }} />,
  "cat-6": <Shield className="h-5 w-5 text-green-500" />,
  "cat-7": <SiGmail className="h-5 w-5" style={{ color: "#EA4335" }} />,
  "cat-8": <SiFacebook className="h-5 w-5" style={{ color: "#A855F7" }} />,
  "cat-9": <SiFacebook className="h-5 w-5" style={{ color: "#1877F2" }} />,
  "cat-10": <Package className="h-5 w-5 text-amber-500" />,
  "cat-11": <Globe className="h-5 w-5 text-sky-500" />,
  "cat-12": <Package className="h-5 w-5 text-violet-500" />,
};

export default function ProductCard({ product, category }: ProductCardProps) {
  const { user } = useAuth();
  const { placeOrder, settings } = useApp();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(false);

  const handleBuy = async () => {
    if (!user) { navigate("/login"); return; }
    setBuying(true);
    await new Promise(r => setTimeout(r, 700));
    const result = placeOrder(product.id, 1);
    setBuying(false);
    if (result.success) {
      setBought(true);
      toast({ title: "Order placed!", description: "Check My Orders for your credentials.", variant: "default" });
      setTimeout(() => setBought(false), 3000);
    } else {
      toast({ title: "Order failed", description: result.error, variant: "destructive" });
    }
  };

  const isSoldOut = product.status === "sold_out" || product.quantity === 0;
  const icon = category ? (categoryIconMap[category.id] || <Package className="h-5 w-5" />) : <Package className="h-5 w-5" />;

  return (
    <div className="flex items-start gap-3 p-4 bg-card border border-card-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group" data-testid={`card-product-${product.id}`}>
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-2 mb-2">{product.name}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className={`text-xs font-semibold px-2 ${isSoldOut ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
            {product.quantity} pcs
          </Badge>
          <span className="text-sm font-bold">{settings.currencySymbol}{product.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        {isSoldOut ? (
          <Button variant="outline" size="sm" disabled className="text-xs opacity-50">Sold</Button>
        ) : (
          <Button
            size="sm"
            onClick={handleBuy}
            disabled={buying || bought}
            className="text-xs font-semibold min-w-[60px]"
            data-testid={`button-buy-${product.id}`}
          >
            {bought ? <Check className="h-3.5 w-3.5" /> : buying ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : <><ShoppingCart className="h-3 w-3 mr-1" />Buy</>}
          </Button>
        )}
      </div>
    </div>
  );
}
