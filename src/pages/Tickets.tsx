import { useState } from "react";
import { MessageCircle, Plus, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import type { SupportTicket } from "../types";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open:        { label: "Open",        color: "bg-blue-500/10 text-blue-500",   icon: <AlertCircle className="h-3.5 w-3.5" /> },
  in_progress: { label: "In Progress", color: "bg-amber-500/10 text-amber-500", icon: <Clock className="h-3.5 w-3.5" /> },
  resolved:    { label: "Resolved",    color: "bg-green-500/10 text-green-500", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  closed:      { label: "Closed",      color: "bg-muted text-muted-foreground", icon: <CheckCircle className="h-3.5 w-3.5" /> },
};

export default function Tickets() {
  const { user } = useAuth();
  const { tickets, createTicket, replyTicket } = useApp();
  const { toast } = useToast();
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return <div className="flex items-center justify-center min-h-96 text-muted-foreground">Please sign in</div>;

  const userTickets = tickets.filter(t => t.userId === user.id || user.role === "admin");

  const handleCreate = async () => {
    if (!form.subject || !form.message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    createTicket(form.subject, form.message, form.priority);
    setSubmitting(false);
    setShowNew(false);
    setForm({ subject: "", message: "", priority: "medium" });
    toast({ title: "Ticket created!", description: "Our team will respond within 24 hours" });
  };

  const handleReply = async () => {
    if (!reply || !selected) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    replyTicket(selected.id, reply);
    setReply("");
    setSubmitting(false);
    toast({ title: "Reply sent!" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{userTickets.length} tickets</p>
        </div>
        <Button onClick={() => { setShowNew(true); setSelected(null); }} size="sm">
          <Plus className="h-4 w-4 mr-1" />New Ticket
        </Button>
      </div>

      {showNew && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 animate-fade-in-up">
          <h2 className="font-semibold mb-4">Create Support Ticket</h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input placeholder="What's your issue?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} data-testid="input-subject" />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <textarea
                className="w-full h-28 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Describe your issue in detail..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                data-testid="input-message"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={submitting || !form.subject || !form.message}>
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Ticket list */}
        <div className="space-y-2">
          {userTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card border border-card-border rounded-xl">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tickets yet</p>
              <Button size="sm" className="mt-3" onClick={() => setShowNew(true)}>Create First Ticket</Button>
            </div>
          ) : userTickets.map(ticket => {
            const cfg = STATUS_CONFIG[ticket.status];
            return (
              <div key={ticket.id} onClick={() => { setSelected(ticket); setShowNew(false); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/30 ${selected?.id === ticket.id ? "border-primary bg-primary/5" : "border-card-border bg-card"}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{ticket.subject}</p>
                  <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>
                    {cfg.icon}{cfg.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{ticket.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{ticket.id}</span>
                  <span>{ticket.replies.length} replies</span>
                  <span className="ml-auto">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thread view */}
        {selected && (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-4 border-b border-border">
              <p className="font-semibold text-sm">{selected.subject}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.id} · {new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-xs font-medium text-muted-foreground mb-1">{user.username}</p>
                <p className="text-sm">{selected.message}</p>
              </div>
              {selected.replies.map(r => (
                <div key={r.id} className={`p-3 rounded-xl ${r.isAdmin ? "bg-primary/10 border border-primary/20 ml-4" : "bg-muted/50 mr-4"}`}>
                  <p className={`text-xs font-medium mb-1 ${r.isAdmin ? "text-primary" : "text-muted-foreground"}`}>
                    {r.isAdmin ? "Support Team" : r.username}
                  </p>
                  <p className="text-sm">{r.message}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." onKeyDown={e => e.key === "Enter" && handleReply()} data-testid="input-reply" />
              <Button size="sm" onClick={handleReply} disabled={!reply || submitting}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
