ALTER TABLE "icollect_comment" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "icollect_comment_createdById_idx" ON "icollect_comment" ("createdById");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "icollect_comment_itemId_idx" ON "icollect_comment" ("itemId");