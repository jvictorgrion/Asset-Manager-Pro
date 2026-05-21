import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import {
  useCreateAsset,
  useGetAsset,
  useUpdateAsset,
  getListAssetsQueryKey,
  getGetAssetQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Laptop", "Desktop", "Monitor", "Server", "Peripheral", "Networking", "Other"];
const STATUSES = ["Active", "In Storage", "Under Maintenance", "Retired", "Disposed"];

const formSchema = z.object({
  assetNumber: z.string().min(1, "Asset number is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  currentUser: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AssetFormProps {
  assetId?: number;
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  );
}

export default function AssetForm({ assetId }: AssetFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!assetId;

  const { data: existing, isLoading: loadingExisting } = useGetAsset(assetId!, {
    query: { enabled: isEdit, queryKey: getGetAssetQueryKey(assetId!) },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: existing
      ? {
          assetNumber: existing.assetNumber,
          name: existing.name,
          category: existing.category,
          brand: existing.brand ?? "",
          model: existing.model ?? "",
          serialNumber: existing.serialNumber ?? "",
          status: existing.status,
          currentUser: existing.currentUser ?? "",
          location: existing.location ?? "",
          notes: existing.notes ?? "",
        }
      : {
          assetNumber: "",
          name: "",
          category: "",
          brand: "",
          model: "",
          serialNumber: "",
          status: "Active",
          currentUser: "",
          location: "",
          notes: "",
        },
  });

  const createAsset = useCreateAsset({
    mutation: {
      onSuccess: (asset) => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        toast({ title: "Asset registered successfully" });
        setLocation(`/assets/${asset.id}`);
      },
      onError: () => toast({ title: "Failed to register asset", variant: "destructive" }),
    },
  });

  const updateAsset = useUpdateAsset({
    mutation: {
      onSuccess: (asset) => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAssetQueryKey(asset.id) });
        toast({ title: "Asset updated successfully" });
        setLocation(`/assets/${asset.id}`);
      },
      onError: () => toast({ title: "Failed to update asset", variant: "destructive" }),
    },
  });

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      brand: values.brand || undefined,
      model: values.model || undefined,
      serialNumber: values.serialNumber || undefined,
      currentUser: values.currentUser || undefined,
      location: values.location || undefined,
      notes: values.notes || undefined,
    };

    if (isEdit) {
      updateAsset.mutate({ id: assetId, data: payload });
    } else {
      createAsset.mutate({ data: payload });
    }
  }

  const isPending = createAsset.isPending || updateAsset.isPending;

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            data-testid="button-back"
            onClick={() => setLocation(isEdit ? `/assets/${assetId}` : "/assets")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{isEdit ? "Edit Asset" : "Register Asset"}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit ? `Editing ${existing?.name ?? "asset"}` : "Add a new asset to inventory"}
            </p>
          </div>
        </div>

        {isEdit && loadingExisting ? (
          <Card><CardContent className="p-6"><FormSkeleton /></CardContent></Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Identification */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Identification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="assetNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Asset Number <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. IT-2024-001" data-testid="input-asset-number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. MacBook Pro 14" data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Category <span className="text-destructive">*</span></FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Status <span className="text-destructive">*</span></FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Hardware details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Hardware Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Brand</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Apple" data-testid="input-brand" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. A2442" data-testid="input-model" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Serial Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. C02X1234" data-testid="input-serial-number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Assignment */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Current User</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. john.doe@company.com" data-testid="input-current-user" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Office 3B / Remote" data-testid="input-location" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Notes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Any additional notes about this asset..."
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  data-testid="button-cancel"
                  onClick={() => setLocation(isEdit ? `/assets/${assetId}` : "/assets")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} data-testid="button-save">
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />{isEdit ? "Save Changes" : "Register Asset"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </Layout>
  );
}
