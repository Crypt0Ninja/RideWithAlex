import type { Config } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL must be set in .env.local");
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
} satisfies Config;
