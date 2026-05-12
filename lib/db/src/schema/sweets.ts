import { pgTable, serial, varchar, text, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sweetsTable = pgTable("sweets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertSweetSchema = createInsertSchema(sweetsTable).omit({ id: true });
export type InsertSweet = z.infer<typeof insertSweetSchema>;
export type Sweet = typeof sweetsTable.$inferSelect;
