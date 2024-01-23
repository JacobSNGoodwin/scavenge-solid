import Clerk from '@clerk/clerk-js';
import { onMount } from 'solid-js';

export default function Login() {
	onMount(async () => {
		const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

		await clerk.load({
			afterSignInUrl: '/manage',
		});

		// TODO - mount in a div on thie page
		// for now we only want to test authorizaiton on home page
		clerk.openSignIn();
	});
}
