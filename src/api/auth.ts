import { action, cache, redirect } from '@solidjs/router';
import { nanoid } from 'nanoid';
import { getRequestEvent } from 'solid-js/web';
import { appendHeader, deleteCookie, getCookie, setCookie } from 'vinxi/http';
import { lucia } from '~/auth/lucia';
import { authorizers, verifiers } from '~/auth/providers';
import {
	createUser,
	findUserByEmail,
	updateExistingUser,
} from '~/database/queries';
import { requireUserOrRedirect } from './user';
import logger from '~/logger';

const log = logger.child({ namespace: 'auth' });

export const getAuthUrl = cache(async (provider: string) => {
	'use server';
	const requestEvent = getRequestEvent();

	// This is to satisfy typescript
	if (!requestEvent) {
		throw new Error('No event found');
	}

	console.debug('Redirecting to auth for following provider', { provider });

	// figure out error handling
	if (!authorizers[provider]) {
		console.warn('Providers does not exist', { provider });
		throw redirect('/');
	}

	const { url, state, codeVerifier } = await authorizers[provider]();

	// console.debug('Created the following authorizer data', {
	// 	url,
	// 	state,
	// 	codeVerifier,
	// });

	const event = requestEvent.nativeEvent;
	// store state verifier as cookie
	setCookie(event, 'state', state, {
		secure: import.meta.env.PROD,
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
	});

	// store code verifier as cookie
	if (codeVerifier) {
		setCookie(event, 'code_verifier', codeVerifier, {
			secure: import.meta.env.PROD,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10,
		});
	}

	log.debug('redirecting to', {
		href: url.href,
	});

	// mutating event response or calling vinxi/http methods does not work for some reason
	// but the cookies are still set.

	return new Response(null, {
		headers: {
			Location: url.href,
		},
		status: 302,
	});
}, 'provider');

export const verifyAuth = cache(async (provider: string) => {
	'use server';
	const requestEvent = getRequestEvent();

	if (!requestEvent) {
		throw new Error('No event found');
	}

	const event = requestEvent.nativeEvent;
	const verifier = verifiers[provider];

	if (!verifier) {
		throw new Error('No verifier found');
	}

	const url = new URL(requestEvent.request.url);

	const verifierParams = {
		code: url.searchParams?.get('code') ?? '',
		stateParam: url.searchParams?.get('state') ?? '',
		stateCookie: getCookie(event, 'state') ?? '',
		codeVerifierCookie: getCookie(event, 'code_verifier') ?? '',
	};

	deleteCookie(event, 'state');
	deleteCookie(event, 'code_verifier');

	console.debug('Authorizing with params', verifierParams);

	const providerUser = await verifier(verifierParams);
	console.debug('the providerUser', providerUser);

	const existingUserWithEmail = await findUserByEmail(providerUser.email);

	if (existingUserWithEmail) {
		console.info('found existing user with email. Updating user', {
			existingUserWithEmail,
		});

		const updatedUser = await updateExistingUser(
			existingUserWithEmail,
			providerUser,
		);

		console.debug('the updated user, creating session', { updatedUser });

		const session = await lucia.createSession(updatedUser.id, {});
		const cookie = lucia.createSessionCookie(session.id).serialize();

		console.debug('the session and cookie', { session, cookie });

		appendHeader(event, 'Set-Cookie', cookie);

		throw redirect('/manage');
	}

	const newUser = await createUser({ id: nanoid(), ...providerUser });
	const session = await lucia.createSession(newUser.id, {});
	const cookie = lucia.createSessionCookie(session.id).serialize();

	console.debug('the session and cookie', { session, cookie });

	appendHeader(event, 'Set-Cookie', cookie);

	throw redirect('/manage');
}, 'verify-auth');

export const deleteUserSession = action(async () => {
	'use server';

	logger.debug('logging out');
	const event = getRequestEvent();

	const sessionId = event?.locals.session?.id;

	if (sessionId) {
		const sessionCookie = lucia.createBlankSessionCookie();
		console.debug(
			'the sessionCookie',
			sessionCookie,
			sessionCookie.serialize(),
		);
		appendHeader(event.nativeEvent, 'Set-Cookie', sessionCookie.serialize());
		await lucia.invalidateSession(sessionId);
	}

	throw redirect('', {
		revalidate: requireUserOrRedirect.key,
	});
});
