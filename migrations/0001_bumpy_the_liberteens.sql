CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text
);
--> statement-breakpoint
ALTER TABLE tasks ADD `user_id` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);