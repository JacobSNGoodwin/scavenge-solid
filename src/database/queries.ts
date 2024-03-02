'use server';

import { eq, desc, asc } from 'drizzle-orm';
import logger from '~/logger';
import db from './client';
import { scavengerHunts, user } from './schema';
import type { NewUser, User } from './schema';

/*
 * User
 */

export const findUserByEmail = async (
	email: string,
): Promise<User | undefined> => {
	console.debug('finding user with email', { email });
	const dbUsers = await db.select().from(user).where(eq(user.email, email));

	return dbUsers[0];
};

export const createUser = async (newUser: NewUser): Promise<User> => {
	const inserted = await db.insert(user).values(newUser).returning();

	return inserted[0];
};

// There's a good argument we should be doing this kind of logic here
// but I don't want to overcomplicate this
export const updateExistingUser = async (
	existingUser: User,
	providerUser: Pick<User, 'connections' | 'imageUrl'>,
): Promise<User> => {
	// Update connections
	const existingConnections = existingUser.connections;

	const updatedConnections = {
		...existingConnections,
		...providerUser.connections,
	};

	// Not sure if I want this behavior or not
	const updatedImageUrl = providerUser?.imageUrl ?? existingUser.imageUrl;

	const updated = await db
		.update(user)
		.set({
			connections: updatedConnections,
			imageUrl: updatedImageUrl,
		})

		.where(eq(user.id, existingUser.id))
		.returning();

	return updated[0];
};

/*
 * Scavenger Hunts
 */
export const getScavengerHuntsByUserId = async (userId: string) => {
	const result = await db
		.select()
		.from(scavengerHunts)
		.where(eq(scavengerHunts.created_by, userId))
		.orderBy(asc(scavengerHunts.title));
	logger.debug({ userId, result }, 'fetched scavenger hunts for user');
	return result;
};

export const getScavengerHuntById = async (id: string) => {
	const result = await db
		.select()
		.from(scavengerHunts)
		.where(eq(scavengerHunts.id, id));

	logger.debug({ result }, 'fetched scavenger hunt details');
	return result[0];
};
