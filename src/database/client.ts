import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({
	connectionString: import.meta.env.NEON_CONNECTION_STRING,
});

const db = drizzle(pool);

export default db;
