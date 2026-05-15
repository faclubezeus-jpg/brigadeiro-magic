import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl && process.env["NODE_ENV"] === "production") {
  throw new Error("DATABASE_URL is required in production");
}

// In development, fallback to a local postgres or just a dummy string if we only use migrations
const client = postgres(databaseUrl || "postgres://postgres:postgres@localhost:5432/postgres", {
  ssl: databaseUrl ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(client, { schema });

export * from "./schema";
