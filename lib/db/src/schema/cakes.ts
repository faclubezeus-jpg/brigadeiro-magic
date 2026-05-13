import { pgTable, serial, varchar, text, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cakesTable = pgTable("cakes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertCakeSchema = createInsertSchema(cakesTable).omit({ id: true });
export type InsertCake = z.infer<typeof insertCakeSchema>;
export type Cake = typeof cakesTable.$inferSelect;
