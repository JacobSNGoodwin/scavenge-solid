import { RouteDefinition, createAsync } from '@solidjs/router';
import { For, Suspense } from 'solid-js';
import { getUserScavengerHunts } from '~/api/scavengerHunts';

export const route = {
	load: async () => {
		getUserScavengerHunts();
	},
} satisfies RouteDefinition;

export default function Manage() {
	const scavengerHunts = createAsync(() => getUserScavengerHunts());

	return (
		<>
			<main class="max-w-screen-md mx-auto my-4">
				<h1 class="text-3xl text-center mb-2">Your Scavenger Hunts</h1>
				<Suspense
					fallback={
						<div class="text-6xl flex flex-col justify-center items-center">
							<div class="i-svg-spinners:3-dots-move bg-gray-500" />
						</div>
					}
				>
					<a
						href="/manage/new"
						class="btn w-24 cursor-pointer bg-violet-500 text-white text-center mx-auto block"
					>
						Create
					</a>
					<div class="my-8 mx-2">
						<For
							each={scavengerHunts()}
							fallback={
								<h3 class="text-center font-2xl">Create to get started!</h3>
							}
						>
							{(scavengerHunt) => (
								<a href={`/manage/${scavengerHunt.id}`}>
									<div class="rounded-lg shadow-md border-0/5 border-violet-500 p-2 my-2 hover:shadow-lg">
										<h3 class="text-xl text-center font-bold">
											{scavengerHunt.title}
										</h3>
										<p class="text-center font-italic">
											{scavengerHunt.description}
										</p>
									</div>
								</a>
							)}
						</For>
					</div>
				</Suspense>
			</main>
		</>
	);
}
