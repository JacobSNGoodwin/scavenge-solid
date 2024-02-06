import { redirect } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { setCookie } from 'vinxi/http';
import { authorizers } from '~/auth/providers';

export async function GET(event: APIEvent) {
	const { provider } = event.params;

	console.debug('Redirecting to auth for following provider', { provider });

	// figure out error handling
	if (!authorizers[provider]) {
		console.warn('Providers does not exist', { provider });
		throw redirect('/');
	}

	const { url, state, codeVerifier } = await authorizers[provider]();

	console.debug('Created the followin authorizer data', {
		url,
		state,
		codeVerifier,
	});

	// store state verifier as cookie
	setCookie(event, 'state', state, {
		secure: true, // set to false in localhost
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});

	// store code verifier as cookie
	if (codeVerifier) {
		setCookie(event, 'code_verifier', codeVerifier, {
			secure: true, // set to false in localhost
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});
	}

	return redirect(url.toString());
}
