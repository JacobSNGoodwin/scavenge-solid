import { User as ClerkUser } from '@clerk/backend';

export type User = Pick<
	ClerkUser,
	'id' | 'fullName' | 'imageUrl' | 'firstName' | 'lastName' | 'username'
>;
