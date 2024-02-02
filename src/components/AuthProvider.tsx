import { Clerk } from '@clerk/clerk-js';
import {
	ParentProps,
	createContext,
	createSignal,
	onMount,
	useContext,
} from 'solid-js';

const AuthContext = createContext<Clerk | null>(null);

const AuthProvider = ({ children }: ParentProps) => {
	const [client, setClient] = createSignal<Clerk | null>(null);
	onMount(async () => {
		const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

		await clerk.load({
			afterSignInUrl: '/manage',
			afterSignUpUrl: '/manage',
		});

		setClient(clerk);
	});

	return (
		<AuthContext.Provider value={client()}>{children}</AuthContext.Provider>
	);
};

const useAuthClient = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuthClient must be used within an AuthProvider');
	}

	return context;
};

export { AuthProvider, useAuthClient };
