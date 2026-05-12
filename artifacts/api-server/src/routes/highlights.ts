import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, highlightsTable } from "@workspace/db";
import {
  CreateHighlightBody,
  UpdateHighlightBody,
  UpdateHighlightParams,
  DeleteHighlightParams,
  UpdateHighlightResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/highlights", async (req, res): Promise<void> => {
  const rows = await db.select().from(highlightsTable).orderBy(asc(highlightsTable.sortOrder));
  res.json(rows);
});

router.post("/highlights", async (req, res): Promise<void> => {
  const parsed = CreateHighlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(highlightsTable).values({
    imageUrl: parsed.data.imageUrl,
    caption: parsed.data.caption ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    visible: parsed.data.visible ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/highlights/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateHighlightParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateHighlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(highlightsTable)
    .set(parsed.data)
    .where(eq(highlightsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Highlight not found" });
    return;
  }
  res.json(UpdateHighlightResponse.parse(updated));
});

router.delete("/highlights/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteHighlightParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(highlightsTable)
    .where(eq(highlightsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Highlight not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
