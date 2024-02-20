'use server';
import { redirect } from '@solidjs/router';
import { User } from 'lucia';
import { RequestEvent, getRequestEvent } from 'solid-js/web';

// We could actually augment the redirectPath that takes status or other params
// Also questionable how much we should tie this to router and getRequestEvent. Hrmmm
const requireUserOrRedirect = async (redirectPath: string): Promise<User> => {
	const event = getRequestEvent();
	if (!event?.locals?.user) {
		throw redirect(redirectPath);
	}

	return event.locals.user;
};

export default requireUserOrRedirect;
