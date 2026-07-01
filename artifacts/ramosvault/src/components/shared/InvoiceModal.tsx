import { useRef, useState } from "react";
import { X, Download, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "../ui/button";
import type { Order } from "../../types";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const { settings } = useApp();
  const { user } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<"pdf" | "image" | null>(null);

  const exportAsImage = async () => {
    setExporting("image");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(invoiceRef.current!, {
        scale: 2,
        backgroundColor: "#0D1B2A",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `RamosVault-Invoice-${order.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(null);
    }
  };

  const exportAsPDF = async () => {
    setExporting("pdf");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(invoiceRef.current!, {
        scale: 2,
        backgroundColor: "#0D1B2A",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`RamosVault-Invoice-${order.id}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  const now = new Date();
  const orderDate = new Date(order.createdAt);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>

        {/* Action buttons */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={exportAsPDF}
              disabled={!!exporting}
              className="gap-1.5 text-xs h-8"
            >
              {exporting === "pdf"
                ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                : <FileText className="h-3.5 w-3.5" />}
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportAsImage}
              disabled={!!exporting}
              className="gap-1.5 text-xs h-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {exporting === "image"
                ? <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                : <ImageIcon className="h-3.5 w-3.5" />}
              Save Image
            </Button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Invoice */}
        <div ref={invoiceRef} className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1B2B4B 100%)", fontFamily: "'Inter', sans-serif" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #1B2B4B 0%, #0D1B2A 100%)", borderBottom: "1px solid rgba(201,168,76,0.3)", padding: "28px 28px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #C9A84C, #E8C97A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "bold", color: "#0D1B2A" }}>R</div>
                <div>
                  <p style={{ color: "#E8C97A", fontWeight: "800", fontSize: "20px", margin: 0 }}>RamosVault</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "2px 0 0" }}>Secure. Fast. Reliable.</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#E8C97A", fontWeight: "700", fontSize: "18px", margin: 0 }}>RECEIPT</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "4px 0 0", fontFamily: "monospace" }}>{order.id}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "2px 0 0" }}>
                  {now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 28px" }}>
            {/* Divider with "INVOICE DETAILS" */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.2)" }} />
              <p style={{ color: "rgba(201,168,76,0.6)", fontSize: "10px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>Order Details</p>
              <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.2)" }} />
            </div>

            {/* Customer & Order info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Customer</p>
                <p style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 2px" }}>{user?.username || "Customer"}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "0 0 2px" }}>{user?.email}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace", margin: 0 }}>Ref: {user?.referralCode}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Order Info</p>
                <p style={{ color: "white", fontWeight: "600", fontSize: "13px", margin: "0 0 2px" }}>{order.categoryName}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "0 0 2px" }}>Qty: {order.quantity} unit{order.quantity > 1 ? "s" : ""}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: 0 }}>{orderDate.toLocaleString()}</p>
              </div>
            </div>

            {/* Product row */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "8px", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["ITEM", "QTY", "PRICE"].map(h => (
                  <p key={h} style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: 0, textAlign: h !== "ITEM" ? "right" : "left" }}>{h}</p>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "8px", padding: "12px 14px" }}>
                <p style={{ color: "white", fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{order.productName}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0, textAlign: "right", minWidth: "30px" }}>×{order.quantity}</p>
                <p style={{ color: "#E8C97A", fontWeight: "700", fontSize: "14px", margin: 0, textAlign: "right", minWidth: "80px" }}>
                  {settings.currencySymbol}{(order.totalPrice / order.quantity).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Total */}
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: 0 }}>Subtotal</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>{settings.currencySymbol}{order.totalPrice.toLocaleString()}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: 0 }}>Fee</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>{settings.currencySymbol}0</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,201,122,0.1))", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(201,168,76,0.25)", marginTop: "8px" }}>
                <p style={{ color: "#E8C97A", fontWeight: "700", fontSize: "14px", margin: 0 }}>TOTAL PAID</p>
                <p style={{ color: "#E8C97A", fontWeight: "800", fontSize: "16px", margin: 0 }}>{settings.currencySymbol}{order.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Status badge */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "20px", padding: "6px 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
                <p style={{ color: "#22C55E", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                  {order.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0 }}>ramosvault.com</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0 }}>support@ramosvault.com</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0 }}>Thank you! 🙏</p>
          </div>
        </div>
      </div>
    </div>
  );
}
