import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import {
  CreateTestimonialBody,
  UpdateTestimonialBody,
  UpdateTestimonialParams,
  DeleteTestimonialParams,
  UpdateTestimonialResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (req, res): Promise<void> => {
  const rows = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.sortOrder));
  res.json(rows);
});

router.post("/testimonials", async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(testimonialsTable).values({
    name: parsed.data.name,
    text: parsed.data.text,
    photoUrl: parsed.data.photoUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    visible: parsed.data.visible ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/testimonials/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateTestimonialParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(testimonialsTable)
    .set(parsed.data)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.json(UpdateTestimonialResponse.parse(updated));
});

router.delete("/testimonials/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTestimonialParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db.delete(testimonialsTable)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
