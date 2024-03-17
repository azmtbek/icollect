ALTER TABLE "icollect_user" ALTER COLUMN "status" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "icollect_user" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "icollect_user" ADD COLUMN "createdAt" timestamp DEFAULT now();