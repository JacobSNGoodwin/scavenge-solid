CREATE TABLE `scavenger_hunts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_by` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer DEFAULT unixepoch('now', 'subsec') NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`connections` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user` (`email`);