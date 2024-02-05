import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import {
	pgTable,
	bigint,
	varchar,
	index,
	text,
	uuid,
	timestamp,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
	'user',
	{
		id: text('id').primaryKey(),
		email: text('email').unique().notNull(),
		name: text('name').notNull(),
		imageUrl: text('image_url'),
	},
	(table) => {
		return {
			emailIdx: index('email_idx').on(table.email),
		};
	},
);

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

/*
 * Application tables
 */
export const scavengerHunts = pgTable('scavenger_hunts', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	created_by: text('created_by')
		.references(() => user.id)
		.notNull(),
	description: text('description'),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export type ScavengerHunt = typeof scavengerHunts.$inferSelect;
export type NewScavengerHunt = typeof scavengerHunts.$inferInsert;
