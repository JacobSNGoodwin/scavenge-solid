import type { Config } from 'drizzle-kit';

// Since this is used in the build process, we can't use import.meta.env
// but bun supports process.env from dotenv files
export default {
	schema: './src/database/schema.ts',
	out: './drizzle/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env?.POSTGRES_CONNECTION_STRING ?? '',
	},
} satisfies Config;
