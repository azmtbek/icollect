ALTER TABLE "icollect_item" ADD COLUMN "fts" tsvector;
UPDATE "icollect_item" SET search_vector = to_tsvector('simple', 'name' || ' ' || custom_string1 || ' ' || custom_string2 || ' ' || custom_string3 || ' ' || custom_text1 || ' ' || custom_text2 || ' ' || custom_text3) stored;

CREATE INDEX IF NOT EXISTS "icollect_item_fts_idx" ON "icollect_item" USING gin("fts");