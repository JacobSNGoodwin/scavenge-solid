import {
	RouteDefinition,
	RouteSectionProps,
	cache,
	createAsync,
	redirect,
} from '@solidjs/router';
import { Suspense, getRequestEvent } from 'solid-js/web';
import { setCookie } from 'vinxi/http';
import { authorizers } from '~/auth/providers';

const getAuthUrl = cache(async (provider: string) => {
	'use server';
	const event = getRequestEvent();

	// This is to satisfy typescript
	if (!event) {
		throw new Error('No event found');
	}

	console.debug('Redirecting to auth for following provider', { provider });

	// figure out error handling
	if (!authorizers[provider]) {
		console.warn('Providers does not exist', { provider });
		throw redirect('/');
	}

	const { url, state, codeVerifier } = await authorizers[provider]();

	console.debug('Created the following authorizer data', {
		url,
		state,
		codeVerifier,
	});

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

	console.debug('redirecting to', {
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

export const route = {
	load: ({ params }) => {
		getAuthUrl(params.provider);
	},
} satisfies RouteDefinition;

// TODO - how to handle errors here?
const ProviderLogin = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	createAsync(() => getAuthUrl(provider()));
	return (
		<Suspense fallback="Loading...">
			<h1 class="text-xl">Provider Login</h1>
		</Suspense>
	);
};

export default ProviderLogin;
