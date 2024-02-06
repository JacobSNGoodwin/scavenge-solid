import { Suspense } from 'solid-js';
import {
	createAsync,
	RouteDefinition,
	RouteSectionProps,
	cache,
} from '@solidjs/router';
import { verifiers } from '~/auth/providers';
import { getRequestEvent } from 'solid-js/web';
import { getCookie } from 'vinxi/http';

const verifyAuth = cache(async (provider: string) => {
	'use server';
	const event = getRequestEvent();

	if (!event) {
		throw new Error('No event found');
	}

	try {
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

		const user = await verifier(verifierParams);
		console.debug('the user', user);
		return user;
	} catch (error) {
		console.error('Error verifying user', error);
		return {};
	}
}, 'verify-provider');

export const route = {
	load: async ({ params, location }) => {
		verifyAuth(params.provider);
	},
} satisfies RouteDefinition;

const ProviderCallback = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	createAsync(() => verifyAuth(provider()));

	return (
		<Suspense fallback="Loading...">
			<h1 class="text-xl">
				Verifying {provider().toUpperCase()} Authorization
			</h1>
		</Suspense>
	);
};

export default ProviderCallback;
