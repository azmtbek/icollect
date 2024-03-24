DROP TABLE "icollect_post";--> statement-breakpoint
ALTER TABLE "icollect_collection" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string1_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string1_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string2_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string2_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string3_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_string3_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer1_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer1_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer2_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer2_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer3_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_integer3_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean1_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean1_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean2_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean2_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean3_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_boolean3_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text1_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text1_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text2_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text2_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text3_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_text3_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date1_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date1_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date2_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date2_name" varchar(256);--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date3_state" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icollect_collection" ADD COLUMN "custom_date3_name" varchar(256);