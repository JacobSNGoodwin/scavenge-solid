/// <reference types="@solidjs/start/env" />
import { Session, User } from 'lucia';
import { lucia } from './auth/lucia';

declare module '@solidjs/start/server' {
	interface RequestEventLocals {
		user: User | null;
		session: Session | null;
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

// Lets Luica know about other attributes that are available in the database
interface DatabaseUserAttributes {
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
