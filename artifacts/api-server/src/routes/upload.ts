import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { extname } from "path";
import { UploadImageBody, UploadImageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".mp4", ".mov", ".webm", ".ogg",
]);

router.post("/upload", async (req, res): Promise<void> => {
  if (!supabase) {
    res.status(500).json({ error: "Supabase não configurado no servidor." });
    return;
  }

  const parsed = UploadImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, filename } = parsed.data;

  // Strip base64 prefix
  const base64Data = data.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const ext = extname(filename).toLowerCase() || ".png";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    res.status(400).json({ error: `Formato não suportado: ${ext}.` });
    return;
  }

  const safeFilename = `${randomUUID()}${ext}`;

  const { data: uploadData, error } = await supabase.storage
    .from("media")
    .upload(safeFilename, buffer, {
      contentType: req.body.data.split(";")[0].split(":")[1], // Extract content-type from base64 string
      upsert: false
    });

  if (error) {
    res.status(500).json({ error: `Erro no Supabase Storage: ${error.message}` });
    return;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("media")
    .getPublicUrl(safeFilename);

  res.json(UploadImageResponse.parse({ url: publicUrl }));
});

export default router;
