import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, historyTable, assetsTable } from "@workspace/db";
import { GetAssetHistoryParams, GetAssetHistoryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assets/:id/history", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssetHistoryParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select({
      id: historyTable.id,
      assetId: historyTable.assetId,
      assetName: assetsTable.name,
      assetNumber: assetsTable.assetNumber,
      changedAt: historyTable.changedAt,
      changedBy: historyTable.changedBy,
      changeType: historyTable.changeType,
      fieldChanged: historyTable.fieldChanged,
      oldValue: historyTable.oldValue,
      newValue: historyTable.newValue,
      description: historyTable.description,
    })
    .from(historyTable)
    .leftJoin(assetsTable, eq(historyTable.assetId, assetsTable.id))
    .where(eq(historyTable.assetId, params.data.id))
    .orderBy(desc(historyTable.changedAt));

  res.json(
    GetAssetHistoryResponse.parse(
      rows.map((r) => ({ ...r, changedAt: r.changedAt.toISOString() }))
    )
  );
});

export default router;
