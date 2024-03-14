import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createClient } from '@libsql/client';

import { env } from "@/env";
import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.NODE_ENV !== 'development'
    ? env.DATABASE_AUTH_TOKEN
    : undefined
});

export const db = drizzle(client, { schema });
