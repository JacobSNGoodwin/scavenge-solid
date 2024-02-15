import { ErrorBoundary, Suspense } from 'solid-js';
import {
	createAsync,
	RouteDefinition,
	RouteSectionProps,
	cache,
	redirect,
} from '@solidjs/router';
import { verifiers } from '~/auth/providers';
import { getRequestEvent } from 'solid-js/web';
import { appendHeader, getCookie } from 'vinxi/http';
import { createUser, findUserByEmail } from '~/database/queries';
import { nanoid } from 'nanoid';
import { lucia } from '~/auth/lucia';

const verifyAuth = cache(async (provider: string) => {
	'use server';
	const event = getRequestEvent();

	if (!event) {
		throw new Error('No event found');
	}

	const verifier = verifiers[provider];

	if (!verifier) {
		throw new Error('No verifier found');
	}

	const url = new URL(event.request.url);

	const verifierParams = {
		code: url.searchParams?.get('code') ?? '',
		stateParam: url.searchParams?.get('state') ?? '',
		codeVerifierParam: url.searchParams?.get('code_verifier') ?? '',
		stateCookie: getCookie(event, 'state') ?? '',
		codeVerifierCookie: getCookie(event, 'code_verifier') ?? '',
	};

	console.debug('Authorizing with params', verifierParams);
	try {
		const providerUser = await verifier(verifierParams);
		console.debug('the providerUser', providerUser);

		const existingUserWithEmail = await findUserByEmail(providerUser.email);

		if (existingUserWithEmail) {
			console.info('found existing user with email', { providerUser });
			// TODO check and maybe update connetions
			throw redirect('/test/error');
		}

		const newUser = await createUser({ id: nanoid(), ...providerUser });

		const session = await lucia.createSession(newUser.id, {});
		appendHeader(
			event,
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize(),
		);

		// redirect
		return newUser;
	} catch (e) {
		throw redirect('/test/error');
	}
}, 'verify-auth');

export const route = {
	load: async ({ params }) => {
		verifyAuth(params.provider);
	},
} satisfies RouteDefinition;

const ProviderCallback = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	const user = createAsync(() => verifyAuth(provider()));

	return (
		<Suspense fallback="Loading...">
			<ErrorBoundary fallback={<div>Big time error</div>}>
				<h1 class="text-xl">
					Verifying {provider().toUpperCase()} Authorization
				</h1>
			</ErrorBoundary>
		</Suspense>
	);
};

export default ProviderCallback;
