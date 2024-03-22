CREATE TABLE IF NOT EXISTS "icollect_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text,
	"itemId" integer NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"isEdited" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icollect_like" (
	"itemId" integer NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "icollect_like_itemId_userId_pk" PRIMARY KEY("itemId","userId")
);
--> statement-breakpoint
ALTER TABLE "icollect_itemTag" ADD COLUMN "likesCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "icollect_itemTag" ADD COLUMN "commentCount" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_comment" ADD CONSTRAINT "icollect_comment_itemId_icollect_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "icollect_item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_comment" ADD CONSTRAINT "icollect_comment_createdById_icollect_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "icollect_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_like" ADD CONSTRAINT "icollect_like_itemId_icollect_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "icollect_item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_like" ADD CONSTRAINT "icollect_like_userId_icollect_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icollect_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
