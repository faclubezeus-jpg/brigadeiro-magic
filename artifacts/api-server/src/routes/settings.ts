import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSettingsBody, GetSettingsResponse, UpdateSettingsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/settings", async (req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable).limit(1);
  if (rows.length === 0) {
    const [created] = await db.insert(siteSettingsTable).values({}).returning();
    res.json(GetSettingsResponse.parse(created));
    return;
  }
  res.json(GetSettingsResponse.parse(rows[0]));
});

router.put("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const rows = await db.select().from(siteSettingsTable).limit(1);
  let result;
  if (rows.length === 0) {
    [result] = await db.insert(siteSettingsTable).values(parsed.data).returning();
  } else {
    [result] = await db.update(siteSettingsTable)
      .set(parsed.data)
      .where(eq(siteSettingsTable.id, rows[0].id))
      .returning();
  }
  res.json(UpdateSettingsResponse.parse(result));
});

export default router;
