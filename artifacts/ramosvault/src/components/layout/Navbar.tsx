import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Search, Menu, X, Moon, Sun, Wallet, ChevronDown, LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface NavbarProps {
  onMenuToggle: () => void;
  theme: string;
  onThemeToggle: () => void;
  onSearchOpen: () => void;
}

export default function Navbar({ onMenuToggle, theme, onThemeToggle, onSearchOpen }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount, notifications, markAllNotificationsRead, settings } = useApp();
  const [, navigate] = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = { bronze: "text-orange-400", silver: "text-gray-400", gold: "text-yellow-400", platinum: "text-cyan-400" };
    return colors[level] || "text-gray-400";
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-2 px-4">
        {/* Mobile menu button */}
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors" data-testid="button-menu-toggle">
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo (mobile) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">{settings.siteName}</span>
        </Link>

        {/* Search */}
        <button onClick={onSearchOpen} className="hidden sm:flex flex-1 max-w-md items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors text-sm" data-testid="button-search">
          <Search className="h-4 w-4" />
          <span>Search products, categories...</span>
          <kbd className="ml-auto text-xs bg-background border border-border rounded px-1">⌘K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Search icon mobile */}
          <button onClick={onSearchOpen} className="sm:hidden p-2 rounded-lg hover:bg-accent transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button onClick={onThemeToggle} className="p-2 rounded-lg hover:bg-accent transition-colors" data-testid="button-theme-toggle">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <>
              {/* Balance */}
              <Link href="/add-funds">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 border-primary/30 text-primary hover:bg-primary/10" data-testid="button-balance">
                  <Wallet className="h-4 w-4" />
                  <span className="font-semibold">{settings.currencySymbol}{user.balance.toLocaleString()}</span>
                </Button>
              </Link>

              {/* Notifications */}
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-accent transition-colors" data-testid="button-notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-muted-foreground text-sm">No notifications</div>
                    ) : notifications.slice(0, 8).map(n => (
                      <div key={n.id} className={`px-3 py-2.5 border-b border-border/50 hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary float-right mt-1" />}
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors" data-testid="button-user-menu">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-semibold leading-none">{user.username}</p>
                      <p className={`text-[10px] capitalize ${getLevelColor(user.loyaltyLevel)}`}>{user.loyaltyLevel}</p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                    <p className="font-medium text-foreground">{user.email}</p>
                    <p className="sm:hidden mt-0.5">{settings.currencySymbol}{user.balance.toLocaleString()}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}><User className="h-4 w-4 mr-2" />Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}><Wallet className="h-4 w-4 mr-2" />My Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}><Settings className="h-4 w-4 mr-2" />Profile Settings</DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}><ShieldCheck className="h-4 w-4 mr-2 text-primary" />Admin Panel</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
