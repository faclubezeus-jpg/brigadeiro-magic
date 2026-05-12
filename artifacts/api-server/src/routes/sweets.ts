import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, sweetsTable } from "@workspace/db";
import {
  CreateSweetBody,
  UpdateSweetBody,
  UpdateSweetParams,
  DeleteSweetParams,
  UpdateSweetResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sweets", async (req, res): Promise<void> => {
  const rows = await db.select().from(sweetsTable).orderBy(asc(sweetsTable.sortOrder));
  res.json(rows);
});

router.post("/sweets", async (req, res): Promise<void> => {
  const parsed = CreateSweetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(sweetsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    visible: parsed.data.visible ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/sweets/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateSweetParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSweetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(sweetsTable)
    .set(parsed.data)
    .where(eq(sweetsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Sweet not found" });
    return;
  }
  res.json(UpdateSweetResponse.parse(updated));
});

router.delete("/sweets/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteSweetParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(sweetsTable)
    .where(eq(sweetsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Sweet not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
