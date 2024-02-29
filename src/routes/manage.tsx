import {
	RouteDefinition,
	RouteSectionProps,
	useNavigate,
} from '@solidjs/router';
import { createAsync, useAction } from '@solidjs/router';
import { onMount } from 'solid-js';
import { Show, Suspense } from 'solid-js/web';
import { deleteUserSession } from '~/api/auth';
import { requireUserOrRedirect } from '~/api/user';
import logger from '~/logger';

export const route = {
	load: async () => {
		requireUserOrRedirect('login');
	},
} satisfies RouteDefinition;

export default function Manage(props: RouteSectionProps) {
	const navigate = useNavigate();
	const user = createAsync(() => requireUserOrRedirect('/login'), {
		initialValue: undefined,
	});
	const logout = useAction(deleteUserSession);

	// onMount(() => {
	// 	// logger.debug({ user: user() }, 'On mount for Manage layout');
	// 	if (!user()) {
	// 		logger.debug('No user, on client. Redirecting');
	// 		navigate('/login');
	// 	}
	// });

	return (
		<Suspense
			fallback={
				<div class="h-svh text-6xl flex flex-col justify-center items-center">
					<div class="i-svg-spinners:3-dots-move bg-violet-500" />
				</div>
			}
		>
			<Show
				when={user()}
				fallback={
					<nav class="w-full flex text-xl h-12 shadow-md shadow-stone-100 items-center p-4" />
				}
			>
				<nav class="w-full flex text-xl h-12 shadow-md shadow-stone-100 items-center p-4">
					<div>&#128075; {user()?.name}</div>
					<Show when={user()?.imageUrl}>
						<div class="ml-4 rounded-full">
							<img
								class="h-10 rounded-full"
								alt="User Profile"
								onerror={({ currentTarget }) => {
									currentTarget.style.opacity = '0';
								}}
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
			</Show>
		</Suspense>
	);
}
