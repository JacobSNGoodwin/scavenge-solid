import { FetchEvent } from '@solidjs/start/server';
import { Session, User, verifyRequestOrigin } from 'lucia';
import { appendHeader, getCookie, getHeader } from 'vinxi/http';

import { lucia } from './lucia';

// See - https://lucia-auth.com/getting-started/solidstart
// but might need some updates for beta 0.5.0
// Consider saving user and session on event.locals
const authMiddleware = async (event: FetchEvent) => {};

declare module '@solidjs/start/server' {
	interface RequestEventLocals {
		user: User; // Should we fetch merely auth user, or full User? We could create a requireUser server function to hydrate the user object
		session: Session;
	}
}

export default authMiddleware;
