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

import { tsvector } from "./tsvector";
import { sql } from "drizzle-orm";


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
  itemCount: integer("itemCount").notNull().default(0),

  // custom fields 
  customString1State: boolean("custom_string1_state").notNull().default(false),
  customString1Name: varchar("custom_string1_name", { length: 256 }),
  customString2State: boolean("custom_string2_state").notNull().default(false),
  customString2Name: varchar("custom_string2_name", { length: 256 }),
  customString3State: boolean("custom_string3_state").notNull().default(false),
  customString3Name: varchar("custom_string3_name", { length: 256 }),

  customInteger1State: boolean("custom_integer1_state").notNull().default(false),
  customInteger1Name: varchar("custom_integer1_name", { length: 256 }),
  customInteger2State: boolean("custom_integer2_state").notNull().default(false),
  customInteger2Name: varchar("custom_integer2_name", { length: 256 }),
  customInteger3State: boolean("custom_integer3_state").notNull().default(false),
  customInteger3Name: varchar("custom_integer3_name", { length: 256 }),

  customBoolean1State: boolean("custom_boolean1_state").notNull().default(false),
  customBoolean1Name: varchar("custom_boolean1_name", { length: 256 }),
  customBoolean2State: boolean("custom_boolean2_state").notNull().default(false),
  customBoolean2Name: varchar("custom_boolean2_name", { length: 256 }),
  customBoolean3State: boolean("custom_boolean3_state").notNull().default(false),
  customBoolean3Name: varchar("custom_boolean3_name", { length: 256 }),

  customText1State: boolean("custom_text1_state").notNull().default(false),
  customText1Name: varchar("custom_text1_name", { length: 256 }),
  customText2State: boolean("custom_text2_state").notNull().default(false),
  customText2Name: varchar("custom_text2_name", { length: 256 }),
  customText3State: boolean("custom_text3_state").notNull().default(false),
  customText3Name: varchar("custom_text3_name", { length: 256 }),

  customDate1State: boolean("custom_date1_state").notNull().default(false),
  customDate1Name: varchar("custom_date1_name", { length: 256 }),
  customDate2State: boolean("custom_date2_state").notNull().default(false),
  customDate2Name: varchar("custom_date2_name", { length: 256 }),
  customDate3State: boolean("custom_date3_state").notNull().default(false),
  customDate3Name: varchar("custom_date3_name", { length: 256 }),
});

export const items = pgTable("item", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  likesCount: integer("likesCount").default(0),
  commentsCount: integer("commentsCount").default(0),
  collectionId: integer("collectionId").notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  createdById: text("createdById")
    .references(() => users.id, { onDelete: "set null" }),
  isDeleted: boolean("isDeleted").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),

  // custom fields 
  customString1: varchar("custom_string1", { length: 256 }),
  customString2: varchar("custom_string2", { length: 256 }),
  customString3: varchar("custom_string3", { length: 256 }),

  customInteger1: integer("custom_integer1"),
  customInteger2: integer("custom_integer2"),
  customInteger3: integer("custom_integer3"),

  customBoolean1: boolean("custom_boolean1"),
  customBoolean2: boolean("custom_boolean2"),
  customBoolean3: boolean("custom_boolean3"),

  customText1: text("custom_text1"),
  customText2: text("custom_text2"),
  customText3: text("custom_text3"),

  customDate1: timestamp("custom_date1"),
  customDate2: timestamp("custom_date2"),
  customDate3: timestamp("custom_date3"),
  fts: tsvector("fts", {
    sources: [
      "name",
      "custom_string1",
      "custom_string2",
      "custom_string3",
      "custom_text1",
      "custom_text2",
      "custom_text3",
    ],
  }),
},
  (item) => ({
    nameIdx: index("icollect_item_name_idx").on(item.name),
    // this doesn't work becuase no spoprot for 
    ftsIdx: index("icollect_item_fts_idx").on(item.fts).using(sql`gin(${item.fts})`),
  })
);

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
  name: text("name").unique().notNull(),
  count: integer("count").notNull().default(0)
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
  status: varchar("status", { length: 10 }).notNull().default("active"),
  isAdmin: boolean("isAdmin").notNull().default(false),
  isDeleted: boolean("isDeleted").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
