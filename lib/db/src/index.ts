import { drizzle } from "drizzle-orm/sqlite-proxy";
import { DatabaseSync } from "node:sqlite";
import * as schema from "./schema";
import path from "path";

// DATABASE_PATH must be an absolute path set by the caller (api-server).
// Fallback to process.cwd()/sqlite.db so dev tooling (drizzle-kit) still works
// when run from lib/db/.
const dbPath = process.env["DATABASE_PATH"] ?? path.join(process.cwd(), "sqlite.db");

const sqlite = new DatabaseSync(dbPath);

export const db = drizzle(
  (sql, params, method) => {
    try {
      const stmt = sqlite.prepare(sql);
      if (method === "run") {
        stmt.run(...params);
        return { rows: [] };
      }
      const rows = stmt.all(...params) as any[];
      return { rows: rows.map((r) => Object.values(r)) };
    } catch (e: any) {
      throw new Error(`SQLite error: ${e.message}\nSQL: ${sql}`);
    }
  },
  { schema }
);

export * from "./schema";
