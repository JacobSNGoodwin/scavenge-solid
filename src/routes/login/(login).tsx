import { RouteDefinition, cache, createAsync } from '@solidjs/router';
import { redirect } from '@solidjs/router';
import { Show, Suspense, getRequestEvent } from 'solid-js/web';

// not caching, as this is just a check of the event
const checkLoggedInUser = cache(async () => {
	'use server';
	const event = getRequestEvent();

	if (event?.locals.user) {
		throw redirect('/manage');
	}

	return false;
}, 'loggedInUser');

export const route = {
	load: async () => {
		checkLoggedInUser();
	},
} satisfies RouteDefinition;

export default function Login() {
	const isLoggedIn = createAsync(() => checkLoggedInUser(), {
		initialValue: true,
	});
	return (
		<main class="max-w-screen-md mx-auto mt-4">
			<Suspense
				fallback={<p class="text-center">...Checking if you're logged in...</p>}
			>
				{/* To force suspense */}
				<Show when={!isLoggedIn()}>
					<a
						href="/authorize/google"
						class="btn block w-24 text-center mx-auto my-2"
					>
						Google
					</a>
					<a
						href="/authorize/facebook"
						class="btn block w-24 text-center mx-auto my-2"
					>
						Facebook
					</a>
				</Show>
			</Suspense>
		</main>
	);
}
