import { Google } from 'arctic';
import { generateRandom } from './generateRandom';

const google = new Google(
	process.env.GOOGLE_CLIENT_ID ?? '',
	process.env.GOOGLE_CLIENT_SECRET ?? '',
	`${process.env.APP_URL}/auth/callback/google`,
);

export const googleAuthorize = async () => {
	const state = generateRandom();
	const codeVerifier = generateRandom();

	console.debug('the state and code verifier', { state, codeVerifier });

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['https://www.googleapis.com/auth/userinfo.email'],
	});

	return { url, state, codeVerifier };
};
