-- Enable foreign key constraints for data integrity
PRAGMA foreign_keys = ON;

-- Enable query planner optimizations
PRAGMA optimize;

CREATE TABLE `account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`id_token` text,
	`password` text(255),
	`provider_id` text(255) NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `allergen` (
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`name` text(255) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `allergen_name_unique` ON `allergen` (`name`);--> statement-breakpoint
CREATE INDEX `idx_allergen_active` ON `allergen` (`is_active`);--> statement-breakpoint
CREATE TABLE `category` (
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`description` text(255),
	`display_order` integer DEFAULT 0 NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`name` text(255) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE INDEX `idx_category_display_order` ON `category` (`display_order`,`name`);--> statement-breakpoint
CREATE INDEX `idx_category_active` ON `category` (`is_active`);--> statement-breakpoint
CREATE TABLE `menu_availability` (
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`day_of_week` integer NOT NULL,
	`end_time` text(5) NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`menu_item_id` text(30) NOT NULL,
	`start_time` text(5) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "day_of_week_check" CHECK("menu_availability"."day_of_week" >= 0 AND "menu_availability"."day_of_week" <= 6)
);
--> statement-breakpoint
CREATE INDEX `idx_availability_menu_item_id` ON `menu_availability` (`menu_item_id`);--> statement-breakpoint
CREATE INDEX `idx_availability_time_check` ON `menu_availability` (`menu_item_id`,`day_of_week`,`start_time`,`end_time`,`is_active`);--> statement-breakpoint
CREATE TABLE `menu_item` (
	`base_price` real NOT NULL,
	`calories` integer,
	`category_id` text(30) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`currency` text(3) DEFAULT 'USD' NOT NULL,
	`description` text(255),
	`display_order` integer DEFAULT 0 NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`image` text,
	`ingredients` text(255),
	`is_available` integer DEFAULT true NOT NULL,
	`is_gluten_free` integer DEFAULT false NOT NULL,
	`is_popular` integer DEFAULT false NOT NULL,
	`is_spicy` integer DEFAULT false NOT NULL,
	`is_vegan` integer DEFAULT false NOT NULL,
	`is_vegetarian` integer DEFAULT false NOT NULL,
	`name` text(255) NOT NULL,
	`preparation_time` integer DEFAULT 15 NOT NULL,
	`spice_level` integer DEFAULT 0,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "base_price_check" CHECK("menu_item"."base_price" >= 0),
	CONSTRAINT "currency_check" CHECK(length("menu_item"."currency") = 3),
	CONSTRAINT "preparation_time_check" CHECK("menu_item"."preparation_time" > 0),
	CONSTRAINT "calories_check" CHECK("menu_item"."calories" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_menu_item_category_name_unique` ON `menu_item` (`category_id`,`name`);--> statement-breakpoint
CREATE INDEX `idx_menu_item_category_id` ON `menu_item` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_menu_item_available` ON `menu_item` (`is_available`);--> statement-breakpoint
CREATE INDEX `idx_menu_item_popular` ON `menu_item` (`is_popular`) WHERE "menu_item"."is_popular" = 1;--> statement-breakpoint
CREATE INDEX `idx_menu_item_name` ON `menu_item` (`name`);--> statement-breakpoint
CREATE INDEX `idx_menu_item_price` ON `menu_item` (`base_price`);--> statement-breakpoint
CREATE TABLE `menu_item_allergen` (
	`allergen_id` text(30) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`menu_item_id` text(30) NOT NULL,
	`severity` text(255) DEFAULT 'contains' NOT NULL,
	PRIMARY KEY(`menu_item_id`, `allergen_id`),
	FOREIGN KEY (`allergen_id`) REFERENCES `allergen`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "severity_check" CHECK("menu_item_allergen"."severity" in ('contains', 'may_contain', 'processed_in_facility'))
);
--> statement-breakpoint
CREATE INDEX `idx_menu_item_allergen_allergen_id` ON `menu_item_allergen` (`allergen_id`);--> statement-breakpoint
CREATE TABLE `menu_item_variant` (
	`calories` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`description` text(255),
	`display_order` integer DEFAULT 0 NOT NULL,
	`id` text(30) PRIMARY KEY NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`menu_item_id` text(30) NOT NULL,
	`name` text(255) NOT NULL,
	`price_modifier` real DEFAULT 0 NOT NULL,
	`serving_size` text(255),
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_variant_menu_item_name_unique` ON `menu_item_variant` (`menu_item_id`,`name`);--> statement-breakpoint
CREATE INDEX `idx_variant_menu_item_id` ON `menu_item_variant` (`menu_item_id`);--> statement-breakpoint
CREATE INDEX `idx_variant_available` ON `menu_item_variant` (`is_available`);--> statement-breakpoint
CREATE TABLE `session` (
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`impersonated_by` text(255),
	`ip_address` text(255),
	`token` text NOT NULL,
	`updated_at` integer NOT NULL,
	`user_agent` text(255),
	`user_id` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`ban_expires` integer,
	`banned` integer,
	`ban_reason` text(255),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`image` text(2048),
	`name` text(255) NOT NULL,
	`phone_number` text(12),
	`phone_number_verified` integer,
	`role` text(255),
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "role_check" CHECK("user"."role" in ('admin', 'user'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phoneNumber_unique` ON `user` (`phone_number`);--> statement-breakpoint
CREATE TABLE `verification` (
	`created_at` integer DEFAULT (unixepoch()),
	`expires_at` integer NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`identifier` text(255) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()),
	`value` text(255) NOT NULL
);


-- Create trigger to ensure only one default variant per menu item
CREATE TRIGGER IF NOT EXISTS ensure_single_default_variant
    AFTER INSERT ON menu_item_variant
    FOR EACH ROW
    WHEN NEW.is_default = 1
BEGIN
    UPDATE menu_item_variant 
    SET is_default = 0 
    WHERE menu_item_id = NEW.menu_item_id 
      AND id != NEW.id 
      AND is_default = 1;
END;

CREATE TRIGGER IF NOT EXISTS ensure_single_default_variant_update
    AFTER UPDATE ON menu_item_variant
    FOR EACH ROW
    WHEN NEW.is_default = 1 AND OLD.is_default != 1
BEGIN
    UPDATE menu_item_variant 
    SET is_default = 0 
    WHERE menu_item_id = NEW.menu_item_id 
      AND id != NEW.id 
      AND is_default = 1;
END;

-- Optimize database after schema creation
PRAGMA optimize;