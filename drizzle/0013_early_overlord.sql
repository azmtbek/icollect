ALTER TABLE "icollect_collection" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_item" ADD COLUMN "isDeleted" boolean DEFAULT false;