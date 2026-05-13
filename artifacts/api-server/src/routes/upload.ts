import { Router, type IRouter } from "express";
import { writeFile, mkdir } from "fs/promises";
import { join, extname, dirname } from "path";
import { randomUUID } from "crypto";
import { UploadImageBody, UploadImageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), "sqlite.db");
const DB_DIR = DB_PATH.startsWith("file:") ? dirname(DB_PATH.replace("file:", "")) : dirname(DB_PATH);
const UPLOADS_DIR = join(DB_DIR, "uploads");

const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".mp4", ".mov", ".webm", ".ogg",
]);

router.post("/upload", async (req, res): Promise<void> => {
  const parsed = UploadImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, filename } = parsed.data;

  // Strip base64 prefix (image or video)
  const base64Data = data.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const ext = extname(filename).toLowerCase() || ".png";

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    res.status(400).json({ error: `Formato não suportado: ${ext}. Use PNG, JPG, MP4 ou MOV.` });
    return;
  }

  const safeFilename = `${randomUUID()}${ext}`;

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, safeFilename), buffer);

  const url = `/api/uploads/${safeFilename}`;
  res.json(UploadImageResponse.parse({ url }));
});

export default router;
