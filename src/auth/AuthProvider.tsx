'use client';
import { Clerk } from '@clerk/clerk-js';
import { ParentProps, createSignal } from 'solid-js';

import AuthContext from './AuthContext';

const AuthProvider = ({ children }: ParentProps) => {
	// const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

	return (
		<div>
			<AuthContext.Provider value={createSignal(0)}>
				{children}
			</AuthContext.Provider>
		</div>
	);
};

export default AuthProvider;
