ALTER TABLE "icollect_user" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icollect_user" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "icollect_user" ADD CONSTRAINT "icollect_user_email_unique" UNIQUE("email");