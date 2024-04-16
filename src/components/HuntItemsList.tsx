import { useAction, useSubmission, useSubmissions } from '@solidjs/router';
import { For, Show, createSignal } from 'solid-js';
import {
	createScavengerHuntItem,
	deleteScavengerHuntItem,
	updateScavengerHuntItem,
} from '~/api/scavengerHunts';
import type { ScavengerHuntItemFormFields } from '~/validators';
import HuntItemForm from './HuntItemForm';
import Confirmation from './Confirmation';
import logger from '~/logger';

type HuntItem = {
	id: string;
	title: string;
	value: number;
};

type HuntItemsListProps = {
	huntId: string;
	items: HuntItem[];
};

export default function HuntItemsList(props: HuntItemsListProps) {
	const [isAddingNewItem, setIsAddingNewItem] = createSignal(false);
	const [itemToDelete, setItemToDelete] = createSignal<string | null>(null);
	const [itemToUpdate, setItemToUpdate] = createSignal<string | null>(null);

	const createNewItem = useAction(createScavengerHuntItem);
	const newItemSubmission = useSubmission(createScavengerHuntItem);

	const deleteItem = useAction(deleteScavengerHuntItem);
	const deleteItemSubmissions = useSubmissions(deleteScavengerHuntItem);

	const updateItem = useAction(updateScavengerHuntItem);
	const updateItemSubmissions = useSubmissions(updateScavengerHuntItem);

	const handleAddNewItem = (item: ScavengerHuntItemFormFields) => {
		setIsAddingNewItem(false);
		createNewItem(props.huntId, item);
	};

	const handleUpdateItem = (
		itemId: string,
		item: ScavengerHuntItemFormFields,
	) => {
		setItemToUpdate(null);
		updateItem(props.huntId, itemId, item);
	};

	const handleDeleteItem = (itemId: string) => {
		deleteItem(props.huntId, itemId);
		setItemToDelete(null);
	};

	const handleConfirmDelete = (itemId: string) => {
		setItemToDelete(itemId);
	};

	const itemsByValueWithSubmission = () => {
		// spread deleteItemSubmissions to access the inner array of the Proxy
		const itemsBeingDeleted = [...deleteItemSubmissions].map(
			(submission) => submission.input[1],
		);

		const itemsBeingUpdated = [...updateItemSubmissions].reduce(
			(idToFields, currentSubmission) => {
				idToFields[currentSubmission.input[1]] = currentSubmission.input[2];

				return idToFields;
			},
			{} as Record<string, ScavengerHuntItemFormFields>,
		);

		logger.debug(itemsBeingUpdated, 'items being updated');

		const allItems = [...props.items]
			.filter((item) => !itemsBeingDeleted.includes(item.id))
			.map((item) => {
				if (itemsBeingUpdated[item.id]) {
					return { ...item, ...itemsBeingUpdated[item.id] };
				}

				return item;
			});

		if (newItemSubmission.input) {
			const fields = newItemSubmission.input[1];

			allItems.push({ ...fields, id: '' });
		}

		allItems.sort((a, b) => {
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();

			if (a.value - b.value !== 0) {
				return a.value - b.value;
			}

			return titleA < titleB ? -1 : 1;
		});

		return allItems;
	};

	return (
		<>
			<h3 class="my-4 text-2xl text-stone-800 text-center">
				Scavenger Hunt Items
			</h3>
			<Show
				when={isAddingNewItem()}
				fallback={
					<button
						type="button"
						class="block my-4 mx-auto text-center i-tabler:square-rounded-plus-filled text-5xl cursor-pointer bg-violet-500 hover:opacity-80"
						onClick={() => {
							setIsAddingNewItem(true);
						}}
					/>
				}
			>
				<HuntItemForm
					onSubmit={handleAddNewItem}
					onCancel={() => setIsAddingNewItem(false)}
				/>
			</Show>

			<For each={itemsByValueWithSubmission()}>
				{(item) => {
					return (
						<>
							<Show when={item.id === itemToUpdate()}>
								<HuntItemForm
									initialForm={item}
									onSubmit={(fields) => handleUpdateItem(item.id, fields)}
									onCancel={() => setItemToUpdate(null)}
								/>
							</Show>
							<Show when={item.id !== itemToUpdate()}>
								<div class="my-1 px-2 text-lg flex items-center gap-4">
									<div class="flex justify-between grow">
										<span class="mr-6">{item.title} </span>
										<span>{item.value}</span>
									</div>
									<div class="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setItemToUpdate(item.id)}
											disabled={!item.id}
											class="hover:opacity-80 bg-stone-600 text-3xl disabled:invisible h-6 w-6 rounded-full"
										>
											<div class="i-tabler:pencil bg-white text-xl mx-auto" />
										</button>

										<button
											type="button"
											onClick={() => handleConfirmDelete(item.id)}
											disabled={!item.id}
											class="hover:opacity-80 bg-rose-500 text-3xl disabled:invisible h-6 w-6 rounded-full"
										>
											<div class="i-tabler:x bg-white text-xl mx-auto" />
										</button>
									</div>
								</div>
							</Show>
						</>
					);
				}}
			</For>
			<Show when={!!itemToDelete()}>
				<Confirmation
					onConfirm={() => {
						handleDeleteItem(itemToDelete() ?? '');
					}}
					onCancel={() => setItemToDelete(null)}
					confirmationMessage="It will be gone for good"
					cancelButtonText="Cancel"
					confirmButtonText="Proceed"
				/>
			</Show>
		</>
	);
}
