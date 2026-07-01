import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { MOCK_USERS } from "../data/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, referralCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("rv_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem("rv_user"); }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) return { success: false, error: "Invalid email or password" };
    if (password.length < 4) return { success: false, error: "Invalid email or password" };
    // Get latest user data from localStorage (to preserve balance changes)
    const storedUsers = JSON.parse(localStorage.getItem("rv_users") || "[]");
    const latestUser = storedUsers.find((u: User) => u.id === found.id) || found;
    const updated = { ...latestUser, lastLogin: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem("rv_user", JSON.stringify(updated));
    return { success: true };
  };

  const register = async (username: string, email: string, _password: string, referralCode?: string) => {
    await new Promise(r => setTimeout(r, 800));
    const existingUsers = JSON.parse(localStorage.getItem("rv_users") || "[]");
    if (existingUsers.find((u: User) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      username,
      email,
      role: "user",
      balance: referralCode ? 500 : 0,
      currency: "NGN",
      verified: false,
      status: "active",
      referralCode: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      loyaltyPoints: 0,
      loyaltyLevel: "bronze",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    existingUsers.push(newUser);
    localStorage.setItem("rv_users", JSON.stringify(existingUsers));
    setUser(newUser);
    localStorage.setItem("rv_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rv_user");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("rv_user", JSON.stringify(updated));
    // Also update in users list
    const storedUsers = JSON.parse(localStorage.getItem("rv_users") || "[]");
    const idx = storedUsers.findIndex((u: User) => u.id === updated.id);
    if (idx >= 0) storedUsers[idx] = updated;
    else storedUsers.push(updated);
    localStorage.setItem("rv_users", JSON.stringify(storedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
