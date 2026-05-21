import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, notesTable } from "@workspace/db";
import {
  GetAssetNotesParams,
  GetAssetNotesResponse,
  CreateAssetNoteParams,
  CreateAssetNoteBody,
  DeleteNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assets/:id/notes", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssetNotesParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.assetId, params.data.id))
    .orderBy(desc(notesTable.createdAt));

  res.json(
    GetAssetNotesResponse.parse(
      notes.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }))
    )
  );
});

router.post("/assets/:id/notes", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CreateAssetNoteParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateAssetNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [note] = await db
    .insert(notesTable)
    .values({ assetId: params.data.id, ...parsed.data })
    .returning();

  res.status(201).json({
    ...note,
    createdAt: note.createdAt.toISOString(),
  });
});

router.delete("/notes/:noteId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
  const params = DeleteNoteParams.safeParse({ noteId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [note] = await db
    .delete(notesTable)
    .where(eq(notesTable.id, params.data.noteId))
    .returning();

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
