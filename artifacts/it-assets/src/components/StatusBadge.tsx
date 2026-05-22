import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Active: { label: "Active", className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100" },
  "In Storage": { label: "In Storage", className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" },
  "Under Maintenance": { label: "Under Maintenance", className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100" },
  Retired: { label: "Retired", className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100" },
  Disposed: { label: "Disposed", className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" },
  Disabled: { label: "Disabled", className: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100" };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`} data-testid="badge-status">
      {config.label}
    </Badge>
  );
}
