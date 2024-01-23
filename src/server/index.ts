import { cache } from '@solidjs/router';
import { requireUser } from '~/auth';

export const getUser = cache(async () => {
	const user = await requireUser('/login');
	return user;
}, 'user');
