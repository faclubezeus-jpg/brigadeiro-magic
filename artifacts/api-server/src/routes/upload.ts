import { Router, type IRouter } from "express";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { UploadImageBody, UploadImageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

router.post("/upload", async (req, res): Promise<void> => {
  const parsed = UploadImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, filename } = parsed.data;

  const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const ext = extname(filename) || ".png";
  const safeFilename = `${randomUUID()}${ext}`;

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, safeFilename), buffer);

  const url = `/api/uploads/${safeFilename}`;
  res.json(UploadImageResponse.parse({ url }));
});

export default router;
