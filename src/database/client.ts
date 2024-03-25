import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// TURSO AUTH TOKEN is required for non-local development
export const client = createClient({
	url: process.env.TURSO_CONNECTION_URL ?? '',
	authToken: process.env.TURSO_AUTH_TOKEN ?? '',
});

const db = drizzle(client);

export default db;
