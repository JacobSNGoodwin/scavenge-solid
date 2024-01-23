'use server';

import { redirect } from '@solidjs/router';
import clerk from './clerk';
import { User as ClerkUser } from '@clerk/backend';
import { getRequestEvent } from 'solid-js/web';

export type User = Pick<
	ClerkUser,
	'id' | 'fullName' | 'username' | 'imageUrl' | 'firstName'
>;

const requireUser = async (redirectPath: string): Promise<User> => {
	const request = getRequestEvent()?.request;
	if (!request) {
		throw redirect(redirectPath);
	}

	// hoping that @clerk/backend supports web API request event
	// provided by SolidJS
	const requestState = await clerk.authenticateRequest(request);

	console.debug('the request state', requestState);

	if (requestState.status === 'signed-out') {
		throw redirect(redirectPath);
	}

	if (requestState.status === 'handshake') {
		const requestHeaders = request.headers;
		const authHeaders = requestState.headers;

		console.debug('handling handshake', {
			requestHeaders: [...requestHeaders.entries()],
			authHeaders: [...authHeaders.entries()],
		});

		throw redirect(authHeaders?.get('location') ?? redirectPath);
	}

	const authObject = requestState.toAuth();
	const { id, fullName, username, imageUrl, firstName } =
		await clerk.users.getUser(authObject.userId);

	return {
		id,
		fullName,
		username,
		imageUrl,
		firstName,
	};
};

export { requireUser };
