import { Clerk } from '@clerk/clerk-js';
import { onMount } from 'solid-js';

export default function Login() {
	// CLERK V5 docs
	// https://github.com/clerk/javascript/tree/%40clerk/clerk-js%405.0.0-beta-v5.20/packages/clerk-js
	onMount(async () => {
		const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

		await clerk.load({
			afterSignInUrl: '/manage',
			afterSignUpUrl: '/manage',
		});

		// TODO - mount in a div on thie page
		// for now we only want to test authorizaiton on home page
		clerk.openSignIn();
	});
}
