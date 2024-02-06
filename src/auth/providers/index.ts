import { facebookAuthorize } from './facebook';
import { googleAuthorize } from './google';

type AuthMethod = 'google' | 'facebook';

type AuthorizerFn = () => Promise<{
	url: URL;
	state: string;
	codeVerifier?: string;
}>;

export const authorizers: { [key in AuthMethod]: AuthorizerFn } = {
	google: googleAuthorize,
	facebook: facebookAuthorize,
};
