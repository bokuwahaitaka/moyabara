// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const posts=sqliteTable("posts",{id:integer("id").primaryKey({autoIncrement:true}),category:text("category").notNull(),body:text("body").notNull(),empathy:integer("empathy").notNull().default(0),same:integer("same").notNull().default(0),reports:integer("reports").notNull().default(0),status:text("status").notNull().default("visible"),createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)});
