import { relations } from "drizzle-orm";
import {
  unique,
  sqliteTable,
  integer,
  text,
  index,
} from "drizzle-orm/sqlite-core";

/**
 * Table Defnitions
 */

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
});

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    start: integer("start", { mode: "timestamp" }).notNull(),
    end: integer("end", { mode: "timestamp" }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    startIndex: index("start_index").on(table.start),
    endIndex: index("end_index").on(table.end),
    timeUniqueConstraint: unique("time_unique_constraint").on(
      table.start,
      table.end,
      table.userId
    ),
  })
);

/**
 * Table Relations
 */

export const userRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));
