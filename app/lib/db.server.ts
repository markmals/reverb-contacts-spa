import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Contacts = sqliteTable("cotnacts", {
    id: integer("id").primaryKey(),
    createdAt: text("created-at").notNull().default(new Date().toISOString()),
    first: text("first").notNull(),
    last: text("last").notNull(),
    avatar: text("avatar").notNull(),
    mastodon: text("mastodon").notNull().unique(),
    notes: text("notes"),
    favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
});

declare const env: {
    DB: D1Database;
};

export const db = drizzle(env.DB);

export type Contact = typeof Contacts.$inferSelect;
