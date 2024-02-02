import { createMiddleware } from '@solidjs/start/middleware';
import authMiddleware from './auth/middleware';

export default createMiddleware({
	onRequest: [authMiddleware],
});
