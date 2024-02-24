import { RouteSectionProps, createAsync, useAction } from '@solidjs/router';
import { Show, Suspense } from 'solid-js/web';
import { deleteUserSession } from '~/api/auth';
import { requireUserOrRedirect } from '~/api/user';

export const route = {
	load: () => requireUserOrRedirect('login'),
};
export default function Manage(props: RouteSectionProps) {
	const user = createAsync(() => requireUserOrRedirect('/login'));
	const logout = useAction(deleteUserSession);

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<nav class="w-full flex text-xl h-12 shadow-md shadow-stone-100 items-center p-4">
				<div>&#128075; {user()?.name}</div>
				<Show when={user()?.imageUrl}>
					<div class="ml-4 rounded-full">
						<img
							class="h-10 rounded-full"
							alt="User Profile"
							src={user()?.imageUrl ?? ''}
						/>
					</div>
				</Show>
				<div class="flex-grow" />
				<div>
					<button
						type="button"
						class="bg-white hover:text-gray-600"
						onClick={logout}
					>
						Logout
					</button>
				</div>
			</nav>
			{props.children}
		</Suspense>
	);
}
