import { createClerkClient } from '@clerk/backend';

const client = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
	publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
});

export default client;
