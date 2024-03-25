import type { Config } from 'drizzle-kit';

// Since this is used in the build process, we can't use import.meta.env
// but bun supports process.env from dotenv files
export default {
	schema: './src/database/schema.ts',
	out: './drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL ?? '',
		authToken: process.env.TURSO_AUTH_TOKEN ?? '',
	},
} satisfies Config;
