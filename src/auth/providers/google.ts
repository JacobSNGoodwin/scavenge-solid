import { Google } from 'arctic';
import { generateRandom } from './generateRandom';
import logger from '~/logger';

const log = logger.child({ namespace: 'auth-provider-google' });

const google = new Google(
	process.env.GOOGLE_CLIENT_ID ?? '',
	process.env.GOOGLE_CLIENT_SECRET ?? '',
	`${process.env.APP_URL}/authorize/callback/google`,
);

export const googleAuthorize = async () => {
	const state = generateRandom();
	const codeVerifier = generateRandom();

	log.info('creating google authorization URL');
	log.debug({ state, codeVerifier }, 'the state and code verifier');

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		// scopes: ['https://www.googleapis.com/auth/userinfo.email'],
		scopes: ['profile', 'email'],
	});

	return { url, state, codeVerifier };
};

type GoogleUser = {
	sub: string;
	name: string;
	picture: string;
	email: string;
};

// Maybe implement referesh tokens: https://arctic.js.org/guides/oauth2-pkce
export const googleVerify = async ({
	code,
	stateCookie,
	stateParam,
	codeVerifierCookie,
}: {
	code: string;
	stateCookie: string;
	stateParam: string;
	codeVerifierCookie: string;
}) => {
	log.debug(
		{
			code,
			stateCookie,
			stateParam,
			codeVerifierCookie,
		},
		'googleVerify params',
	);

	log.info('attempting to verify google user');
	if (!code || !stateCookie || !stateParam) {
		throw new Error('Missing auth parameter');
	}

	if (stateCookie !== stateParam) {
		throw new Error('Could not authorize user');
	}

	log.debug({ code }, 'retrieving token');

	const tokens = await google.validateAuthorizationCode(
		code,
		codeVerifierCookie,
	);

	log.debug({ tokens }, 'Retrieved tokens');
	const url = new URL('https://openidconnect.googleapis.com/v1/userinfo');

	// TODO - check for errors
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`,
		},
	});
	const user = (await response.json()) as GoogleUser;

	log.info({ user }, 'Fetched the following user from Google');

	return {
		name: user.name,
		imageUrl: user.picture,
		email: user.email,
		connections: {
			google: user.sub,
		},
	};
};
