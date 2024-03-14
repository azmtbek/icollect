import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { env } from "@/env";
import * as schema from "./schema";

// const client = createClient({
//   url: env.DATABASE_URL,
//   authToken: env.NODE_ENV !== 'development'
//     ? env.DATABASE_AUTH_TOKEN
//     : undefined
// });



export const db = drizzle(sql, { schema });

// await migrate(db, { migrationsFolder: "drizzle" });
// await sql.end();