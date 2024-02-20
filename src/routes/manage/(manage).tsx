import { cache, createAsync, useAction } from '@solidjs/router';
import { Show } from 'solid-js/web';
import { deleteUserSession } from '~/api/auth';
import requireUserOrRedirect from '~/utils/requireUserOrRedirect';

const getUser = cache(async () => {
	'use server';
	return requireUserOrRedirect('/login');
}, 'user');

export const route = {
	load: () => getUser(),
};
export default function Manage() {
	const user = createAsync(() => getUser());
	const logout = useAction(deleteUserSession);

	return (
		<main class="max-w-screen-md mx-auto my-4">
			<h1 class="text-3xl text-center">Manage Page</h1>
			<Show when={user()}>
				<h2 class="text-xl text-center">{user()?.name}</h2>
				<button
					type="button"
					class="btn text-center block mx-auto w-24 my-4 bg-white"
					onClick={logout}
				>
					Logout
				</button>
			</Show>
			<a href="/" class="btn text-center block mx-auto w-24 my-4">
				Home
			</a>
		</main>
	);
}
