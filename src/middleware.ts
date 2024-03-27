import { createMiddleware } from '@solidjs/start/middleware';
import authMiddleware from './auth/middleware';
import { eventLoggerMiddleware } from './logger';

// const delay = 150;
const onRequest = [authMiddleware];
const onBeforeResponse = [eventLoggerMiddleware];

// if (import.meta.env.DEV) {
// 	onBeforeResponse.push(async () => {
// 		await new Promise((resolve) => setTimeout(resolve, delay));
// 	});
// 	onRequest.push(async () => {
// 		await new Promise((resolve) => setTimeout(resolve, delay));
// 	});
// }

export default createMiddleware({
	onRequest,
	onBeforeResponse,
});
