'use client';
import { onMount, useContext } from 'solid-js';
import AuthContext from './AuthContext';

const useAuthClient = () => {
	const [authClient] = useContext(AuthContext);

	onMount(async () => {
		console.debug('in useAuthClient onMount', { authClient });
		// await authClient?.load({
		// 	afterSignInUrl: '/manage',
		// 	afterSignUpUrl: '/manage',
		// });
	});

	return authClient;
};

export { useAuthClient };
