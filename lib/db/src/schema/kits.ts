import { pgTable, serial, varchar, text, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kitsTable = pgTable("kits", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 50 }),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertKitSchema = createInsertSchema(kitsTable).omit({ id: true });
export type InsertKit = z.infer<typeof insertKitSchema>;
export type Kit = typeof kitsTable.$inferSelect;
