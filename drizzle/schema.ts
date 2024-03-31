import { pgTable, foreignKey, text, timestamp, unique, boolean, varchar, serial, integer, index, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";



export const icollectSession = pgTable("icollect_session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => icollectUser.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});

export const icollectUser = pgTable("icollect_user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	isAdmin: boolean("isAdmin").default(false).notNull(),
	password: text("password").notNull(),
	status: varchar("status", { length: 10 }).default("'active'::character varying").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	isDeleted: boolean("isDeleted").default(false).notNull(),
},
	(table) => {
		return {
			icollectUserEmailUnique: unique("icollect_user_email_unique").on(table.email),
		};
	});

export const icollectTopic = pgTable("icollect_topic", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
},
	(table) => {
		return {
			icollectTopicNameUnique: unique("icollect_topic_name_unique").on(table.name),
		};
	});

export const icollectTag = pgTable("icollect_tag", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	count: integer("count").default(0).notNull(),
},
	(table) => {
		return {
			icollectTagNameUnique: unique("icollect_tag_name_unique").on(table.name),
		};
	});

export const icollectItem = pgTable("icollect_item", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	collectionId: integer("collectionId").notNull().references(() => icollectCollection.id, { onDelete: "cascade" }),
	likesCount: integer("likesCount").default(0),
	commentsCount: integer("commentsCount").default(0),
	createdById: text("createdById").references(() => icollectUser.id, { onDelete: "set null" }),
	isDeleted: boolean("isDeleted").default(false),
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
	customDate1: timestamp("custom_date1", { mode: 'string' }),
	customDate2: timestamp("custom_date2", { mode: 'string' }),
	customDate3: timestamp("custom_date3", { mode: 'string' }),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
},
	(table) => {
		return {
			nameIdx: index("icollect_item_name_idx").on(table.name),
		};
	});

export const icollectCollection = pgTable("icollect_collection", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	image: text("image"),
	topicId: integer("topicId").notNull().references(() => icollectTopic.id, { onDelete: "set null" }),
	createdById: text("createdById").references(() => icollectUser.id, { onDelete: "set null" }),
	customString1State: boolean("custom_string1_state").default(false).notNull(),
	customString1Name: varchar("custom_string1_name", { length: 256 }),
	customString2State: boolean("custom_string2_state").default(false).notNull(),
	customString2Name: varchar("custom_string2_name", { length: 256 }),
	customString3State: boolean("custom_string3_state").default(false).notNull(),
	customString3Name: varchar("custom_string3_name", { length: 256 }),
	customInteger1State: boolean("custom_integer1_state").default(false).notNull(),
	customInteger1Name: varchar("custom_integer1_name", { length: 256 }),
	customInteger2State: boolean("custom_integer2_state").default(false).notNull(),
	customInteger2Name: varchar("custom_integer2_name", { length: 256 }),
	customInteger3State: boolean("custom_integer3_state").default(false).notNull(),
	customInteger3Name: varchar("custom_integer3_name", { length: 256 }),
	customBoolean1State: boolean("custom_boolean1_state").default(false).notNull(),
	customBoolean1Name: varchar("custom_boolean1_name", { length: 256 }),
	customBoolean2State: boolean("custom_boolean2_state").default(false).notNull(),
	customBoolean2Name: varchar("custom_boolean2_name", { length: 256 }),
	customBoolean3State: boolean("custom_boolean3_state").default(false).notNull(),
	customBoolean3Name: varchar("custom_boolean3_name", { length: 256 }),
	customText1State: boolean("custom_text1_state").default(false).notNull(),
	customText1Name: varchar("custom_text1_name", { length: 256 }),
	customText2State: boolean("custom_text2_state").default(false).notNull(),
	customText2Name: varchar("custom_text2_name", { length: 256 }),
	customText3State: boolean("custom_text3_state").default(false).notNull(),
	customText3Name: varchar("custom_text3_name", { length: 256 }),
	customDate1State: boolean("custom_date1_state").default(false).notNull(),
	customDate1Name: varchar("custom_date1_name", { length: 256 }),
	customDate2State: boolean("custom_date2_state").default(false).notNull(),
	customDate2Name: varchar("custom_date2_name", { length: 256 }),
	customDate3State: boolean("custom_date3_state").default(false).notNull(),
	customDate3Name: varchar("custom_date3_name", { length: 256 }),
	isDeleted: boolean("isDeleted").default(false),
	itemCount: integer("itemCount").default(0).notNull(),
});

export const icollectComment = pgTable("icollect_comment", {
	id: serial("id").primaryKey().notNull(),
	text: text("text").notNull(),
	itemId: integer("itemId").notNull().references(() => icollectItem.id, { onDelete: "cascade" }),
	createdById: text("createdById").notNull().references(() => icollectUser.id, { onDelete: "set null" }),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow(),
	isEdited: boolean("isEdited").default(false),
},
	(table) => {
		return {
			createdByIdIdx: index("icollect_comment_createdById_idx").on(table.createdById),
			itemIdIdx: index("icollect_comment_itemId_idx").on(table.itemId),
		};
	});

export const icollectItemTag = pgTable("icollect_itemTag", {
	itemId: integer("itemId").notNull().references(() => icollectItem.id, { onDelete: "cascade" }),
	tagId: integer("tagId").notNull().references(() => icollectTag.id, { onDelete: "cascade" }),
},
	(table) => {
		return {
			icollectItemTagItemIdTagIdPk: primaryKey({ columns: [table.itemId, table.tagId], name: "icollect_itemTag_itemId_tagId_pk" })
		};
	});

export const icollectLike = pgTable("icollect_like", {
	itemId: integer("itemId").notNull().references(() => icollectItem.id, { onDelete: "cascade" }),
	userId: text("userId").notNull().references(() => icollectUser.id, { onDelete: "cascade" }),
},
	(table) => {
		return {
			icollectLikeItemIdUserIdPk: primaryKey({ columns: [table.itemId, table.userId], name: "icollect_like_itemId_userId_pk" })
		};
	});

export const icollectVerificationToken = pgTable("icollect_verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
	(table) => {
		return {
			icollectVerificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "icollect_verificationToken_identifier_token_pk" })
		};
	});

export const icollectAccount = pgTable("icollect_account", {
	userId: text("userId").notNull().references(() => icollectUser.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
	(table) => {
		return {
			icollectAccountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "icollect_account_provider_providerAccountId_pk" })
		};
	});