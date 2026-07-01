import { useState } from "react";
import { Link } from "wouter";
import { ShieldCheck, Mail, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">RamosVault</span>
          </Link>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-1 text-sm">Enter your email to receive reset instructions</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-bold text-lg mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-6">We sent a reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.</p>
              <Link href="/login"><Button className="w-full">Back to Sign In</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email Address</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required data-testid="input-email" />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remember your password? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
