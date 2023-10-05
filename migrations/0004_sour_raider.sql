DROP INDEX IF EXISTS `time_unique_constraint`;--> statement-breakpoint
CREATE UNIQUE INDEX `time_unique_constraint` ON `tasks` (`start`,`end`,`user_id`);