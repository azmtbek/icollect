DROP INDEX IF EXISTS "icollect_item_fts_idx";--> statement-breakpoint
ALTER TABLE "icollect_item" DROP COLUMN IF EXISTS "fts";