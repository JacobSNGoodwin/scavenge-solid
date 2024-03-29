import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import db from '../database/client';
import { session, user } from '../database/schema';

const adapter = new DrizzleSQLiteAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (attributes) => attributes,
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

// Lets Luica know about other attributes that are available in the database
export interface DatabaseUserAttributes {
	name: string;
	email: string;
	imageUrl: string | null;
	connections: {
		google?: string;
		facebook?: string;
	};
}
// interface DatabaseSessionAttributes {
// Add additional attributes here
// }
