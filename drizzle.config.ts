import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL || '',
    //   host: POSTGRESenv.POSTGRES_HOST || '',
    //   password: env.POSTGRES_PASSWORD,
    //   database: env.POSTGRES_DATABASE,
    //   user: env.POSTGRES_USER,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["icollect_*"],
} satisfies Config;
