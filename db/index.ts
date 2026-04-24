import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

let _client: ReturnType<typeof postgres> | null = null;
let _db: DrizzleClient | null = null;

function getDb(): DrizzleClient {
  if (_db) return _db;

  const connectionString =
    process.env.DATABASE_POOL_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_POOL_URL or DATABASE_URL must be set in environment",
    );
  }

  _client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  _db = drizzle(_client, { schema });
  return _db;
}

// Proxy defers client creation until first property access. This keeps the
// module import side-effect-free so Next.js build-time page data collection
// doesn't fail when env vars aren't evaluated yet.
export const db = new Proxy({} as DrizzleClient, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export * from "./schema";
