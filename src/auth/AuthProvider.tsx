'use client';

import { Clerk } from '@clerk/clerk-js';
import { ParentProps } from 'solid-js';
import { createContext, createUniqueId, onMount, useContext } from 'solid-js';

const AuthContext = createContext<Clerk | null>(null, {
	name: 'AuthContext',
});

const useAuthClient = () => {
	'use client';
	const authClient = useContext(AuthContext);

	onMount(async () => {
		console.debug('in useAuthClient onMount', { authClient });
		await authClient?.load({
			afterSignInUrl: '/manage',
			afterSignUpUrl: '/manage',
		});
	});

	return authClient;
};

const AuthProvider = ({ children }: ParentProps) => {
	const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

	return (
		<div>
			<AuthContext.Provider value={clerk}>{children}</AuthContext.Provider>
		</div>
	);
};

export default AuthProvider;
export { useAuthClient };
