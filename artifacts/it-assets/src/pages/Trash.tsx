import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  useListTrashedAssets,
  useRestoreAsset,
  usePermanentDeleteAsset,
  getListTrashedAssetsQueryKey,
  getListAssetsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, RotateCcw, PackageOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Trash() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [permanentId, setPermanentId] = useState<number | null>(null);
  const [permanentName, setPermanentName] = useState("");

  const { data: assets, isLoading } = useListTrashedAssets({
    query: { queryKey: getListTrashedAssetsQueryKey() },
  });

  const restore = useRestoreAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTrashedAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        toast({ title: "Asset restored" });
      },
      onError: () => toast({ title: "Restore failed", variant: "destructive" }),
    },
  });

  const permanentDelete = usePermanentDeleteAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTrashedAssetsQueryKey() });
        toast({ title: "Asset permanently deleted" });
        setPermanentId(null);
      },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    },
  });

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              Trash
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading
                ? "Loading..."
                : `${assets?.length ?? 0} asset${assets?.length !== 1 ? "s" : ""} in trash`}
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400 flex items-center gap-2">
          <Trash2 className="h-4 w-4 flex-shrink-0" />
          Assets in trash are hidden from the main inventory. Restore them to bring them back, or permanently delete to remove all data.
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Asset No.</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Brand / Model</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Location</TableHead>
                <TableHead className="text-xs">Trashed</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : assets && assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow key={asset.id} className="opacity-70 hover:opacity-100 transition-opacity">
                    <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                      {asset.assetNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={asset.category} className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{asset.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[asset.brand, asset.model].filter(Boolean).join(" · ") || "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={asset.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{asset.location ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {asset.deletedAt
                        ? formatDistanceToNow(new Date(asset.deletedAt), { addSuffix: true })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 gap-1 text-xs"
                          onClick={() => restore.mutate({ id: asset.id })}
                          disabled={restore.isPending}
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => { setPermanentId(asset.id); setPermanentName(asset.name); }}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="text-center py-16">
                      <PackageOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Trash is empty</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Assets you delete will appear here before being permanently removed
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Permanent delete dialog */}
      <AlertDialog open={permanentId !== null} onOpenChange={(o) => !o && setPermanentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{permanentName}</strong> along with all its history and notes. This action <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => permanentId && permanentDelete.mutate({ id: permanentId })}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
