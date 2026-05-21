const STATS = [
  { label: "Total Assets", value: 8, icon: "📦", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  { label: "Active", value: 6, icon: "✅", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  { label: "Maintenance", value: 1, icon: "🔧", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  { label: "Added (7d)", value: 8, icon: "📈", color: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
];

const BY_STATUS = [
  { label: "Active", count: 6, pct: 75, color: "bg-emerald-500" },
  { label: "Under Maintenance", count: 1, pct: 12, color: "bg-amber-500" },
  { label: "In Storage", count: 1, pct: 13, color: "bg-slate-400" },
];

const BY_CATEGORY = [
  { label: "Laptop", count: 3, pct: 37, color: "bg-blue-500" },
  { label: "Server", count: 1, pct: 13, color: "bg-violet-500" },
  { label: "Networking", count: 1, pct: 13, color: "bg-cyan-500" },
  { label: "Monitor", count: 1, pct: 12, color: "bg-teal-500" },
  { label: "Other", count: 2, pct: 25, color: "bg-slate-400" },
];

const ACTIVITY = [
  { name: "MacBook Air 13\"", action: "status changed", by: "it-helpdesk@company.com", ago: "2 hours ago" },
  { name: "ThinkPad X1 Carbon", action: "location changed", by: "bob@company.com", ago: "5 hours ago" },
  { name: "HP ProDesk 400", action: "status changed", by: "admin@company.com", ago: "1 day ago" },
  { name: "Dell PowerEdge R740", action: "was registered", by: "admin@company.com", ago: "2 days ago" },
  { name: "Cisco Catalyst 2960", action: "was registered", by: "admin@company.com", ago: "2 days ago" },
  { name: "Logitech MX Master 3", action: "was registered", by: "charlie@company.com", ago: "3 days ago" },
];

export function VariantA() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-56 bg-[#161b27] border-r border-white/5 flex-shrink-0 flex flex-col">
        {/* App header */}
        <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">IT</div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">IT Assets</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Inventory System</p>
          </div>
        </div>

        {/* KPI stack in sidebar */}
        <div className="p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 px-1 mb-3 mt-1">Overview</p>
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm">{s.icon}</span>
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
              <span className="text-sm font-bold text-white tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="p-3 mt-2 border-t border-white/5 space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 px-1 mb-2 mt-1">Navigation</p>
          {["Dashboard", "All Assets", "Register Asset"].map((nav, i) => (
            <div key={nav} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${i === 0 ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-white/[0.04]"}`}>
              <span>{["◼", "◻", "＋"][i]}</span>
              {nav}
            </div>
          ))}
        </div>

        <div className="mt-auto p-3 border-t border-white/5">
          <p className="text-[10px] text-slate-500 px-1">admin@admin.com</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Asset inventory overview</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">
            + Register Asset
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#161b27] border border-white/5 p-4">
              <p className="text-xs font-semibold text-slate-300 mb-3">Status Breakdown</p>
              <div className="space-y-2.5">
                {BY_STATUS.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{s.label}</span>
                      <span className="text-xs font-semibold tabular-nums">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#161b27] border border-white/5 p-4">
              <p className="text-xs font-semibold text-slate-300 mb-3">By Category</p>
              <div className="space-y-2.5">
                {BY_CATEGORY.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{c.label}</span>
                      <span className="text-xs font-semibold tabular-nums">{c.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-xl bg-[#161b27] border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-400 text-sm">⚡</span>
              <p className="text-xs font-semibold text-slate-300">Recent Activity</p>
            </div>
            <div className="space-y-0">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">⚡</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white">
                      <span className="font-medium text-blue-400">{a.name}</span>
                      {" "}<span className="text-slate-400">{a.action}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">by {a.by} · {a.ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
