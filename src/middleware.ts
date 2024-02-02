import { createMiddleware } from '@solidjs/start/server';
import authMiddleware from './auth/middleware';

export default createMiddleware({
	onRequest: [authMiddleware],
});
