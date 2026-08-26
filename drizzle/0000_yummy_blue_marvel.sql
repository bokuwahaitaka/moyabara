CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`body` text NOT NULL,
	`empathy` integer DEFAULT 0 NOT NULL,
	`same` integer DEFAULT 0 NOT NULL,
	`reports` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'visible' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
