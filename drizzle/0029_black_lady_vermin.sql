-- ALTER TABLE "icollect_item" ADD COLUMN "fts" "tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(custom_string1, '') || ' ' || coalesce(custom_string2, '') || ' ' || coalesce(custom_string3, '') || ' ' || coalesce(custom_text1, '') || ' ' || coalesce(custom_text2, '') || ' ' || coalesce(custom_text3, ''))) stored";