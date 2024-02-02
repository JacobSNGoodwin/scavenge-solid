import {
	FetchEvent,
	appendHeader,
	sendRedirect,
	getResponseHeaders,
	getRequestHeaders,
} from '@solidjs/start/server';
import clerk from './clerkClientServer';

const authMiddleware = async (event: FetchEvent) => {
	console.debug('all the request headers\n\n', getRequestHeaders(event));
	const request = event.request;

	const requestState = await clerk.authenticateRequest(request);

	// TODO - why is requestState.status always signed-out?
	// when we receive a post request from the server?
	console.info('The request state', {
		// event,
		// request,
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

	console.debug('all of the response headers!', getResponseHeaders(event));

	if (requestState.status === 'signed-out') {
		console.debug('user is signed out - returning null for user');
		event.locals.user = null;
	}

	if (requestState.status === 'handshake') {
		console.debug(
			'returning handshake redirect',
			requestState.headers.get('location'),
		);
		return sendRedirect(event, requestState.headers.get('location') ?? '', 307);
	}

	// proper cookies should have been applied via reuestState.headers. Set user on locals
	const auth = requestState.toAuth();

	if (!auth.userId) {
		event.locals.user = null;
		return;
	}

	event.locals.user = await clerk.users.getUser(auth.userId);
};

export default authMiddleware;
