import { Facebook, generateState } from 'arctic';

const facebook = new Facebook(
	import.meta.env.FACEBOOK_CLIENT_ID,
	import.meta.env.FACEBOOK_CLIENT_SECRET,
	`${import.meta.env.BASE_URL}/auth/callback/facebook`,
);

export const facebookAuthorize = async () => {
	const state = generateState();

	const url = await facebook.createAuthorizationURL(state, {
		scopes: ['email'],
	});

	return { url, state };
};
