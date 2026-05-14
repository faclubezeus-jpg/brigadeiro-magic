import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
});
