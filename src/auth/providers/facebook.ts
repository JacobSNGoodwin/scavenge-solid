import { Facebook } from 'arctic'; // arctic random have bun unsupported crypto deps
import { generateRandom } from './generateRandom';

const facebook = new Facebook(
	process.env.FACEBOOK_CLIENT_ID ?? '',
	process.env.FACEBOOK_CLIENT_SECRET ?? '',
	`${process.env.APP_URL}/auth/callback/facebook`,
);

export const facebookAuthorize = async () => {
	const state = generateRandom();

	console.debug(
		process.env.FACEBOOK_CLIENT_ID,
		process.env.FACEBOOK_CLIENT_SECRET,
		state,
	);
	const url = await facebook.createAuthorizationURL(state, {
		scopes: ['email'],
	});

	return { url, state };
};
