import type { DatabaseUserAttributes } from '../lucia';
import { facebookAuthorize, facebookVerify } from './facebook';
import { googleAuthorize, googleVerify } from './google';

// type AuthProvider = 'google' | 'facebook';

type AuthorizerFn = () => Promise<{
	url: URL;
	state: string;
	codeVerifier?: string;
}>;

type VerifierFnParams = {
	code: string;
	stateCookie: string;
	stateParam: string;
	codeVerifierCookie: string;
	codeVerifierParam?: string;
};

type VerifierFn = (params: VerifierFnParams) => Promise<DatabaseUserAttributes>;

export const authorizers: Record<string, AuthorizerFn> = {
	google: googleAuthorize,
	facebook: facebookAuthorize,
};

export const verifiers: Record<string, VerifierFn> = {
	facebook: facebookVerify,
	google: googleVerify,
};
