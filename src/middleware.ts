import { createMiddleware } from '@solidjs/start/middleware';
import authMiddleware from './auth/middleware';
import { eventLoggerMiddleware } from './logger';

export default createMiddleware({
	onRequest: [authMiddleware],
	onBeforeResponse: [eventLoggerMiddleware],
});
