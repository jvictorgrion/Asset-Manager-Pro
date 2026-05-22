import { Router, type IRouter } from "express";
import { desc, sql, eq, isNull, isNotNull } from "drizzle-orm";
import { db, assetsTable, historyTable } from "@workspace/db";
import { GetDashboardSummaryResponse, GetRecentActivityResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [totalRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assetsTable)
    .where(isNull(assetsTable.deletedAt));

  const byStatusRows = await db
    .select({
      status: assetsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(assetsTable)
    .where(isNull(assetsTable.deletedAt))
    .groupBy(assetsTable.status);

  const byCategoryRows = await db
    .select({
      category: assetsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(assetsTable)
    .where(isNull(assetsTable.deletedAt))
    .groupBy(assetsTable.category);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [recentRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assetsTable)
    .where(sql`${assetsTable.createdAt} >= ${sevenDaysAgo} AND ${assetsTable.deletedAt} IS NULL`);

  const [disabledRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assetsTable)
    .where(sql`${assetsTable.status} = 'Disabled' AND ${assetsTable.deletedAt} IS NULL`);

  const [trashedRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assetsTable)
    .where(isNotNull(assetsTable.deletedAt));

  res.json(
    GetDashboardSummaryResponse.parse({
      totalAssets: totalRow?.count ?? 0,
      byStatus: byStatusRows,
      byCategory: byCategoryRows,
      recentlyAdded: recentRow?.count ?? 0,
      disabledCount: disabledRow?.count ?? 0,
      trashedCount: trashedRow?.count ?? 0,
    })
  );
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
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
    .leftJoin(assetsTable, sql`${historyTable.assetId} = ${assetsTable.id}`)
    .orderBy(desc(historyTable.changedAt))
    .limit(20);

  res.json(
    GetRecentActivityResponse.parse(
      rows.map((r) => ({ ...r, changedAt: r.changedAt.toISOString() }))
    )
  );
});

export default router;
