ALTER TABLE "icollect_item" ADD COLUMN "likesCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "icollect_item" ADD COLUMN "commentsCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "icollect_itemTag" DROP COLUMN IF EXISTS "likesCount";--> statement-breakpoint
ALTER TABLE "icollect_itemTag" DROP COLUMN IF EXISTS "commentCount";