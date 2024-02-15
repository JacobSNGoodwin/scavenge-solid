import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '../database/client';
import { session, user } from '../database/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD,
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
	// Lets Luica know about other attributes that are available in the database
	interface DatabaseUserAttributes {
		name: string;
		email: string;
		imageUrl: string | null;
		connections: {
			github?: string;
			facebook?: string;
		};
	}
	// interface DatabaseSessionAttributes {
	// Add additional attributes here
	// }
}
