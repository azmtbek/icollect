import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import * as schema from "./schema";
import { type AnyColumn, sql, type SQL } from 'drizzle-orm';

export const db = drizzle(sqlVercel, { schema });

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};



export const updateMany = (ids: unknown[], key: AnyColumn, value: SQL | boolean | string | number) => {
  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`(case`);
  for (const id of ids) {
    sqlChunks.push(sql`when ${key} = ${id} then ${value}`);
  }
  sqlChunks.push(sql`end)`);
  const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));
  console.log(finalSql);

  return finalSql;
};