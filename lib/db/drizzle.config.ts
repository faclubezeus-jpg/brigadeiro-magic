import { defineConfig } from "drizzle-kit";
import path from "path";

const dbPath = process.env["DATABASE_PATH"] || "C:/Users/Usuario/Downloads/Brigadeiro-Magic/sqlite.db";
const dbUrl = dbPath.startsWith("file:") ? dbPath : `file:${dbPath}`;

export default defineConfig({
  schema: "./src/schema/*",
  dialect: "sqlite",
  dbCredentials: {
    url: dbUrl,
  },
});
