import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

console.debug('connection string', process.env?.NEON_CONNECTION_STRING);

export const pool = new Pool({
	connectionString: process.env?.NEON_CONNECTION_STRING,
});

const db = drizzle(pool);

export default db;
