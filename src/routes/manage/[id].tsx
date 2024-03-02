import { RouteDefinition, createAsync, useParams } from '@solidjs/router';
import { Title } from '@solidjs/meta';
import { Suspense } from 'solid-js';
import { getScavengerHuntDetails } from '~/api/scavengerHunts';

export const route = {
	load: async ({ params }) => {
		getScavengerHuntDetails(params.id);
	},
} satisfies RouteDefinition;

export default function Manage() {
	const params = useParams();
	const scavengerHuntDetails = createAsync(() =>
		getScavengerHuntDetails(params.id),
	);
	return (
		<>
			<Title>Manage Scavenger Hunt</Title>
			<main class="max-w-screen-md mx-auto my-4">
				<Suspense
					fallback={
						<div class="h-svh text-6xl flex flex-col justify-center items-center">
							<div class="i-svg-spinners:3-dots-move bg-gray-500" />
						</div>
					}
				>
					<a href="/manage">Go Back</a>
					<h1 class="text-3xl text-center mb-2">
						{scavengerHuntDetails()?.title}
					</h1>
				</Suspense>
			</main>
		</>
	);
}
