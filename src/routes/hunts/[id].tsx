import {
	RouteDefinition,
	action,
	cache,
	createAsync,
	revalidate,
	useParams,
} from '@solidjs/router';
import { Show } from 'solid-js';
import logger from '~/logger';
import { huntItemsStorage } from '~/storage';

const getHuntItems = cache(async (id: string) => {
	'use server';
	logger.info(`Fetching hunt items for id: ${id}`);
	const items = await huntItemsStorage.getItem(id);
	logger.debug({ items }, 'retrieved items');
	return items;
}, 'hunt-items');

export const route = {
	load: ({ params }) => {
		return getHuntItems(params.id);
	},
} satisfies RouteDefinition;

const submitItem = action(async (id: string, formData: FormData) => {
	'use server';

	logger.debug({ id }, 'in submitItem');
	// Should validate, but this is a demo
	const newItem = formData.get('item')?.toString() ?? '';
	logger.debug({ id, newItem }, 'submitting new hunt item');
	const existingHuntItems = (await huntItemsStorage.getItem(id)) ?? [];

	logger.debug({ existingHuntItems }, 'existingHuntItems');
	await huntItemsStorage.setItem(id, [...existingHuntItems, newItem]);
	const updatedHuntItems = (await huntItemsStorage.getItem(id)) ?? [];

	logger.debug({ updatedHuntItems }, 'updatedHuntItems');
	return revalidate(getHuntItems.key);
});

export default function Hunt() {
	const params = useParams();
	const items = createAsync(() => getHuntItems(params.id));

	return (
		<>
			<h1 class="text-center text-3xl">Hunt: {params.id}</h1>
			<div class="mx-auto my-2">
				<Show
					when={items()?.length}
					fallback={<p class="text-center">No items</p>}
				>
					<pre class="text-center">{JSON.stringify(items())}</pre>
				</Show>
			</div>
			<div class="mx-auto my-2 flex justify-center">
				<form action={submitItem.with(params.id)} method="post">
					<input
						class="block mb-2 border-2 border-gray-500"
						type="text"
						name="item"
					/>
					<button
						class="btn cursor-pointer bg-white mx-auto text-center"
						type="submit"
					>
						Submit
					</button>
				</form>
			</div>
		</>
	);
}
