import { Facebook } from 'arctic'; // arctic random have bun unsupported crypto deps
import { generateRandom } from './generateRandom';

const facebook = new Facebook(
	process.env.FACEBOOK_CLIENT_ID ?? '',
	process.env.FACEBOOK_CLIENT_SECRET ?? '',
	`${process.env.APP_URL}/authorize/callback/facebook`,
);

export const facebookAuthorize = async () => {
	const state = generateRandom();

	const url = await facebook.createAuthorizationURL(state, {
		scopes: ['email'],
	});

	return { url, state };
};

type FacebookUser = {
	id: string;
	name: string;
	picture: { data: { url: string } };
	email: string;
};

export const facebookVerify = async ({
	code,
	stateCookie,
	stateParam,
}: {
	code: string;
	stateCookie: string;
	stateParam: string;
}) => {
	if (!code || !stateCookie || !stateParam) {
		throw new Error('Missing auth parameter');
	}

	if (stateCookie !== stateParam) {
		throw new Error('Could not authorize user');
	}

	console.debug('retrieving token', { code });

	const tokens = await facebook.validateAuthorizationCode(code);

	console.debug('Retrieved tokens', tokens);
	const url = new URL('https://graph.facebook.com/me');
	url.searchParams.set('access_token', tokens.accessToken);
	url.searchParams.set('fields', ['id', 'name', 'picture', 'email'].join(','));

	// TODO - check for errors
	const response = await fetch(url);
	const user = (await response.json()) as FacebookUser;

	console.debug('Fetched the following response from Facebook', { user });

	return {
		name: user.name,
		imageUrl: user.picture.data.url,
		email: user.email,
		connections: {
			facebook: user.id,
		},
	};
};
