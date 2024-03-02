import { cache, redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { User } from 'lucia';
import logger from '~/logger';

export const requireUserOrRedirect = cache(
	async (redirectPath: string): Promise<User> => {
		'use server';
		const event = getRequestEvent();

		logger.debug(event?.locals, 'checking for user in event.locals');

		if (!event?.locals?.user) {
			throw redirect(redirectPath);
		}

		// logger.debug({ user: event.locals.user }, 'found user');
		// await new Promise((resolve) => setTimeout(resolve, 300));
		return event.locals.user;
	},
	'requireUser',
);
