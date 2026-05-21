import { Layout } from "@/components/Layout";
import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  Package,
  CheckCircle2,
  PlusCircle,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.FC<{ className?: string }>; color: string }) {
  return (
    <Card data-testid={`card-stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold mt-1.5 tabular-nums">{value}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  const activeCount = summary?.byStatus.find((s) => s.status === "Active")?.count ?? 0;
  const maintenanceCount = summary?.byStatus.find((s) => s.status === "Under Maintenance")?.count ?? 0;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Asset inventory overview</p>
          </div>
          <Link href="/assets/new">
            <Button size="sm" className="gap-1.5" data-testid="button-register-asset">
              <PlusCircle className="h-4 w-4" />
              Register Asset
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Assets" value={summary?.totalAssets ?? 0} icon={Package} color="bg-blue-100 text-blue-600" />
            <StatCard label="Active" value={activeCount} icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" />
            <StatCard label="Maintenance" value={maintenanceCount} icon={Clock} color="bg-amber-100 text-amber-600" />
            <StatCard label="Added (7d)" value={summary?.recentlyAdded ?? 0} icon={TrendingUp} color="bg-purple-100 text-purple-600" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {summaryLoading ? (
                <div className="px-5 pb-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="divide-y">
                  {summary?.byStatus.map((s) => {
                    const pct = summary.totalAssets > 0 ? (s.count / summary.totalAssets) * 100 : 0;
                    return (
                      <div key={s.status} className="flex items-center gap-3 px-5 py-3" data-testid={`row-status-${s.status}`}>
                        <StatusBadge status={s.status} />
                        <div className="flex-1 min-w-0">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className="text-sm font-medium tabular-nums w-6 text-right">{s.count}</span>
                      </div>
                    );
                  })}
                  {(!summary?.byStatus || summary.byStatus.length === 0) && (
                    <p className="text-sm text-muted-foreground px-5 py-4">No assets yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">By Category</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {summaryLoading ? (
                <div className="px-5 pb-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="divide-y">
                  {summary?.byCategory.map((c) => (
                    <div key={c.category} className="flex items-center gap-3 px-5 py-3" data-testid={`row-category-${c.category}`}>
                      <div className="flex items-center gap-2 w-36">
                        <CategoryIcon category={c.category} className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">{c.category}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all"
                            style={{ width: `${summary.totalAssets > 0 ? (c.count / summary.totalAssets) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium tabular-nums w-6 text-right">{c.count}</span>
                    </div>
                  ))}
                  {(!summary?.byCategory || summary.byCategory.length === 0) && (
                    <p className="text-sm text-muted-foreground px-5 py-4">No assets yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="px-5 pb-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="divide-y">
                {activity?.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3" data-testid={`row-activity-${entry.id}`}>
                    <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="h-3 w-3 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-none">
                        <Link href={`/assets/${entry.assetId}`}>
                          <span className="font-medium hover:text-blue-600 cursor-pointer">{entry.assetName ?? entry.assetNumber}</span>
                        </Link>
                        {" "}
                        <span className="text-muted-foreground">
                          {entry.changeType === "created" ? "was registered" : entry.fieldChanged ? `${entry.fieldChanged} changed` : "was updated"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {entry.changedBy} &middot; {formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                {(!activity || activity.length === 0) && (
                  <p className="text-sm text-muted-foreground px-5 py-6 text-center">No recent activity</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
