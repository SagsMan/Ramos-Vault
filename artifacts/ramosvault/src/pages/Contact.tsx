import { useState } from "react";
import { MessageCircle, Mail, Send, CheckCircle, Phone } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/use-toast";

export default function Contact() {
  const { settings } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast({ title: "Message sent!", description: "We'll respond within 24 hours" });
  };

  const contacts = [
    { icon: <MessageCircle className="h-5 w-5" />, label: "WhatsApp", value: "Click to chat", href: settings.whatsappLink, color: "text-green-500", bg: "bg-green-500/10" },
    { icon: <SiTelegram className="h-5 w-5" />, label: "Telegram", value: "@ramosvault", href: settings.telegramLink, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: settings.supportEmail, href: `mailto:${settings.supportEmail}`, color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: <Phone className="h-5 w-5" />, label: "Response Time", value: "Within 24 hours", href: null, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">We're here to help — reach out anytime</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact info */}
        <div>
          <h2 className="font-semibold mb-4">Get in Touch</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {contacts.map(c => (
              <div key={c.label} className={`flex items-start gap-3 p-4 rounded-xl border border-border ${c.bg}`}>
                <span className={c.color}>{c.icon}</span>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium ${c.color} hover:underline`}>{c.value}</a>
                  ) : (
                    <p className="text-sm font-medium">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h3 className="font-semibold mb-2">Business Hours</h3>
            <div className="space-y-1.5 text-sm">
              {[["Monday - Friday", "9:00 AM – 10:00 PM WAT"], ["Saturday", "10:00 AM – 8:00 PM WAT"], ["Sunday", "12:00 PM – 6:00 PM WAT"]].map(([day, hrs]) => (
                <div key={day} className="flex justify-between">
                  <span className="text-muted-foreground">{day}</span>
                  <span className="font-medium">{hrs}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">For urgent issues, WhatsApp us anytime — we monitor 24/7.</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-card border border-card-border rounded-xl p-5">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-bold text-lg mb-2">Message Sent!</h2>
              <p className="text-sm text-muted-foreground mb-4">We'll respond within 24 hours to {form.email}</p>
              <Button onClick={() => setSent(false)} variant="outline">Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="font-semibold mb-3">Send a Message</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Your Name</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's your question?" required />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <textarea
                  className="w-full h-32 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your issue or question in detail..."
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : <><Send className="h-4 w-4" />Send Message</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
