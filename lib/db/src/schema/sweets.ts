import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sweetsTable = pgTable("sweets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertSweetSchema = createInsertSchema(sweetsTable).omit({ id: true });
export type InsertSweet = z.infer<typeof insertSweetSchema>;
export type Sweet = typeof sweetsTable.$inferSelect;
