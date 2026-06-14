import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

let dbInstance;

export function getDb() {
  const connectionString = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

  if (!connectionString) {
    throw new Error(
      "Add NEXT_PUBLIC_DRIZZLE_DB_URL to .env.local before using the database."
    );
  }

  if (!dbInstance) {
    const sql = neon(connectionString);
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}
