import { Title } from '@solidjs/meta';
import type { RouteDefinition } from '@solidjs/router';
import {
	createAsyncStore,
	useAction,
	useParams,
	useSubmission,
} from '@solidjs/router';
import { Show, Suspense, createSignal } from 'solid-js';
import {
	getScavengerHuntDetails,
	updateExistingScavengerHunt,
} from '~/api/scavengerHunts';
import HuntItemsList from '~/components/HuntItemsList';
import ScavengerHuntForm from '~/components/ScavengerHuntForm';

export const route = {
	load: async ({ params }) => {
		getScavengerHuntDetails(params.id);
	},
} satisfies RouteDefinition;

export default function Manage() {
	const params = useParams();
	const scavengerHuntDetails = createAsyncStore(async () => {
		return getScavengerHuntDetails(params.id);
	});

	const [isEditing, setIsEditing] = createSignal(false);

	const submitUpdate = useAction(updateExistingScavengerHunt);
	const updateSubmission = useSubmission(updateExistingScavengerHunt);

	const handleSubmitUpdate = async (form: {
		title: string;
		description: string;
	}) => {
		await submitUpdate(params.id, form);
		setIsEditing(false);
	};

	return (
		<>
			<Title>Manage Scavenger Hunt</Title>
			<main class="max-w-screen-md mx-auto my-4 px-2">
				<Suspense
					fallback={
						<div class="text-6xl flex flex-col justify-center items-center">
							<div class="i-svg-spinners:3-dots-move bg-violet-500" />
						</div>
					}
				>
					<div class="my-4 w-28">
						<a
							href="/manage"
							class="flex items-center btn mx-auto text-center bg-zinc-400 text-white"
						>
							<div class="i-tabler:arrow-left" />
							<span>Go Back</span>
						</a>
					</div>
					<Show when={isEditing()}>
						<ScavengerHuntForm
							initialForm={{
								title: scavengerHuntDetails()?.title ?? '',
								description: scavengerHuntDetails()?.description ?? '',
							}}
							onSubmit={(form) => {
								handleSubmitUpdate(form);
							}}
							onCancel={() => setIsEditing(false)}
							disabled={updateSubmission.pending}
						/>
					</Show>
					<Show when={!isEditing()}>
						<h1 class="text-3xl text-center mb-2">
							{scavengerHuntDetails()?.title}
						</h1>
						<h2 class="text-xl text-center mb-2">
							{scavengerHuntDetails()?.description}
						</h2>
						<button
							type="button"
							class="btn bg-violet-500 text-white text-md my-4 block mx-auto"
							onClick={() => setIsEditing(true)}
						>
							<span class="i-tabler:pencil inline-block align-middle mr-2" />
							<span class="align-middle">Edit Title</span>
						</button>
					</Show>
					<Show when={updateSubmission.pending}>
						<div class="text-2xl flex flex-col justify-center items-center">
							<div class="i-svg-spinners:3-dots-move bg-gray-500" />
						</div>
					</Show>

					<HuntItemsList
						huntId={scavengerHuntDetails()?.id ?? ''}
						items={scavengerHuntDetails()?.items ?? []}
					/>
				</Suspense>
			</main>
		</>
	);
}
