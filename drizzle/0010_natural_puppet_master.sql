ALTER TABLE "icollect_collection" ADD COLUMN "createdById" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icollect_item" ADD COLUMN "createdById" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_collection" ADD CONSTRAINT "icollect_collection_createdById_icollect_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "icollect_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_item" ADD CONSTRAINT "icollect_item_createdById_icollect_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "icollect_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
