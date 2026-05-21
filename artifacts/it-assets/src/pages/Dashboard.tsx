import { Layout } from "@/components/Layout";
import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  "Active": "bg-emerald-500",
  "Under Maintenance": "bg-amber-500",
  "In Storage": "bg-slate-400",
  "Retired": "bg-red-500",
  "Disposed": "bg-red-700",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Laptop": "bg-blue-500",
  "Desktop": "bg-sky-500",
  "Server": "bg-violet-500",
  "Networking": "bg-cyan-500",
  "Monitor": "bg-teal-500",
  "Peripheral": "bg-green-500",
  "Mobile": "bg-orange-500",
  "Other": "bg-slate-400",
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Asset inventory overview</p>
          </div>
          <Link href="/assets/new">
            <Button size="sm" className="gap-1.5 text-xs" data-testid="button-register-asset">
              <PlusCircle className="h-3.5 w-3.5" />
              Register Asset
            </Button>
          </Link>
        </div>

        {/* Status + Category row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Breakdown */}
          <div className="rounded-xl bg-card border border-border/50 p-4">
            <p className="text-xs font-semibold text-foreground mb-3">Status Breakdown</p>
            {summaryLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {summary?.byStatus.map((s) => {
                  const pct = summary.totalAssets > 0 ? (s.count / summary.totalAssets) * 100 : 0;
                  const barColor = STATUS_COLORS[s.status] ?? "bg-slate-400";
                  return (
                    <div key={s.status} data-testid={`row-status-${s.status}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{s.status}</span>
                        <span className="text-xs font-semibold tabular-nums">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!summary?.byStatus || summary.byStatus.length === 0) && (
                  <p className="text-xs text-muted-foreground py-2">No assets yet</p>
                )}
              </div>
            )}
          </div>

          {/* By Category */}
          <div className="rounded-xl bg-card border border-border/50 p-4">
            <p className="text-xs font-semibold text-foreground mb-3">By Category</p>
            {summaryLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {summary?.byCategory.map((c) => {
                  const pct = summary.totalAssets > 0 ? (c.count / summary.totalAssets) * 100 : 0;
                  const barColor = CATEGORY_COLORS[c.category] ?? "bg-slate-400";
                  return (
                    <div key={c.category} data-testid={`row-category-${c.category}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{c.category}</span>
                        <span className="text-xs font-semibold tabular-nums">{c.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!summary?.byCategory || summary.byCategory.length === 0) && (
                  <p className="text-xs text-muted-foreground py-2">No assets yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-card border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold text-foreground">Recent Activity</p>
          </div>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div>
              {activity?.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0"
                  data-testid={`row-activity-${entry.id}`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="h-3 w-3 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">
                      <Link href={`/assets/${entry.assetId}`}>
                        <span className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
                          {entry.assetName ?? entry.assetNumber}
                        </span>
                      </Link>
                      {" "}
                      <span className="text-muted-foreground">
                        {entry.changeType === "created"
                          ? "was registered"
                          : entry.fieldChanged
                          ? `${entry.fieldChanged} changed`
                          : "was updated"}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      by {entry.changedBy} &middot;{" "}
                      {formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              {(!activity || activity.length === 0) && (
                <p className="text-xs text-muted-foreground py-4 text-center">No recent activity</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
