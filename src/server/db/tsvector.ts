import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";

export const tsvector = customType<{
  data: string;
  config: { sources: string[]; };

}>({
  dataType(_config) {

    // Config change is done manually in sql server, drizzle orm hasn't a problem wrapping datatype return in
    // "" (double quotes).
    // https://github.com/drizzle-team/drizzle-orm/issues/247
    // untill the issue is resolved let it rot here.

    // if (config) {
    //   const sources = config.sources.map(s => `coalesce(${s}, '')`).join(" || ' ' || ");
    //   return `tsvector GENERATED ALWAYS AS (to_tsvector('simple', ${sources})) STORED`;
    // } else {
    //   return `tsvector`;
    // }
    return `tsvector`;
  },
  toDriver(value: string) {
    return sql`${value}`;
  },
  fromDriver(value: unknown) {
    return value as string;
  }
});