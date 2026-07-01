import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import AddFunds from "./pages/AddFunds";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Tickets from "./pages/Tickets";
import Referral from "./pages/Referral";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!user) { window.location.href = import.meta.env.BASE_URL + "login"; return null; }
  if (adminOnly && user.role !== "admin") { window.location.href = import.meta.env.BASE_URL + "dashboard"; return null; }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />

        <Route path="/dashboard">
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </Route>
        <Route path="/orders">
          <ProtectedRoute><Orders /></ProtectedRoute>
        </Route>
        <Route path="/add-funds">
          <ProtectedRoute><AddFunds /></ProtectedRoute>
        </Route>
        <Route path="/transactions">
          <ProtectedRoute><Transactions /></ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute><Profile /></ProtectedRoute>
        </Route>
        <Route path="/tickets">
          <ProtectedRoute><Tickets /></ProtectedRoute>
        </Route>
        <Route path="/referral">
          <ProtectedRoute><Referral /></ProtectedRoute>
        </Route>

        <Route path="/admin">
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        </Route>
        <Route path="/admin/categories">
          <ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
        </Route>
        <Route path="/admin/orders">
          <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
        </Route>
        <Route path="/admin/banners">
          <ProtectedRoute adminOnly><AdminBanners /></ProtectedRoute>
        </Route>
        <Route path="/admin/announcements">
          <ProtectedRoute adminOnly><AdminAnnouncements /></ProtectedRoute>
        </Route>
        <Route path="/admin/analytics">
          <ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>
        </Route>
        <Route path="/admin/settings">
          <ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>
        </Route>

        <Route>
          <div className="flex flex-col items-center justify-center min-h-96 gap-4 px-4 text-center">
            <p className="text-7xl font-black text-muted/20">404</p>
            <p className="text-lg font-semibold">Page Not Found</p>
            <p className="text-muted-foreground text-sm">The page you're looking for doesn't exist.</p>
            <a href={import.meta.env.BASE_URL} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              Go Home
            </a>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  );
}
