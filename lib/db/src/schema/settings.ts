import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shopName: text("shop_name").notNull().default("Docinho O Docinho"),
  logoUrl: text("logo_url"),
  heroVideoUrl: text("hero_video_url"),
  primaryColor: text("primary_color").notNull().default("#F4A7B9"),
  secondaryColor: text("secondary_color").notNull().default("#E8D5F5"),
  accentColor: text("accent_color").notNull().default("#F4D03F"),
  whatsappNumber: text("whatsapp_number").notNull().default("5511999999999"),
  whatsappMessage: text("whatsapp_message").notNull().default("Olá! Vim pelo site e gostaria de fazer um pedido 🍫"),
  address: text("address"),
  phone: text("phone"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  tiktok: text("tiktok"),
  footerText: text("footer_text"),
  aboutTitle: text("about_title").notNull().default("Sobre Nós"),
  aboutText: text("about_text").notNull().default("A Docinho & Cia nasceu de uma paixão: transformar ingredientes simples em experiências extraordinárias. Cada brigadeiro que sai da nossa cozinha carrega horas de dedicação, ingredientes cuidadosamente selecionados e, acima de tudo, muito amor.\n\nNossa confeitaria é mais do que uma loja — é um ateliê de sonhos. Cada pedido é uma oportunidade de fazer parte de um momento especial na vida de alguém: um aniversário, um casamento, uma declaração de amor.\n\nTrabalhamos com cacau de origem, frutas frescas e coberturas premium para garantir que cada mordida seja uma experiência única. Porque você merece o melhor."),
  aboutMediaUrl: text("about_media_url").notNull().default("https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"),
  aboutStat1Number: text("about_stat1_number").notNull().default("500+"),
  aboutStat1Label: text("about_stat1_label").notNull().default("Pedidos por mês"),
  aboutStat2Number: text("about_stat2_number").notNull().default("50+"),
  aboutStat2Label: text("about_stat2_label").notNull().default("Sabores exclusivos"),
  aboutStat3Number: text("about_stat3_number").notNull().default("5★"),
  aboutStat3Label: text("about_stat3_label").notNull().default("Avaliação média"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
