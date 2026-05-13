import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cakesTable = sqliteTable("cakes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const insertCakeSchema = createInsertSchema(cakesTable).omit({ id: true });
export type InsertCake = z.infer<typeof insertCakeSchema>;
export type Cake = typeof cakesTable.$inferSelect;
