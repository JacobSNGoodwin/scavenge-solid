import { eq } from 'drizzle-orm';
import db from './client';
import { user } from './schema';
import type { User, NewUser } from './schema';

export const findUserByEmail = async (
	email: string,
): Promise<User | undefined> => {
	const dbUsers = await db.select().from(user).where(eq(user.email, email));

	return dbUsers[0];
};

export const createUser = async (newUser: NewUser): Promise<User> => {
	const inserted = await db.insert(user).values(newUser).returning();

	return inserted[0];
};
