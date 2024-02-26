import { cache, redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { User } from 'lucia';
import logger from '~/logger';

// We could actually augment the redirectPath that takes status or other params
// Also questionable how much we should tie this to router and getRequestEvent. Hrmmm
export const requireUserOrRedirect = cache(
	async (redirectPath: string): Promise<User> => {
		'use server';
		const event = getRequestEvent();

		logger.info('in requireUserOrRedirect', event);
		if (!event?.locals?.user) {
			throw redirect(redirectPath);
		}

		await new Promise((resolve) => setTimeout(resolve, 300));
		return event.locals.user;
	},
	'require-user',
);

// add cache key of user id and fetch user
const getUser = cache(async () => {
	'use server';
	await new Promise((resolve) => setTimeout(resolve, 300));
	return requireUserOrRedirect('/login');
}, 'user');
