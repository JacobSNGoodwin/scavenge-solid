import { FetchEvent } from '@solidjs/start/server';
import { verifyRequestOrigin } from 'lucia';
import {
	appendHeader,
	getCookie,
	getHeader,
	setResponseStatus,
} from 'vinxi/http';

import { lucia } from './lucia';
import logger from '~/logger';

const log = logger.child({ namespace: 'auth-middleware' });

// See - https://lucia-auth.com/getting-started/solidstart
// but might need some updates for beta 0.5.0
// Consider saving user and session on event.locals
const authMiddleware = async (event: FetchEvent) => {
	log.debug(
		{ method: event.request.method },
		'executing authMiddleware for method',
	);
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

	log.debug({ sessionId }, 'retrieved sessionId from cookie');

	if (!sessionId) {
		event.locals.session = null;
		event.locals.user = null;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);

	log.info({ session, user }, 'Validated session and user');

	if (session?.fresh) {
		log.debug('Setting fresh session cookie');
		appendHeader(
			event,
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize(),
		);
	}

	if (!session) {
		log.debug('no session found, creating blank session cookie');
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
