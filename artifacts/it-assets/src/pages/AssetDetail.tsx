import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import {
  useGetAsset,
  useGetAssetHistory,
  useGetAssetNotes,
  useCreateAssetNote,
  useDeleteNote,
  getGetAssetQueryKey,
  getGetAssetHistoryQueryKey,
  getGetAssetNotesQueryKey,
  getListAssetsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  User,
  MapPin,
  Tag,
  Hash,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { useDeleteAsset } from "@workspace/api-client-react";

interface AssetDetailProps {
  assetId: number;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex items-center gap-2 w-36 flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

export default function AssetDetail({ assetId }: AssetDetailProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = useState("");
  const [noteAuthor, setNoteAuthor] = useState(user?.email ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: asset, isLoading } = useGetAsset(assetId, {
    query: { queryKey: getGetAssetQueryKey(assetId) },
  });

  const { data: history } = useGetAssetHistory(assetId, {
    query: { queryKey: getGetAssetHistoryQueryKey(assetId) },
  });

  const { data: notes } = useGetAssetNotes(assetId, {
    query: { queryKey: getGetAssetNotesQueryKey(assetId) },
  });

  const createNote = useCreateAssetNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAssetNotesQueryKey(assetId) });
        setNoteContent("");
        toast({ title: "Note added" });
      },
      onError: () => toast({ title: "Failed to add note", variant: "destructive" }),
    },
  });

  const deleteNote = useDeleteNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAssetNotesQueryKey(assetId) });
        toast({ title: "Note deleted" });
      },
    },
  });

  const deleteAsset = useDeleteAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        toast({ title: "Asset deleted" });
        setLocation("/assets");
      },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    },
  });

  function submitNote() {
    if (!noteContent.trim() || !noteAuthor.trim()) return;
    createNote.mutate({
      id: assetId,
      data: { content: noteContent.trim(), createdBy: noteAuthor.trim() },
    });
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto space-y-5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Layout>
    );
  }

  if (!asset) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center py-16">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Asset not found</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setLocation("/assets")}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Assets
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setLocation("/assets")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <CategoryIcon category={asset.category} className="h-4 w-4 text-muted-foreground" />
                <h1 className="text-xl font-bold" data-testid="text-asset-name">{asset.name}</h1>
                <StatusBadge status={asset.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 font-mono">{asset.assetNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              data-testid="button-edit"
              onClick={() => setLocation(`/assets/${assetId}/edit`)}
            >
              <Pencil className="h-3.5 w-3.5" />Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
              data-testid="button-delete"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />Delete
            </Button>
          </div>
        </div>

        {/* Details + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: asset details */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Asset Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 divide-y">
              <DetailRow icon={Hash} label="Asset No." value={asset.assetNumber} />
              <DetailRow icon={Layers} label="Category" value={asset.category} />
              <DetailRow icon={Tag} label="Brand" value={asset.brand} />
              <DetailRow icon={Tag} label="Model" value={asset.model} />
              <DetailRow icon={Hash} label="Serial No." value={asset.serialNumber} />
              <DetailRow icon={AlertCircle} label="Status" value={asset.status} />
              <DetailRow icon={User} label="Current User" value={asset.currentUser} />
              <DetailRow icon={MapPin} label="Location" value={asset.location} />
              <Separator className="my-1" />
              <div className="py-2.5">
                <p className="text-xs text-muted-foreground mb-1">Added</p>
                <p className="text-sm">{format(new Date(asset.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div className="py-2.5">
                <p className="text-xs text-muted-foreground mb-1">Last updated</p>
                <p className="text-sm">{formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}</p>
              </div>
              {asset.notes && (
                <>
                  <Separator className="my-1" />
                  <div className="py-2.5">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground leading-relaxed">{asset.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Right: tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="notes">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="notes" className="gap-1.5" data-testid="tab-notes">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Notes {notes && notes.length > 0 && <span className="ml-1 bg-muted text-muted-foreground text-xs rounded px-1">{notes.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5" data-testid="tab-history">
                  <Clock className="h-3.5 w-3.5" />
                  History {history && history.length > 0 && <span className="ml-1 bg-muted text-muted-foreground text-xs rounded px-1">{history.length}</span>}
                </TabsTrigger>
              </TabsList>

              {/* Notes tab */}
              <TabsContent value="notes" className="mt-4 space-y-4">
                {/* Add note */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <Label className="text-xs font-medium">Author</Label>
                        <Input
                          value={noteAuthor}
                          onChange={(e) => setNoteAuthor(e.target.value)}
                          placeholder="Your name"
                          className="mt-1 h-8 text-sm"
                          data-testid="input-note-author"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs font-medium">Note</Label>
                        <Textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Add a note..."
                          rows={2}
                          className="mt-1 text-sm resize-none"
                          data-testid="textarea-note-content"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) submitNote();
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={submitNote}
                        disabled={!noteContent.trim() || !noteAuthor.trim() || createNote.isPending}
                        data-testid="button-add-note"
                      >
                        {createNote.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes list */}
                <div className="space-y-2">
                  {notes && notes.length > 0 ? (
                    notes.map((note) => (
                      <Card key={note.id} data-testid={`card-note-${note.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User className="h-3.5 w-3.5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">{note.createdBy}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm mt-1 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                              data-testid={`button-delete-note-${note.id}`}
                              onClick={() => deleteNote.mutate({ noteId: note.id })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 border rounded-lg bg-card">
                      <MessageSquare className="h-7 w-7 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No notes yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Add a note above to document observations, issues, or actions</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* History tab */}
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    {history && history.length > 0 ? (
                      <div className="divide-y">
                        {history.map((entry) => (
                          <div key={entry.id} className="flex items-start gap-3 px-4 py-3" data-testid={`row-history-${entry.id}`}>
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">
                                <span className="font-medium capitalize">{entry.changeType}</span>
                                {entry.fieldChanged && (
                                  <span className="text-muted-foreground"> — {entry.fieldChanged}</span>
                                )}
                              </p>
                              {entry.fieldChanged && entry.oldValue !== null && entry.newValue !== null && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground line-through">{entry.oldValue || "(empty)"}</span>
                                  <span className="text-xs text-muted-foreground">→</span>
                                  <span className="text-xs text-foreground">{entry.newValue || "(empty)"}</span>
                                </div>
                              )}
                              {entry.description && !entry.fieldChanged && (
                                <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                by {entry.changedBy} &middot; {formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Clock className="h-7 w-7 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No change history</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{asset.name}</strong> and all its history and notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
              onClick={() => deleteAsset.mutate({ id: assetId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
