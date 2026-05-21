import { Router, type IRouter } from "express";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { db, assetsTable, historyTable } from "@workspace/db";
import {
  CreateAssetBody,
  GetAssetParams,
  UpdateAssetParams,
  UpdateAssetBody,
  DeleteAssetParams,
  ListAssetsQueryParams,
  ListAssetsResponse,
  GetAssetResponse,
  UpdateAssetResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assets", async (req, res): Promise<void> => {
  const parsed = ListAssetsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, status } = parsed.data;

  const conditions = [];
  if (search) {
    conditions.push(
      sql`(${ilike(assetsTable.name, `%${search}%`)} OR ${ilike(assetsTable.assetNumber, `%${search}%`)} OR ${ilike(assetsTable.serialNumber, `%${search}%`)})`
    );
  }
  if (category) {
    conditions.push(eq(assetsTable.category, category));
  }
  if (status) {
    conditions.push(eq(assetsTable.status, status));
  }

  const assets = await db
    .select()
    .from(assetsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(assetsTable.updatedAt));

  res.json(
    ListAssetsResponse.parse(
      assets.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }))
    )
  );
});

router.post("/assets", async (req, res): Promise<void> => {
  const parsed = CreateAssetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [asset] = await db.insert(assetsTable).values(parsed.data).returning();

  await db.insert(historyTable).values({
    assetId: asset.id,
    changedBy: parsed.data.currentUser ?? "System",
    changeType: "created",
    description: `Asset ${asset.assetNumber} created`,
  });

  res.status(201).json(
    GetAssetResponse.parse({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })
  );
});

router.get("/assets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssetParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [asset] = await db
    .select()
    .from(assetsTable)
    .where(eq(assetsTable.id, params.data.id));

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  res.json(
    GetAssetResponse.parse({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })
  );
});

router.patch("/assets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAssetParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAssetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [before] = await db
    .select()
    .from(assetsTable)
    .where(eq(assetsTable.id, params.data.id));

  if (!before) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  const [asset] = await db
    .update(assetsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(assetsTable.id, params.data.id))
    .returning();

  const changedBy = parsed.data.currentUser ?? before.currentUser ?? "System";
  const changes: Array<{ field: string; old: string | null; newVal: string | null }> = [];

  for (const [key, newVal] of Object.entries(parsed.data)) {
    const oldVal = (before as Record<string, unknown>)[key];
    if (String(oldVal ?? "") !== String(newVal ?? "")) {
      changes.push({ field: key, old: String(oldVal ?? ""), newVal: String(newVal ?? "") });
    }
  }

  if (changes.length > 0) {
    await Promise.all(
      changes.map((c) =>
        db.insert(historyTable).values({
          assetId: asset.id,
          changedBy,
          changeType: "updated",
          fieldChanged: c.field,
          oldValue: c.old,
          newValue: c.newVal,
          description: `${c.field} changed`,
        })
      )
    );
  }

  res.json(
    UpdateAssetResponse.parse({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })
  );
});

router.delete("/assets/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteAssetParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [asset] = await db
    .delete(assetsTable)
    .where(eq(assetsTable.id, params.data.id))
    .returning();

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
