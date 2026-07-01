import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "", referral: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const [, navigate] = useLocation();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const result = await register(form.username, form.email, form.password, form.referral);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Registration failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">RamosVault</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Join 100,000+ users buying premium accounts</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label>Username</Label>
                <Input placeholder="yourname" value={form.username} onChange={update("username")} required data-testid="input-username" />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} required data-testid="input-email" />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={update("password")} required className="pr-10" data-testid="input-password" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1,2,3,4].map(i => <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-border"}`} />)}
                    </div>
                    <p className="text-xs text-muted-foreground">Strength: <span className="font-medium">{strengthLabel}</span></p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input type="password" placeholder="Repeat your password" value={form.confirm} onChange={update("confirm")} required className="pr-10" data-testid="input-confirm" />
                  {form.confirm && form.password === form.confirm && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Referral Code <span className="text-muted-foreground text-xs">(Optional — earn ₦500 bonus)</span></Label>
                <Input placeholder="Enter referral code" value={form.referral} onChange={update("referral")} data-testid="input-referral" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading} data-testid="button-register">
              {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : "Create Account →"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          By registering you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
