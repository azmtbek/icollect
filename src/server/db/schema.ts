import {
  index,
  primaryKey,
  text,
  integer,
  pgTableCreator,
  timestamp,
  serial,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `icollect_${name}`);

export const collections = pgTable("collection", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  topicId: integer("topicId").notNull()
    .references(() => topics.id, { onDelete: "set null" }),
  createdById: text("createdById")
    .references(() => users.id, { onDelete: "set null" }),
  isDeleted: boolean("isDeleted").default(false),

  // custom fields 
  custom_string1_state: boolean("custom_string1_state").default(false),
  custom_string1_name: varchar("custom_string1_name", { length: 256 }),
  custom_string2_state: boolean("custom_string2_state").default(false),
  custom_string2_name: varchar("custom_string2_name", { length: 256 }),
  custom_string3_state: boolean("custom_string3_state").default(false),
  custom_string3_name: varchar("custom_string3_name", { length: 256 }),

  custom_integer1_state: boolean("custom_integer1_state").default(false),
  custom_integer1_name: varchar("custom_integer1_name", { length: 256 }),
  custom_integer2_state: boolean("custom_integer2_state").default(false),
  custom_integer2_name: varchar("custom_integer2_name", { length: 256 }),
  custom_integer3_state: boolean("custom_integer3_state").default(false),
  custom_integer3_name: varchar("custom_integer3_name", { length: 256 }),

  custom_boolean1_state: boolean("custom_boolean1_state").default(false),
  custom_boolean1_name: varchar("custom_boolean1_name", { length: 256 }),
  custom_boolean2_state: boolean("custom_boolean2_state").default(false),
  custom_boolean2_name: varchar("custom_boolean2_name", { length: 256 }),
  custom_boolean3_state: boolean("custom_boolean3_state").default(false),
  custom_boolean3_name: varchar("custom_boolean3_name", { length: 256 }),

  custom_text1_state: boolean("custom_text1_state").default(false),
  custom_text1_name: varchar("custom_text1_name", { length: 256 }),
  custom_text2_state: boolean("custom_text2_state").default(false),
  custom_text2_name: varchar("custom_text2_name", { length: 256 }),
  custom_text3_state: boolean("custom_text3_state").default(false),
  custom_text3_name: varchar("custom_text3_name", { length: 256 }),

  custom_date1_state: boolean("custom_date1_state").default(false),
  custom_date1_name: varchar("custom_date1_name", { length: 256 }),
  custom_date2_state: boolean("custom_date2_state").default(false),
  custom_date2_name: varchar("custom_date2_name", { length: 256 }),
  custom_date3_state: boolean("custom_date3_state").default(false),
  custom_date3_name: varchar("custom_date3_name", { length: 256 }),
});

export const items = pgTable("item", {
  id: serial("id").notNull().primaryKey(),
  name: text("name"),
  likesCount: integer("likesCount").default(0),
  commentsCount: integer("commentsCount").default(0),
  collectionId: integer("collectionId").notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  createdById: text("createdById")
    .references(() => users.id, { onDelete: "set null" }),
  isDeleted: boolean("isDeleted").default(false),

  // custom fields 
  custom_string1: varchar("custom_string1", { length: 256 }),
  custom_string2: varchar("custom_string2", { length: 256 }),
  custom_string3: varchar("custom_string3", { length: 256 }),

  custom_integer1: integer("custom_integer1"),
  custom_integer2: integer("custom_integer2"),
  custom_integer3: integer("custom_integer3"),

  custom_boolean1: boolean("custom_boolean1"),
  custom_boolean2: boolean("custom_boolean2"),
  custom_boolean3: boolean("custom_boolean3"),

  custom_text1: text("custom_text1"),
  custom_text2: text("custom_text2"),
  custom_text3: text("custom_text3"),

  custom_date1: timestamp("custom_date1"),
  custom_date2: timestamp("custom_date2"),
  custom_date3: timestamp("custom_date3"),
});

export const itemTags = pgTable(
  "itemTag",
  {
    itemId: integer("itemId").notNull().references(() => items.id, { onDelete: "cascade" }),
    tagId: integer("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
  },
  (it) => ({
    compoundKey: primaryKey({ columns: [it.itemId, it.tagId] })
  })
);

export const tags = pgTable("tag", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").unique().notNull()
});

export const comments = pgTable(
  "comment",
  {
    id: serial("id").notNull().primaryKey(),
    text: text("text").notNull(),
    itemId: integer("itemId").notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    createdById: text("createdById").notNull()
      .references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
    isEdited: boolean("isEdited").default(false),
  },
  (comment) => ({
    createdByIdIdx: index("icollect_comment_createdById_idx").on(comment.createdById),
    itemIdIndex: index("icollect_comment_itemId_idx").on(comment.itemId),
  })
);

export const likes = pgTable(
  "like",
  {
    itemId: integer("itemId").notNull().references(() => items.id, { onDelete: "cascade" }),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (l) => ({
    compoundKey: primaryKey({ columns: [l.itemId, l.userId] })
  })
);

export const topics = pgTable("topic", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").unique().notNull()
});

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  status: varchar("status", { length: 10 }).default("active"),
  isAdmin: boolean("isAdmin").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
