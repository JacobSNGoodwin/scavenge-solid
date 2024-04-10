import { useAction, useSubmission, useSubmissions } from '@solidjs/router';
import { For, Show, createSignal } from 'solid-js';
import {
	createScavengerHuntItem,
	deleteScavengerHuntItem,
} from '~/api/scavengerHunts';
import type { ScavengerHuntItemFormFields } from '~/validators';
import HuntItemForm from './HuntItemForm';

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

	const createNewItem = useAction(createScavengerHuntItem);
	const newItemSubmission = useSubmission(createScavengerHuntItem);

	const deleteItem = useAction(deleteScavengerHuntItem);
	const deleteItemSubmissions = useSubmissions(deleteScavengerHuntItem);

	const handleAddNewItem = (item: ScavengerHuntItemFormFields) => {
		setIsAddingNewItem(false);
		createNewItem(props.huntId, item);
	};

	const handleDeleteItem = (itemId: string) => {
		deleteItem(props.huntId, itemId);
	};

	const itemsByValueWithSubmission = () => {
		const itemsBeingDeleted: string[] = [];

		// Array methods aren't working on proxy Array of deleteItemSubmissions
		for (let i = 0; i < deleteItemSubmissions.length; i++) {
			itemsBeingDeleted.push(deleteItemSubmissions[i].input[1]);
		}

		const allItems = [...props.items].filter(
			(item) => !itemsBeingDeleted.includes(item.id),
		);

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
						<div class="my-1 px-2 text-lg flex items-center gap-4">
							<div class="flex justify-between grow">
								<span class="mr-6">{item.title} </span>
								<span>{item.value}</span>
							</div>

							<button
								type="button"
								onClick={() => handleDeleteItem(item.id)}
								disabled={!item.id}
								class="i-tabler:circle-x-filled bg-rose-500 hover:opacity-80 text-3xl disabled:invisible"
							/>
						</div>
					);
				}}
			</For>
		</>
	);
}
