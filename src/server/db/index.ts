import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import * as schema from "./schema";
import { type AnyColumn, sql, } from 'drizzle-orm';

export const db = drizzle(sqlVercel, { schema });

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

