const STATS = [
  { label: "Total Assets", value: 8, sub: "+8 this week", icon: "📦", bar: 100, color: "from-blue-600 to-blue-400" },
  { label: "Active", value: 6, sub: "75% of total", icon: "✅", bar: 75, color: "from-emerald-600 to-emerald-400" },
  { label: "Maintenance", value: 1, sub: "1 asset affected", icon: "🔧", bar: 12, color: "from-amber-600 to-amber-400" },
  { label: "Added (7d)", value: 8, sub: "All new", icon: "📈", bar: 100, color: "from-violet-600 to-violet-400" },
];

const BY_STATUS = [
  { label: "Active", count: 6, pct: 75, color: "#10b981" },
  { label: "Under Maintenance", count: 1, pct: 12, color: "#f59e0b" },
  { label: "In Storage", count: 1, pct: 13, color: "#64748b" },
];

const BY_CATEGORY = [
  { label: "Laptop", count: 3, pct: 37, color: "#3b82f6" },
  { label: "Server", count: 1, pct: 13, color: "#8b5cf6" },
  { label: "Networking", count: 1, pct: 13, color: "#06b6d4" },
  { label: "Monitor", count: 1, pct: 12, color: "#14b8a6" },
  { label: "Desktop / Other", count: 2, pct: 25, color: "#64748b" },
];

const ACTIVITY = [
  { name: "MacBook Air 13\"", action: "status changed", by: "it-helpdesk", ago: "2h ago", dot: "#f59e0b" },
  { name: "ThinkPad X1 Carbon", action: "location changed", by: "bob", ago: "5h ago", dot: "#3b82f6" },
  { name: "HP ProDesk 400", action: "status changed", by: "admin", ago: "1d ago", dot: "#f59e0b" },
  { name: "Dell PowerEdge R740", action: "registered", by: "admin", ago: "2d ago", dot: "#10b981" },
  { name: "Cisco Catalyst 2960", action: "registered", by: "admin", ago: "2d ago", dot: "#10b981" },
  { name: "Logitech MX Master 3", action: "registered", by: "charlie", ago: "3d ago", dot: "#10b981" },
];

export function VariantB() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex flex-col font-sans">
      {/* Top nav bar */}
      <header className="h-12 bg-[#161b27] border-b border-white/5 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold">IT</div>
            <span className="text-sm font-semibold text-white">IT Asset Inventory</span>
          </div>
          <nav className="flex items-center gap-4">
            {["Dashboard", "Assets", "Register"].map((n, i) => (
              <span key={n} className={`text-xs cursor-pointer transition-colors ${i === 0 ? "text-blue-400 border-b border-blue-400 pb-0.5" : "text-slate-400 hover:text-slate-200"}`}>{n}</span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors">+ Register Asset</button>
          <span className="text-xs text-slate-500">admin@admin.com</span>
        </div>
      </header>

      {/* Page title strip */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center gap-3">
        <h1 className="text-sm font-bold text-white">Dashboard</h1>
        <span className="text-slate-600">/</span>
        <span className="text-xs text-slate-500">Asset inventory overview</span>
      </div>

      {/* KPI band — horizontal 4-column */}
      <div className="grid grid-cols-4 border-b border-white/5">
        {STATS.map((s, i) => (
          <div key={s.label} className={`px-6 py-5 flex flex-col justify-between ${i < 3 ? "border-r border-white/5" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">{s.label}</p>
              <span className="text-base">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold tabular-nums text-white mb-2">{s.value}</p>
            <div className="space-y-1.5">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all`} style={{ width: `${s.bar}%` }} />
              </div>
              <p className="text-[10px] text-slate-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main 3-column grid */}
      <div className="flex-1 grid grid-cols-3 divide-x divide-white/5 overflow-hidden">
        {/* Status Breakdown */}
        <div className="p-5 overflow-auto">
          <p className="text-xs font-semibold text-slate-300 mb-4 uppercase tracking-wide">Status</p>
          <div className="space-y-4">
            {BY_STATUS.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-slate-300">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{s.count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Donut-style legend */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">Category</p>
            <div className="space-y-2.5">
              {BY_CATEGORY.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-slate-400">{c.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                    <span className="text-xs font-medium tabular-nums w-3 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity — spans 2 cols */}
        <div className="col-span-2 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Recent Activity</p>
            <span className="text-[10px] text-slate-500">Last 7 days</span>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/5" />
            <div className="space-y-0">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="relative flex gap-4 pb-4">
                  <div className="relative z-10 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: a.dot + "20", borderColor: a.dot + "40" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.dot }} />
                  </div>
                  <div className="flex-1 min-w-0 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg px-3 py-2 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-white truncate">
                        <span className="font-medium text-blue-400">{a.name}</span>
                        {" "}<span className="text-slate-400">{a.action}</span>
                      </p>
                      <span className="text-[10px] text-slate-600 flex-shrink-0">{a.ago}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">by {a.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
