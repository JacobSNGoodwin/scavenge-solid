import { createMiddleware } from '@solidjs/start/middleware';
import authMiddleware from './auth/middleware';
import { eventLoggerMiddleware } from './logger';

const onBeforeResponse = [eventLoggerMiddleware];

if (import.meta.env.DEV) {
	onBeforeResponse.push(async () => {
		await new Promise((resolve) => setTimeout(resolve, 400));
	});
}

export default createMiddleware({
	onRequest: [authMiddleware],
	onBeforeResponse,
});
