import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  shopName: varchar("shop_name", { length: 255 }).notNull().default("Docinho & Cia"),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 50 }).notNull().default("#F4A7B9"),
  secondaryColor: varchar("secondary_color", { length: 50 }).notNull().default("#E8D5F5"),
  accentColor: varchar("accent_color", { length: 50 }).notNull().default("#F4D03F"),
  whatsappNumber: varchar("whatsapp_number", { length: 30 }).notNull().default("5511999999999"),
  whatsappMessage: text("whatsapp_message").notNull().default("Olá! Vim pelo site e gostaria de fazer um pedido 🍫"),
  address: text("address"),
  phone: varchar("phone", { length: 30 }),
  instagram: varchar("instagram", { length: 100 }),
  facebook: varchar("facebook", { length: 100 }),
  tiktok: varchar("tiktok", { length: 100 }),
  footerText: text("footer_text"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
