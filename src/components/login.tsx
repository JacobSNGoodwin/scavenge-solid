import { Show, createSignal, onMount } from 'solid-js';
import Clerk from '@clerk/clerk-js';

// const clerkPublishableKey = �pk_test_Y29vbC15YWstNTIuY2xlcmsuYWNjb3VudHMuZGV2JA�;
// const clerk = new Clerk(clerkPublishableKey);
// await clerk.load({
//   // Set load options here...
// });

export default function Login() {
	const [isLoginExpanded, setIsLoginExpanded] = createSignal(false);

	onMount(async () => {
		// TODO - save reference to clerk
		// so that we can handle mount and unmount
		const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
		await clerk.load({
			// Set load options here...
		});

		const signInComponent = document.querySelector('#sign-in');

		clerk.openSignIn(signInComponent);
	});

	return (
		<div class="my-4">
			<button
				type="button"
				class="btn bg-white text-xl block mx-auto flex items-center"
				onClick={() => setIsLoginExpanded(true)}
			>
				<div>Login</div>
			</button>
			<Show when={isLoginExpanded()}>
				<div id="sign-in" />
			</Show>
			{/* <div id="sign-in" /> */}
		</div>
	);
}
