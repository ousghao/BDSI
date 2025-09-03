// doit être la toute première ligne
import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log connection details (without password)
const dbUrl = process.env.DATABASE_URL;
const connectionInfo = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
console.log("🔗 Connecting to database:", connectionInfo);

const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
  ssl: { rejectUnauthorized: false }, // Supabase needs SSL
  onnotice: (notice) => console.log("📝 DB Notice:", notice.message),
  onparameter: (param) => console.log("🔧 DB Parameter:", param),
});

// Test the connection immediately
client`SELECT 1 as connection_test`
  .then(() => console.log("✅ Database client created successfully"))
  .catch((err) => {
    console.error("❌ Failed to create database client:", err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error("   🔍 DNS Resolution failed - check your DATABASE_URL hostname");
    }
    if (err.message.includes('SSL')) {
      console.error("   🔍 SSL connection failed - check SSL configuration");
    }
    if (err.message.includes('authentication')) {
      console.error("   🔍 Authentication failed - check username/password");
    }
  });

export { client };
export const db = drizzle(client, { schema });