import { useAction, useSubmission } from '@solidjs/router';
import { For, Show, createSignal } from 'solid-js';
import { createScavengerHuntItem } from '~/api/scavengerHunts';
import type { ScavengerHuntItemFormFields } from '~/validators';
import HuntItemForm from './HuntItemForm';

type HuntItem = {
	id: string;
	title: string;
	value: number;
	createdAt: Date;
	updatedAt: Date;
};

type HuntItemsListProps = {
	huntId: string;
	items: HuntItem[];
};

export default function HuntItemsList(props: HuntItemsListProps) {
	const [isAddingNewItem, setIsAddingNewItem] = createSignal(false);

	const createNewItem = useAction(createScavengerHuntItem);
	const newItemSubmission = useSubmission(createScavengerHuntItem);

	const handleAddNewItem = (item: ScavengerHuntItemFormFields) => {
		setIsAddingNewItem(false);
		createNewItem(props.huntId, item);
	};

	const itemsByValueWithSubmission = () => {
		// most browsers will support Object.groupBy as of 2024-03
		const allItems: Array<Pick<HuntItem, 'title' | 'value' | 'id'>> = [
			...props.items,
		];

		if (newItemSubmission.input) {
			const fields = newItemSubmission.input[1];

			allItems.push({ ...fields, id: '' });
		}

		// const [_huntId, fields] = newItemSubmission.input;
		// console.debug('resorting', { fields });

		const sortedItems = allItems.sort((a, b) => {
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();

			if (a.value - b.value !== 0) {
				return a.value - b.value;
			}

			return titleA < titleB ? -1 : 1;
		});

		return sortedItems;
	};

	const handleDeleteItem = async (itemId: string) => {};

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
						class="block my-4 mx-auto text-center i-tabler:square-rounded-plus-filled text-5xl cursor-pointer bg-violet-500"
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
				{(item) => (
					<div class="my-4 text-lg">
						{item.title} - {item.value}
					</div>
				)}
			</For>
		</>
	);
}
