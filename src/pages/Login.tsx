import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Login failed");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto lg:mx-0 w-full">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center mb-8">
            <img src="/logo-horizontal.png" alt="RamosVault" className="h-9 w-auto dark:invert" />
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to access your RamosVault account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required data-testid="input-email" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" data-testid="input-password" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading} data-testid="button-signin">
            {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" /> : "Sign In →"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Demo accounts</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setEmail("user@ramosvault.com"); setPassword("demo123"); }}
              className="px-3 py-2 text-xs rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors">
              User Demo
            </button>
            <button type="button" onClick={() => { setEmail("admin@ramosvault.com"); setPassword("admin123"); }}
              className="px-3 py-2 text-xs rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors">
              Admin Demo
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/register" className="text-primary hover:underline" data-testid="link-register">Register</Link>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-forgot">Forgot Password?</Link>
        </div>
      </div>

      {/* Right: Promo panel */}
      <div className="hidden lg:flex flex-1 category-banner flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white" />
        </div>
        <div className="relative text-center text-white max-w-sm">
          <img src="/logo-gold.jpeg" alt="RamosVault" className="w-64 mx-auto mb-6 rounded-2xl object-contain" />
          <p className="text-white/80 mb-2 font-medium">Secure. Fast. Reliable.</p>
          <p className="text-white/60 text-sm mb-8">Access premium digital accounts trusted by 100K+ users worldwide.</p>
          <div className="space-y-3">
            {[{v:"100K+",l:"Active Users"},{v:"14.9M+",l:"Accounts Sold"},{v:"256-bit",l:"SSL Encryption"}].map(s=>(
              <div key={s.l} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3 text-left">
                <span className="text-white font-bold">{s.v}</span>
                <span className="text-white/70 text-sm">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
