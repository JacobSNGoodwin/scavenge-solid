import { RouteDefinition, createAsync } from '@solidjs/router';
import { getUser } from '~/server';

export const route = {
	load() {
		getUser();
	},
} satisfies RouteDefinition;

export default function Home() {
	const data = createAsync(getUser);

	return (
		<main class="max-w-screen-md mx-auto mt-4">
			<h1 class="text-3xl text-center">Scavenge</h1>
			<div class="mx-auto flex flex-col my-12">
				<a href="/manage" class="btn block w-24 text-center mx-auto my-2">
					Manage
				</a>
				<a href="/join" class="btn block w-24 text-center mx-auto my-2">
					Join
				</a>
			</div>
			<p>Placeholder user: {data()?.fullName ?? 'Must be no user!'}</p>
		</main>
	);
}
