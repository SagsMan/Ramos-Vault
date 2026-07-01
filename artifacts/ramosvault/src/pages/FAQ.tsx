import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I place an order?", a: "Browse products, click 'Buy', and confirm the purchase. The account credentials will appear immediately in your Orders page after payment." },
  { q: "What payment methods do you accept?", a: "We accept bank transfers, debit/credit cards, cryptocurrency (USDT, BTC), and mobile money. Choose your preferred method when adding funds." },
  { q: "How quickly will I receive my order?", a: "Orders are processed instantly after your wallet is charged. Credentials appear in your Orders dashboard within seconds." },
  { q: "Are the accounts guaranteed to work?", a: "Yes! All accounts are tested before listing. If an account doesn't work, contact support within 24 hours and we'll replace it." },
  { q: "What is the minimum deposit amount?", a: "The minimum deposit is ₦100. You can add any amount above that to your wallet." },
  { q: "Can I get a refund if an account doesn't work?", a: "Yes, if an account doesn't work as described, open a support ticket and we'll refund you or provide a replacement within 24 hours." },
  { q: "How do I use a VPN account?", a: "Download the corresponding VPN app (HMA, NordVPN, ExpressVPN etc.), then login with the credentials provided in your order." },
  { q: "What does 'Use 2FA' mean?", a: "Some accounts require Two-Factor Authentication. The login mail is included in your credentials — use it to receive the verification code." },
  { q: "How does the referral program work?", a: "Share your referral code with friends. When they register and use your code, you both receive a bonus of ₦500 added to your wallets." },
  { q: "What are loyalty points?", a: "You earn loyalty points on every purchase. Points determine your membership level (Bronze → Silver → Gold → Platinum), unlocking better deals." },
  { q: "How do I contact support?", a: "Open a support ticket from your dashboard, message us on WhatsApp, or email support@ramosvault.com." },
  { q: "Is my payment information secure?", a: "Absolutely. We use 256-bit SSL encryption and never store card information on our servers. All transactions are processed securely." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about RamosVault</p>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              data-testid={`faq-${i}`}
            >
              <span className="font-medium text-sm">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border/50 pt-3 animate-fade-in-up">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center p-6 bg-primary/5 border border-primary/20 rounded-2xl">
        <h2 className="font-bold mb-2">Still have questions?</h2>
        <p className="text-sm text-muted-foreground mb-4">Our support team is available 24/7 to help you</p>
        <div className="flex gap-2 justify-center">
          <a href="https://wa.me/+2348000000000" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
            WhatsApp
          </a>
          <a href="mailto:support@ramosvault.com"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
