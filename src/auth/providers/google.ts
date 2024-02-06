import { Google, generateState, generateCodeVerifier } from 'arctic';

const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	`${import.meta.env.BASE_URL}/auth/callback/google`,
);

export const googleAuthorize = async () => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['https://www.googleapis.com/auth/userinfo.email'],
	});

	return { url, state, codeVerifier };
};
