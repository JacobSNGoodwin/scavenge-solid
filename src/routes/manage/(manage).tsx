import { User } from '@clerk/backend';
import { cache, createAsync } from '@solidjs/router';
import { Show, getRequestEvent } from 'solid-js/web';

const getUser = cache(async () => {
	'use server';
	const event = getRequestEvent();
	console.info('recevied a request event with locals', event?.locals);
	return (event?.locals?.user as User).fullName;
}, 'user');

export const route = {
	load: () => getUser(),
};
export default function Manage() {
	const fullName = createAsync(getUser);

	return (
		<main class="max-w-screen-md mx-auto my-4">
			<h1 class="text-3xl text-center">Manage Page</h1>
			<Show when={fullName()}>
				<h2 class="text-xl text-center">{fullName()}</h2>
			</Show>
			<a href="/" class="btn text-center block mx-auto w-24 my-4">
				Home
			</a>
		</main>
	);
}
