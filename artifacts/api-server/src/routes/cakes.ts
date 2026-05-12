import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, cakesTable } from "@workspace/db";
import {
  CreateCakeBody,
  UpdateCakeBody,
  UpdateCakeParams,
  DeleteCakeParams,
  UpdateCakeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/cakes", async (req, res): Promise<void> => {
  const rows = await db.select().from(cakesTable).orderBy(asc(cakesTable.sortOrder));
  res.json(rows);
});

router.post("/cakes", async (req, res): Promise<void> => {
  const parsed = CreateCakeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(cakesTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    visible: parsed.data.visible ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/cakes/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCakeParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCakeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(cakesTable)
    .set(parsed.data)
    .where(eq(cakesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Cake not found" });
    return;
  }
  res.json(UpdateCakeResponse.parse(updated));
});

router.delete("/cakes/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCakeParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(cakesTable)
    .where(eq(cakesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Cake not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
