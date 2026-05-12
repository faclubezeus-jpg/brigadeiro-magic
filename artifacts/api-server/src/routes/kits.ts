import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, kitsTable } from "@workspace/db";
import {
  CreateKitBody,
  UpdateKitBody,
  UpdateKitParams,
  DeleteKitParams,
  UpdateKitResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/kits", async (req, res): Promise<void> => {
  const rows = await db.select().from(kitsTable).orderBy(asc(kitsTable.sortOrder));
  res.json(rows);
});

router.post("/kits", async (req, res): Promise<void> => {
  const parsed = CreateKitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(kitsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    visible: parsed.data.visible ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/kits/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateKitParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateKitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(kitsTable)
    .set(parsed.data)
    .where(eq(kitsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Kit not found" });
    return;
  }
  res.json(UpdateKitResponse.parse(updated));
});

router.delete("/kits/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteKitParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(kitsTable)
    .where(eq(kitsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Kit not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
