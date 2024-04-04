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
	createScavengerHuntItem,
	getScavengerHuntDetails,
	getScavengerHuntItems,
	updateExistingScavengerHunt,
} from '~/api/scavengerHunts';
import NewHuntItem from '~/components/NewHuntItem';
import ScavengerHuntForm from '~/components/ScavengerHuntForm';
import logger from '~/logger';
import type { ScavengerHuntItemFormFields } from '~/validators';

export const route = {
	load: async ({ params }) => {
		getScavengerHuntDetails(params.id);
	},
} satisfies RouteDefinition;

export default function Manage() {
	const params = useParams();
	const scavengerHuntDetails = createAsyncStore(async () => {
		// we await the cached result of getScaengerHuntDetails because
		// this validates the hunt belongs to the user. After this fetch
		// (or on updates of title/details), we can update items without revalidating
		// this cached functino
		const { id, title, description } = await getScavengerHuntDetails(params.id);
		const items = await getScavengerHuntItems(id);
		return {
			title,
			description,
			items,
		};
	});

	const [isEditing, setIsEditing] = createSignal(false);
	const [isAddingNewItem, setIsAddingNewItem] = createSignal(false);

	const submitUpdate = useAction(updateExistingScavengerHunt);
	const updateSubmission = useSubmission(updateExistingScavengerHunt);

	const submitItem = useAction(createScavengerHuntItem);
	// const itemSubmission = useSubmission(addScavengerHuntItem);

	const handleSubmitUpdate = async (form: {
		title: string;
		description: string;
	}) => {
		await submitUpdate(params.id, form);
		setIsEditing(false);
	};

	const handleAddItem = async (form: ScavengerHuntItemFormFields) => {
		setIsAddingNewItem(false);
		submitItem(params.id, form);
	};

	const handleDeleteItem = async (itemId: string) => {};

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

					<h3 class="my-4 text-2xl text-stone-800 text-center">
						Scavenger Hunt Items
					</h3>
					<Show
						when={isAddingNewItem()}
						fallback={
							<button
								type="button"
								class="block my-4 mx-auto text-center i-tabler:square-rounded-plus-filled text-5xl cursor-pointer bg-violet-500"
								onClick={() => {
									setIsEditing(false);
									setIsAddingNewItem(true);
								}}
							/>
						}
					>
						<NewHuntItem
							onSubmit={(form) => handleAddItem(form)}
							onCancel={() => setIsAddingNewItem(false)}
						/>
					</Show>
					<pre>{JSON.stringify(scavengerHuntDetails(), null, 2)}</pre>
				</Suspense>
			</main>
		</>
	);
}
