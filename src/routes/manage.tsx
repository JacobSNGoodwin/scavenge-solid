import {
	RouteDefinition,
	RouteSectionProps,
	redirect,
	reload,
	revalidate,
	useNavigate,
} from '@solidjs/router';
import { createAsync, useAction } from '@solidjs/router';
import { useRouter } from '@solidjs/router/dist/routing';
import { onMount } from 'solid-js';
import { Show, Suspense } from 'solid-js/web';
import { deleteUserSession } from '~/api/auth';
import { requireUserOrRedirect } from '~/api/user';

export const route = {
	load: () => {
		requireUserOrRedirect('login');
	},
} satisfies RouteDefinition;

export default function Manage(props: RouteSectionProps) {
	const navigate = useNavigate();
	const user = createAsync(() => requireUserOrRedirect('/login'));
	const logout = useAction(deleteUserSession);

	navigate('/manage', { replace: true });

	return (
		<Suspense
			fallback={
				<div class="h-svh text-6xl flex flex-col justify-center items-center">
					<div class="i-svg-spinners:3-dots-move bg-violet-500" />
				</div>
			}
		>
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
