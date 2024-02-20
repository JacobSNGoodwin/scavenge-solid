import { FetchEvent } from '@solidjs/start/server';
import { verifyRequestOrigin } from 'lucia';
import {
	appendHeader,
	getCookie,
	getHeader,
	setResponseStatus,
} from 'vinxi/http';

import { lucia } from './lucia';

// See - https://lucia-auth.com/getting-started/solidstart
// but might need some updates for beta 0.5.0
// Consider saving user and session on event.locals
const authMiddleware = async (event: FetchEvent) => {
	console.debug('executing authMiddleware', event.request.method);
	if (event.request.method !== 'GET') {
		const originHeader = getHeader(event, 'Origin') ?? null;
		const hostHeader = getHeader(event, 'Host') ?? null;

		if (
			!originHeader ||
			!hostHeader ||
			!verifyRequestOrigin(originHeader, [hostHeader])
		) {
			setResponseStatus(event, 403);
			return;
		}
	}
	const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

	console.debug('retrieved sessionId from cookie', { sessionId });

	if (!sessionId) {
		event.locals.session = null;
		event.locals.user = null;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);

	console.info('Validated session and user', { session, user });

	if (session?.fresh) {
		console.info('Setting fresh session cookie');
		appendHeader(
			event,
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize(),
		);
	}

	if (!session) {
		console.info('no session found, creating blank session cookie');
		appendHeader(
			event,
			'Set-Cookie',
			lucia.createBlankSessionCookie().serialize(),
		);
	}
	event.locals.session = session;
	event.locals.user = user;
};

export default authMiddleware;
