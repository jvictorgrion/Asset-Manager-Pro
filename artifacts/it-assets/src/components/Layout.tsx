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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/20">
          <Shield className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">IT Assets</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-none">Inventory System</p>
        </div>
      </div>

      <Separator className="bg-slate-700/50 mx-4" />

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation</p>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                  exactActive
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {exactActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <Separator className="bg-slate-700/50 mb-3" />
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-slate-500 truncate">Signed in as</p>
          <p className="text-xs font-medium text-slate-300 truncate">{user?.email ?? "—"}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          data-testid="button-sign-out"
          onClick={() => signOut()}
          className="w-full justify-start gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
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
