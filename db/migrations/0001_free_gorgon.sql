CREATE TABLE "google_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"scope" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "google_tokens_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
-- Row Level Security: tokens are service-role only (no anon/authenticated access)
ALTER TABLE "google_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "google_tokens_service_role_all" ON "google_tokens" FOR ALL TO service_role USING (true) WITH CHECK (true);
