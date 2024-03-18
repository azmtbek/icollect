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
export const collections = pgTable(
  "collection",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name"),
    description: text("description"),
    image: text("image"),
    topicId: integer("topicId").notNull()
      .references(() => topics.id, { onDelete: "set null" }),
  }
);
export const items = pgTable(
  "item",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name"),
    collectionId: integer("collectionId").notNull()
      .references(() => collections.id, { onDelete: "cascade" })
  }
);

export const itemTags = pgTable(
  "itemTag",
  {
    itemId: integer("itemId").notNull(),
    tagId: integer("tagId").notNull(),
  },
  (it) => ({
    compoundKey: primaryKey({ columns: [it.itemId, it.tagId] })
  })
);
export const tags = pgTable(
  "tag",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name").unique().notNull()
  },
);

export const topics = pgTable(
  "topic",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name").unique().notNull()
  }
);

export const posts = pgTable(
  "post",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name"),
    createdById: text("createdById").notNull(),
    createdAt: timestamp("created_at")
      .defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

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
