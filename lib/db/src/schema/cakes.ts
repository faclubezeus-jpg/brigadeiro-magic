import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cakesTable = pgTable("cakes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertCakeSchema = createInsertSchema(cakesTable).omit({ id: true });
export type InsertCake = z.infer<typeof insertCakeSchema>;
export type Cake = typeof cakesTable.$inferSelect;
