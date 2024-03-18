CREATE TABLE IF NOT EXISTS "icollect_collection" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"image" text,
	"topicId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icollect_itemTag" (
	"itemId" integer NOT NULL,
	"tagId" integer NOT NULL,
	CONSTRAINT "icollect_itemTag_itemId_tagId_pk" PRIMARY KEY("itemId","tagId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icollect_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"collectionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icollect_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "icollect_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icollect_topic" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "icollect_topic_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_collection" ADD CONSTRAINT "icollect_collection_topicId_icollect_topic_id_fk" FOREIGN KEY ("topicId") REFERENCES "icollect_topic"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_item" ADD CONSTRAINT "icollect_item_collectionId_icollect_collection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "icollect_collection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
