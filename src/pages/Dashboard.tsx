import { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import ProBadge from "@/components/ProBadge";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Settings,
  Menu,
  X,
  Plus,
  Eye,
  Star,
  TrendingUp,
  Crown,
  Users,
  Briefcase,
} from "lucide-react";

interface DashboardStats {
  totalHustles: number;
  totalVisits: number;
  totalReviews: number;
  averageRating: number;
}

const Dashboard = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { data: subscription } = useSubscription();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalHustles: 0,
    totalVisits: 0,
    totalReviews: 0,
    averageRating: 0,
  });

  const isOverview = location.pathname === "/dashboard";

  // Check for success params
  useEffect(() => {
    if (searchParams.get("subscription") === "success") {
      toast({
        title: "Subscription activated! 🎉",
        description: "Welcome to Pro! Enjoy unlimited features.",
      });
    }
    if (searchParams.get("boost") === "success") {
      toast({
        title: "Boost activated! 🚀",
        description: "Your visibility has been boosted.",
      });
    }
  }, [searchParams, toast]);

  const fetchStats = useCallback(async () => {
    if (!profile?.id) return;

    const { data: hustles } = await supabase
      .from("hustles")
      .select("id")
      .eq("owner_id", profile.id);

    const hustleIds = hustles?.map((h) => h.id) || [];

    const { count: visitsCount } = await supabase
      .from("hustle_visits")
      .select("*", { count: "exact", head: true })
      .in("hustle_id", hustleIds);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .in("hustle_id", hustleIds);

    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    setStats({
      totalHustles: hustles?.length || 0,
      totalVisits: visitsCount || 0,
      totalReviews: reviews?.length || 0,
      averageRating: avgRating,
    });
  }, [profile?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Store, label: "My Hustles", path: "/dashboard/hustles" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  // Add employer-specific nav items
  if (subscription?.planType === "employer") {
    navItems.splice(2, 0, { icon: Users, label: "Applicants", path: "/dashboard/applicants" });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Side Quest"
                className="h-12 w-auto object-contain"
              />
              <span className="font-display text-xl font-bold text-foreground">
                Side Quest
              </span>
            </Link>
          </div>

          {/* Subscription Status */}
          {subscription?.isPro && (
            <div className="px-4 py-3 border-b border-border">
              <ProBadge 
                type={subscription.planType === "employer" ? "employer" : "hustler"} 
                size="default" 
              />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade CTA for non-pro users */}
          {!subscription?.isPro && (
            <div className="p-4 border-t border-border">
              <Link to="/pricing">
                <Button variant="outline" className="w-full mb-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}

          {/* Quick Action */}
          <div className="p-4 border-t border-border">
            <Link to="/dashboard/hustles/new">
              <Button
                className="w-full"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Hustle
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <h1 className="font-display text-xl font-bold text-foreground">
              {isOverview
                ? "Dashboard"
                : navItems.find((i) => i.path === location.pathname)?.label ||
                  "Dashboard"}
            </h1>

            <Link
              to="/explore"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {isOverview ? (
            <div className="space-y-8">
              {/* Welcome */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Welcome back, {profile?.username || "Hustler"}!
                  </h2>
                  <p className="text-muted-foreground">
                    Here's how your hustles are performing.
                  </p>
                </div>
                {subscription?.isPro && (
                  <ProBadge 
                    type={subscription.planType === "employer" ? "employer" : "hustler"} 
                    size="lg" 
                  />
                )}
              </div>

              {/* Usage Stats for non-pro */}
              {!subscription?.isPro && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Free Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription?.usage?.posts_count ?? 0}/{subscription?.limits?.posts ?? 1} hustles created • 
                        {subscription?.usage?.applications_count ?? 0}/{subscription?.limits?.applications ?? 5} applications this month
                      </p>
                    </div>
                    <Link to="/pricing">
                      <Button>
                        <Crown className="w-4 h-4 mr-2" />
                        Go Pro
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat
                  icon={<Store className="w-5 h-5 text-primary" />}
                  value={stats.totalHustles}
                  label="Active Hustles"
                />
                <Stat
                  icon={<Eye className="w-5 h-5 text-accent" />}
                  value={stats.totalVisits}
                  label="Total Visits"
                />
                <Stat
                  icon={<Star className="w-5 h-5 text-primary" />}
                  value={stats.totalReviews}
                  label="Reviews"
                />
                <Stat
                  icon={<TrendingUp className="w-5 h-5 text-accent" />}
                  value={stats.averageRating.toFixed(1)}
                  label="Avg Rating"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/dashboard/hustles/new" className="block">
                  <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
                    <Plus className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Create New Hustle</h3>
                    <p className="text-sm text-muted-foreground">List a new business or service</p>
                  </div>
                </Link>
                <Link to="/dashboard/analytics" className="block">
                  <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
                    <BarChart3 className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">View Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track your performance</p>
                  </div>
                </Link>
                {!subscription?.isPro && (
                  <Link to="/pricing" className="block">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/30 hover:border-primary transition-colors">
                      <Crown className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-1">Upgrade to Pro</h3>
                      <p className="text-sm text-muted-foreground">Unlock unlimited features</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

// Small reusable stat card
const Stat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) => (
  <div className="bg-card rounded-xl p-6 border border-border">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Dashboard;
