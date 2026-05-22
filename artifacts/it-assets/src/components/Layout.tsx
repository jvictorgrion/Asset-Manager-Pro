import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetDashboardSummary } from "@workspace/api-client-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Package },
  { href: "/assets/new", label: "Register Asset", icon: PlusCircle },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: summary } = useGetDashboardSummary();

  const activeCount = summary?.byStatus.find((s) => s.status === "Active")?.count ?? 0;
  const maintenanceCount = summary?.byStatus.find((s) => s.status === "Under Maintenance")?.count ?? 0;

  const STATS = [
    { label: "Total Assets", value: summary?.totalAssets ?? "—", icon: Package, iconColor: "text-blue-400", href: "/assets" },
    { label: "Active", value: activeCount || (summary ? activeCount : "—"), icon: CheckCircle2, iconColor: "text-emerald-400", href: "/assets?status=Active" },
    { label: "Maintenance", value: maintenanceCount || (summary ? maintenanceCount : "—"), icon: Clock, iconColor: "text-amber-400", href: "/assets?status=Under+Maintenance" },
    { label: "Added (7d)", value: summary?.recentlyAdded ?? "—", icon: TrendingUp, iconColor: "text-violet-400", href: "/assets" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* App logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-600/30 border border-blue-500/30">
          <Shield className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-none">IT Assets</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Inventory System</p>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-1 mb-2">Overview</p>
        <div className="space-y-1">
          {STATS.map((s) => {
            const Icon = s.icon;
            const isActive = location === s.href || (s.href !== "/assets" && location.startsWith(s.href));
            return (
              <Link key={s.label} href={s.href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-blue-600/20 border border-blue-500/30"
                      : "bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${s.iconColor}`} />
                    <span className={`text-xs ${isActive ? "text-blue-300" : "text-slate-400"}`}>{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">{s.value}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Separator className="bg-white/5 mx-3 my-1" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-1 mb-2">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href) && item.href !== "/assets/new");
          const isNew = item.href === "/assets/new";
          const exactActive = isNew ? location === "/assets/new" : isActive;
          return (
            <Link key={item.href} href={item.href}>
              <div
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  exactActive
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {exactActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <Separator className="bg-white/5 mb-3" />
        <div className="px-3 py-1.5 mb-1">
          <p className="text-[10px] text-slate-500 truncate">Signed in as</p>
          <p className="text-xs font-medium text-slate-300 truncate">{user?.email ?? "—"}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          data-testid="button-sign-out"
          onClick={() => signOut()}
          className="w-full justify-start gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-[hsl(222,47%,11%)] border-r border-slate-700/50">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-[hsl(222,47%,11%)] border-r border-slate-700/50 z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">IT Assets</span>
          </div>
          {mobileOpen && (
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
