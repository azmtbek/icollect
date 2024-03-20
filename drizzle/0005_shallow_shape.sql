DO $$ BEGIN
 ALTER TABLE "icollect_itemTag" ADD CONSTRAINT "icollect_itemTag_itemId_icollect_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "icollect_item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icollect_itemTag" ADD CONSTRAINT "icollect_itemTag_tagId_icollect_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "icollect_tag"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
