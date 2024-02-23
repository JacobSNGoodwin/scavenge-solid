import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({
	connectionString: process.env?.POSTGRES_CONNECTION_STRING,
});

const db = drizzle(pool);

export default db;
