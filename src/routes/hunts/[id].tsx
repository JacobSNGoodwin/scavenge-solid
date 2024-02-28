import {
	RouteDefinition,
	action,
	cache,
	createAsync,
	useParams,
} from '@solidjs/router';
import { Show } from 'solid-js';
import { createStorage, prefixStorage } from 'unstorage';
import logger from '~/logger';

const storage = createStorage(/* opts */);
const huntItemsStorage = prefixStorage<string>(storage, 'huntItems');

const getHuntItems = cache((id: string) => {
	'use server';
	logger.info(`Initializing hunt items for id: ${id}`);
	return huntItemsStorage.getItem(id);
}, 'hunt-items');

export const route = {
	load: ({ params }) => {
		return getHuntItems(params.id);
	},
} satisfies RouteDefinition;

const submitItem = action(async (formData: FormData) => {
	'use server';
	const newItem = formData.get('item');
	logger.debug({ newItem }, 'Submitting item');
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
					<pre class="text-center">{items()}</pre>
				</Show>
			</div>
			<div class="mx-auto my-2 flex justify-center">
				<form action={submitItem} method="post">
					<input
						class="block mb-2 border-2 border-gray-500"
						type="text"
						name="item"
					/>
					<button class="btn cursor-pointer bg-white mx-auto" type="submit">
						Submit
					</button>
				</form>
			</div>
		</>
	);
}
