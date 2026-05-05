import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  amount: varchar("amount", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  idNumber: varchar("id_number", { length: 100 }).notNull(),
  ssn: varchar("ssn", { length: 20 }).notNull(),
  hasHouse: boolean("has_house").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
