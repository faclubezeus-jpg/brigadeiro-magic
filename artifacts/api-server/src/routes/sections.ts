import { Router, type IRouter } from "express";
import { eq, asc, inArray } from "drizzle-orm";
import { db, sectionsTable } from "@workspace/db";
import {
  CreateSectionBody,
  UpdateSectionBody,
  ReorderSectionsBody,
  UpdateSectionParams,
  DeleteSectionParams,
  UpdateSectionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sections", async (req, res): Promise<void> => {
  const rows = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.sortOrder));
  res.json(rows);
});

router.post("/sections", async (req, res): Promise<void> => {
  const parsed = CreateSectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(sectionsTable).values({
    slug: parsed.data.slug,
    title: parsed.data.title,
    visible: parsed.data.visible ?? true,
    sortOrder: parsed.data.sortOrder ?? 0,
    content: parsed.data.content ?? {},
  }).returning();
  res.status(201).json(created);
});

router.put("/sections/reorder", async (req, res): Promise<void> => {
  const parsed = ReorderSectionsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await Promise.all(
    parsed.data.ids.map((id, index) =>
      db.update(sectionsTable)
        .set({ sortOrder: index })
        .where(eq(sectionsTable.id, id))
    )
  );

  const rows = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.sortOrder));
  res.json(rows);
});

router.put("/sections/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateSectionParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(sectionsTable)
    .set({
      ...(parsed.data.title != null ? { title: parsed.data.title } : {}),
      ...(parsed.data.visible != null ? { visible: parsed.data.visible } : {}),
      ...(parsed.data.sortOrder != null ? { sortOrder: parsed.data.sortOrder } : {}),
      ...(parsed.data.content != null ? { content: parsed.data.content } : {}),
    })
    .where(eq(sectionsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Section not found" });
    return;
  }
  res.json(UpdateSectionResponse.parse(updated));
});

router.delete("/sections/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteSectionParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(sectionsTable)
    .where(eq(sectionsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Section not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
