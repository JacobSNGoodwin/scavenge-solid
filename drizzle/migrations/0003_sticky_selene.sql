CREATE TABLE `scavenger_hunt_items` (
	`id` text PRIMARY KEY NOT NULL,
	`hunt_id` text NOT NULL,
	`title` text NOT NULL,
	`value` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now', 'subsec') * 1000) NOT NULL,
	FOREIGN KEY (`hunt_id`) REFERENCES `scavenger_hunts`(`id`) ON UPDATE no action ON DELETE no action
);
