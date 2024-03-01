import { RouteDefinition, cache, createAsync } from '@solidjs/router';
import { redirect } from '@solidjs/router';
import { Show, Suspense, getRequestEvent } from 'solid-js/web';

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
		<Suspense
			fallback={
				<div class="h-svh text-6xl flex flex-col justify-center items-center">
					<div class="i-svg-spinners:3-dots-move bg-gray-500" />
				</div>
			}
		>
			{/* Reading isLoggedIn to force suspense*/}
			<Show when={!isLoggedIn()}>
				<main class="max-w-screen-md mx-auto flex flex-col h-screen justify-center text-xl space-y-8">
					<a
						href="/authorize/google"
						class="btn block w-36 text-center mx-auto flex justify-center items-center space-x-2"
					>
						<div class="i-logos:google-icon block" />
						<div>Google</div>
					</a>
					<a
						href="/authorize/facebook"
						class="btn block w-36 text-center mx-auto flex justify-center items-center space-x-2"
					>
						<div class="i-logos:facebook block" />
						<div>Facebook</div>
					</a>
				</main>
			</Show>
		</Suspense>
	);
}
