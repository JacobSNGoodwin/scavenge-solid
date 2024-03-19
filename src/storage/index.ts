import { createStorage, prefixStorage } from 'unstorage';
import fsLiteDriver from 'unstorage/drivers/fs-lite';
const storage = createStorage({
	driver: fsLiteDriver({
		base: './.data',
	}),
});

export const huntItemsStorage = prefixStorage<Array<string>>(
	storage,
	'huntItems',
);
