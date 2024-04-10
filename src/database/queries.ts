'use server';

import { asc, eq, and } from 'drizzle-orm';
import logger from '~/logger';
import db from './client';
import { scavengerHuntItems, scavengerHunts, user } from './schema';
import type {
	NewScavengerHunt,
	NewScavengerHuntItem,
	NewUser,
	ScavengerHunt,
	User,
} from './schema';

const log = logger.child({ module: 'database/queries' });

/*
 * User
 */

export const findUserByEmail = async (
	email: string,
): Promise<User | undefined> => {
	log.debug({ email }, 'finding user with email');
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
		.where(eq(scavengerHunts.createdBy, userId))
		.orderBy(asc(scavengerHunts.title));
	log.debug({ userId, result }, 'fetched scavenger hunts for user');
	return result;
};

export const getScavengerHuntById = async (id: string) => {
	return db
		.select()
		.from(scavengerHunts)
		.where(eq(scavengerHunts.id, id))
		.get();
};

export const getScavengerHuntItemsById = async (id: string, userId: string) => {
	const result = await db
		.select()
		.from(scavengerHunts)
		.where(and(eq(scavengerHunts.id, id), eq(scavengerHunts.createdBy, userId)))
		.leftJoin(
			scavengerHuntItems,
			eq(scavengerHunts.id, scavengerHuntItems.huntId),
		)
		.orderBy(asc(scavengerHuntItems.value), asc(scavengerHuntItems.title));

	// log.debug({ result }, 'getScavengerHuntItemsById query result');
	return result;
};

export const createScavengerHunt = async (hunt: NewScavengerHunt) => {
	const newHunts = await db
		.insert(scavengerHunts)
		.values(hunt)
		.returning({ id: scavengerHunts.id });

	return newHunts[0];
};

type UpdateScavengerHunt = Pick<
	ScavengerHunt,
	'title' | 'description' | 'updatedAt'
>;
export const updateScavengerHunt = async (
	id: string,
	hunt: UpdateScavengerHunt,
) => {
	const newHunts = await db
		.update(scavengerHunts)
		.set(hunt)
		.where(eq(scavengerHunts.id, id))
		.returning({ id: scavengerHunts.id });

	return newHunts[0];
};

export const addItemToScavengerHunt = async (item: NewScavengerHuntItem) => {
	return db.insert(scavengerHuntItems).values(item).returning();
};

export const deleteItemFromScavengerHunt = async (id: string) => {
	return db
		.delete(scavengerHuntItems)
		.where(eq(scavengerHuntItems.id, id))
		.returning();
};
