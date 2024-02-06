import { facebookAuthorize } from './facebook';
import { googleAuthorize } from './google';

type AuthorizerFn = () => Promise<{
	url: URL;
	state: string;
	codeVerifier?: string;
}>;

export const authorizers: Record<string, AuthorizerFn> = {
	google: googleAuthorize,
	facebook: facebookAuthorize,
};
