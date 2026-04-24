CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('private', 'group', 'kids', 'freestyle', 'offpiste');--> statement-breakpoint
CREATE TYPE "public"."slot_status" AS ENUM('available', 'blocked', 'booked');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" uuid,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"lesson_type" "lesson_type" NOT NULL,
	"headcount" integer DEFAULT 1 NOT NULL,
	"total_stotinki" integer NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "slot_status" DEFAULT 'available' NOT NULL,
	"google_event_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slot_id_time_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."time_slots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_slot_id_idx" ON "bookings" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "time_slots_starts_at_idx" ON "time_slots" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "time_slots_status_idx" ON "time_slots" USING btree ("status");--> statement-breakpoint
-- Row Level Security
ALTER TABLE "time_slots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "time_slots_public_select" ON "time_slots" FOR SELECT TO anon, authenticated USING (true);--> statement-breakpoint
CREATE POLICY "time_slots_service_role_all" ON "time_slots" FOR ALL TO service_role USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "bookings_public_insert" ON "bookings" FOR INSERT TO anon, authenticated WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "bookings_service_role_all" ON "bookings" FOR ALL TO service_role USING (true) WITH CHECK (true);