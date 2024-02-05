import type { Config } from 'drizzle-kit';

export default {
	schema: './src/database/schema.ts',
	out: './drizzle/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: import.meta.env.NEON_CONNECTION_STRING,
	},
} satisfies Config;
