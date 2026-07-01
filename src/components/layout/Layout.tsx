import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SearchModal from "../shared/SearchModal";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("rv_theme") || "dark");
  const { announcements } = useApp();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const activeAnnouncement = announcements.find(a => a.enabled);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rv_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setSidebarOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const announcementColors: Record<string, string> = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    success: "bg-green-500/10 border-green-500/30 text-green-400",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarOpen(o => !o)}
          theme={theme}
          onThemeToggle={toggleTheme}
          onSearchOpen={() => setSearchOpen(true)}
        />
        {activeAnnouncement && !announcementDismissed && (
          <div className={`flex items-center gap-2 px-4 py-2 border-b text-sm ${announcementColors[activeAnnouncement.type]} border-border`}>
            <span className="flex-1">{activeAnnouncement.content}</span>
            <button onClick={() => setAnnouncementDismissed(true)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
