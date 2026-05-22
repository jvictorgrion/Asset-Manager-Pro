import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Layout } from "@/components/Layout";
import {
  useListAssets,
  useDeleteAsset,
  useUpdateAsset,
  getListAssetsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package,
  PowerOff,
  Power,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = ["Laptop", "Desktop", "Monitor", "Server", "Peripheral", "Networking", "Other"];
const STATUSES = ["Active", "In Storage", "Under Maintenance", "Retired", "Disposed", "Disabled"];

export default function AssetList() {
  const [, setLocation] = useLocation();
  const search_string = useSearch();
  const initialStatus = new URLSearchParams(search_string).get("status") ?? "all";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState(initialStatus);
  const [trashId, setTrashId] = useState<number | null>(null);

  useEffect(() => {
    const s = new URLSearchParams(search_string).get("status") ?? "all";
    setStatus(s);
  }, [search_string]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const params = {
    ...(search ? { search } : {}),
    ...(category !== "all" ? { category } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data: assets, isLoading } = useListAssets(params, {
    query: { queryKey: getListAssetsQueryKey(params) },
  });

  const deleteMutation = useDeleteAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        toast({ title: "Asset moved to trash" });
        setTrashId(null);
      },
      onError: () => {
        toast({ title: "Failed to move to trash", variant: "destructive" });
      },
    },
  });

  const updateMutation = useUpdateAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
      },
    },
  });

  function handleToggleDisable(assetId: number, currentStatus: string) {
    const newStatus = currentStatus === "Disabled" ? "Active" : "Disabled";
    updateMutation.mutate(
      { id: assetId, data: { status: newStatus } },
      {
        onSuccess: () =>
          toast({ title: currentStatus === "Disabled" ? "Asset enabled" : "Asset disabled" }),
        onError: () =>
          toast({ title: "Failed to update status", variant: "destructive" }),
      }
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Assets</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? "Loading..." : `${assets?.length ?? 0} asset${assets?.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/assets/new">
            <Button size="sm" className="gap-1.5" data-testid="button-new-asset">
              <PlusCircle className="h-4 w-4" />
              Register Asset
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name, number, serial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
              className="pl-8 h-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40 h-9" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44 h-9" data-testid="select-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <TableHead className="text-xs">Current User</TableHead>
                <TableHead className="text-xs">Location</TableHead>
                <TableHead className="text-xs">Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : assets && assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    data-testid={`row-asset-${asset.id}`}
                    onClick={() => setLocation(`/assets/${asset.id}`)}
                  >
                    <TableCell className="font-mono text-xs font-medium text-blue-600">
                      {asset.assetNumber}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{asset.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CategoryIcon category={asset.category} className="h-3.5 w-3.5" />
                        {asset.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[asset.brand, asset.model].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={asset.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{asset.currentUser ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{asset.location ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" data-testid={`button-actions-${asset.id}`}>
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/assets/${asset.id}`)}>
                            <Eye className="h-3.5 w-3.5 mr-2" />View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation(`/assets/${asset.id}/edit`)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleDisable(asset.id, asset.status)}
                          >
                            {asset.status === "Disabled" ? (
                              <><Power className="h-3.5 w-3.5 mr-2 text-emerald-500" />Enable</>
                            ) : (
                              <><PowerOff className="h-3.5 w-3.5 mr-2 text-amber-500" />Disable</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setTrashId(asset.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />Move to Trash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16">
                    <Package className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No assets found</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {search || category !== "all" || status !== "all"
                        ? "Try adjusting your filters"
                        : "Register your first asset to get started"}
                    </p>
                    {!search && category === "all" && status === "all" && (
                      <Link href="/assets/new">
                        <Button size="sm" variant="outline" className="mt-4 gap-1.5">
                          <PlusCircle className="h-4 w-4" />Register Asset
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={trashId !== null} onOpenChange={(open) => { if (!open) setTrashId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This asset will be moved to the Trash. You can restore it later or permanently delete it from there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
              onClick={() => trashId && deleteMutation.mutate({ id: trashId })}
            >
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
