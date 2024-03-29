import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import * as schema from "./schema";
import { type AnyColumn, sql, SQL, AnyTable, Table, } from 'drizzle-orm';

export const db = drizzle(sqlVercel, { schema });

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};



export const updateMany = (ids: unknown[], table: Table, key: AnyColumn, value: SQL<unknown>) => {
  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`(case`);
  for (const id of ids) {
    sqlChunks.push(sql`when ${key} = ${id} then ${value}`);
  }
  sqlChunks.push(sql`end)`);
  const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));
  return finalSql;
};