CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `start_index` ON `tasks` (`start`);--> statement-breakpoint
CREATE INDEX `end_index` ON `tasks` (`end`);--> statement-breakpoint
CREATE UNIQUE INDEX `time_unique_constraint` ON `tasks` (`start`,`end`);