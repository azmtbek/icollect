ALTER TABLE "icollect_collection" ADD COLUMN "itemCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "icollect_item" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;