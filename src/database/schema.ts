import { sql } from 'drizzle-orm';
import { sqliteTable, index, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable(
	'user',
	{
		id: text('id').primaryKey(),
		email: text('email').unique().notNull(),
		name: text('name').notNull(),
		imageUrl: text('image_url'),
		connections: text('connections', { mode: 'json' })
			.$type<{
				google?: string;
				facebook?: string;
			}>()
			.notNull(),
	},
	(table) => {
		return {
			emailIdx: index('email_idx').on(table.email),
		};
	},
);

export const session = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull(),
});

export type User = typeof user.$inferSelect;
export type ProviderConnection = keyof User['connections'];
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

/*
 * Application tables
 */
export const scavengerHunts = sqliteTable('scavenger_hunts', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	created_by: text('created_by')
		.references(() => user.id)
		.notNull(),
	description: text('description'),
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(unixepoch('now', 'subsec') * 1000)`)
		.notNull(),
});

export type ScavengerHunt = typeof scavengerHunts.$inferSelect;
export type NewScavengerHunt = typeof scavengerHunts.$inferInsert;

export const scavengerHuntItems = sqliteTable('scavenger_hunt_items', {
	id: text('id').primaryKey(),
	hunt_id: text('hunt_id')
		.references(() => scavengerHunts.id)
		.notNull(),
	title: text('title').notNull(),
	value: integer('value', { mode: 'number' }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(unixepoch('now', 'subsec') * 1000)`)
		.notNull(),
});

export type ScavengerHuntItem = typeof scavengerHuntItems.$inferSelect;
export type NewScavengerHuntItem = typeof scavengerHuntItems.$inferInsert;
