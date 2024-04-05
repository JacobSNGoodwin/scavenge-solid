import { Show, createSignal } from 'solid-js';
import type { ScavengerHuntItemFormFields } from '~/validators';
import HuntItemComponent from './HuntItem';

type HuntItem = {
	id: string;
	title: string;
	value: number;
	createdAt: Date;
	updatedAt: Date;
};

type HuntItemsListProps = {
	items: HuntItem[];
	onDeleteItem: (itemId: string) => void;
	onAddItem: (item: ScavengerHuntItemFormFields) => void;
};

export default function HuntItemsList(props: HuntItemsListProps) {
	const [isAddingNewItem, setIsAddingNewItem] = createSignal(false);

	const handleAddNewItem = (item: ScavengerHuntItemFormFields) => {
		setIsAddingNewItem(false);
		props.onAddItem(item);
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
						class="block my-4 mx-auto text-center i-tabler:square-rounded-plus-filled text-5xl cursor-pointer bg-violet-500"
						onClick={() => {
							setIsAddingNewItem(true);
						}}
					/>
				}
			>
				<HuntItemComponent
					onSubmit={handleAddNewItem}
					onCancel={() => setIsAddingNewItem(false)}
				/>
			</Show>

			<pre>{JSON.stringify(props.items, null, 2)}</pre>
		</>
	);
}
