CREATE TABLE `menu_option` (
	`calories_modifier` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`group_id` text(30) NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`name` text(255) NOT NULL,
	`price_modifier` real DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `menu_option_group`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_option_group_name_unique` ON `menu_option` (`group_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_option_group_single_default` ON `menu_option` (`group_id`) WHERE "menu_option"."is_default" = 1;--> statement-breakpoint
CREATE INDEX `idx_option_group_id` ON `menu_option` (`group_id`);--> statement-breakpoint
CREATE INDEX `idx_option_available` ON `menu_option` (`is_available`);--> statement-breakpoint
CREATE INDEX `idx_option_display_order` ON `menu_option` (`display_order`);--> statement-breakpoint
CREATE TABLE `menu_option_group` (
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`max_select` integer DEFAULT 1 NOT NULL,
	`menu_item_id` text(30) NOT NULL,
	`min_select` integer DEFAULT 0 NOT NULL,
	`name` text(255) NOT NULL,
	`required` integer DEFAULT false NOT NULL,
	`selection_type` text(16) DEFAULT 'single' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_group_menu_item_name_unique` ON `menu_option_group` (`menu_item_id`,`name`);--> statement-breakpoint
CREATE INDEX `idx_group_menu_item_id` ON `menu_option_group` (`menu_item_id`);--> statement-breakpoint
CREATE INDEX `idx_group_available` ON `menu_option_group` (`is_available`);--> statement-breakpoint
CREATE INDEX `idx_group_display_order` ON `menu_option_group` (`display_order`);--> statement-breakpoint
DROP TABLE `menu_item_variant`;--> statement-breakpoint
ALTER TABLE `menu_item` DROP COLUMN `is_spicy`;--> statement-breakpoint
ALTER TABLE `menu_item` DROP COLUMN `spice_level`;