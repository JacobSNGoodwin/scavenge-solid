import {
	FetchEvent,
	appendHeader,
	sendRedirect,
	getQuery,
	setHeader,
} from '@solidjs/start/server';
import clerk from './clerk';

const authMiddleware = async (event: FetchEvent) => {
	const request = event.request;

	const requestState = await clerk.authenticateRequest(request);

	console.info('The request state', {
		requestUrl: request.url,
		requestState,
	});

	appendHeader(
		event,
		'x-clerk-auth-status',
		encodeURIComponent(requestState.status),
	);

	if (requestState.reason) {
		appendHeader(
			event,
			'x-clerk-auth-reason',
			encodeURIComponent(requestState.reason),
		);
	}

	if (requestState.message) {
		appendHeader(
			event,
			'x-clerk-auth-message',
			encodeURIComponent(requestState.message),
		);
	}

	requestState.headers.forEach((value, name) => {
		appendHeader(event, name, value);
	});

	if (requestState.status === 'signed-out') {
		console.debug('user is signed out - returning null for user');
		event.locals.user = null;
	}

	if (requestState.status === 'handshake') {
		console.debug('returning handshake redirect');
		return sendRedirect(event, requestState.headers.get('location') ?? '', 307);
	}

	// proper cookies should have been applied via reuestState.headers. Set user on locals
	const auth = requestState.toAuth();

	if (!auth.userId) {
		event.locals.user = null;
		return;
	}

	// don't scare the hell out of users with clerk query parameters :)
	const url = new URL(request.url);
	url.searchParams.delete('__clerk_handshake');
	url.searchParams.delete('__clerk_help');

	setHeader(event, 'Location', url.toString());

	console.log(url);
	event.locals.user = await clerk.users.getUser(auth.userId);
};

export default authMiddleware;
