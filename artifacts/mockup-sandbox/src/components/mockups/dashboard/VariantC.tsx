const STATS = [
  { label: "Total", value: 8, icon: "📦", accent: "text-blue-400" },
  { label: "Active", value: 6, icon: "✅", accent: "text-emerald-400" },
  { label: "Maintenance", value: 1, icon: "🔧", accent: "text-amber-400" },
  { label: "Added (7d)", value: 8, icon: "📈", accent: "text-violet-400" },
];

const BY_STATUS = [
  { label: "Active", count: 6, pct: 75, color: "bg-emerald-500" },
  { label: "Maintenance", count: 1, pct: 12, color: "bg-amber-500" },
  { label: "In Storage", count: 1, pct: 13, color: "bg-slate-500" },
];

const BY_CATEGORY = [
  { label: "Laptop", count: 3, emoji: "💻" },
  { label: "Server", count: 1, emoji: "🖥" },
  { label: "Networking", count: 1, emoji: "🌐" },
  { label: "Monitor", count: 1, emoji: "🖵" },
  { label: "Desktop", count: 1, emoji: "🖥" },
  { label: "Peripheral", count: 1, emoji: "🖱" },
];

const ACTIVITY = [
  { name: "MacBook Air 13\"", id: "IT-2024-008", action: "status → Under Maintenance", by: "it-helpdesk@company.com", ago: "2 hours ago", type: "update", tag: "Status" },
  { name: "ThinkPad X1 Carbon", id: "IT-2024-003", action: "location → Remote", by: "bob@company.com", ago: "5 hours ago", type: "update", tag: "Location" },
  { name: "HP ProDesk 400", id: "IT-2024-004", action: "status → In Storage", by: "admin@company.com", ago: "1 day ago", type: "update", tag: "Status" },
  { name: "Dell PowerEdge R740", id: "IT-2024-006", action: "registered in system", by: "admin@company.com", ago: "2 days ago", type: "create", tag: "New" },
  { name: "Cisco Catalyst 2960", id: "IT-2024-005", action: "registered in system", by: "admin@company.com", ago: "2 days ago", type: "create", tag: "New" },
  { name: "Logitech MX Master 3", id: "IT-2024-007", action: "registered in system", by: "charlie@company.com", ago: "3 days ago", type: "create", tag: "New" },
  { name: "MacBook Pro 14\"", id: "IT-2024-001", action: "registered in system", by: "alice@company.com", ago: "4 days ago", type: "create", tag: "New" },
];

const tagColors: Record<string, string> = {
  Status: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  Location: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  New: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
};

export function VariantC() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex flex-col font-sans">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">IT</div>
          <div>
            <p className="text-sm font-bold text-white leading-none">IT Asset Inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {["Dashboard", "Assets", "Register Asset"].map((n, i) => (
            <span key={n} className={`text-xs cursor-pointer ${i === 0 ? "text-white" : "text-slate-500 hover:text-slate-300"}`}>{n}</span>
          ))}
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs text-slate-500">admin@admin.com</span>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">+ Register</button>
        </div>
      </header>

      {/* Compact KPI strip */}
      <div className="border-b border-white/5 bg-[#161b27]">
        <div className="flex divide-x divide-white/5">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 flex items-center gap-3 px-6 py-3">
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className={`text-xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: big activity feed + right sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity feed — main column */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Activity Feed</h2>
              <p className="text-xs text-slate-500 mt-0.5">All changes across your inventory</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-xs text-slate-400 rounded-md px-2 py-1 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {/* Date group */}
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-3">Today</p>
          </div>

          <div className="space-y-2">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer">
                {/* Left: change type pill */}
                <div className="flex-shrink-0 pt-0.5">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${tagColors[a.tag] ?? ""}`}>
                    {a.tag}
                  </span>
                </div>

                {/* Center: asset + action */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-semibold text-blue-400 hover:text-blue-300">{a.name}</span>
                    {" "}
                    <span className="text-slate-400 font-normal">{a.action}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <span className="text-slate-600">{a.id}</span>
                    <span className="mx-1.5 text-slate-700">·</span>
                    by <span className="text-slate-400">{a.by}</span>
                    <span className="mx-1.5 text-slate-700">·</span>
                    {a.ago}
                  </p>
                </div>

                {/* Right: arrow */}
                <div className="flex-shrink-0 text-slate-700 group-hover:text-slate-400 transition-colors text-sm">›</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar: breakdowns */}
        <aside className="w-56 flex-shrink-0 border-l border-white/5 p-5 overflow-auto space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">By Status</p>
            <div className="space-y-3">
              {BY_STATUS.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400 truncate">{s.label}</span>
                    <span className="text-xs font-semibold tabular-nums ml-2">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">By Category</p>
            <div className="space-y-2">
              {BY_CATEGORY.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{c.emoji}</span>
                    <span className="text-xs text-slate-400">{c.label}</span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-slate-300">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Quick Actions</p>
            <div className="space-y-2">
              {["Register Asset", "View All Assets", "Export CSV"].map((a) => (
                <button key={a} className="w-full text-left text-xs text-slate-400 hover:text-white py-1.5 px-2.5 rounded-lg hover:bg-white/5 transition-colors">
                  {a}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
