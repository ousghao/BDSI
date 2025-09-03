import { db } from "./db";

export async function ensureDatabaseReady(): Promise<boolean> {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test basic connection
    const result = await db.execute("SELECT 1 as test");
    console.log("✅ Database connection successful!");
    console.log(`   Test query result: ${JSON.stringify(result)}`);
    
    // Test if we can access the schema
    const tablesResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult && tablesResult.length > 0) {
      console.log(`✅ Found ${tablesResult.length} tables in database`);
      console.log(`   Tables: ${tablesResult.map((t: any) => t.table_name).join(', ')}`);
    } else {
      console.log("⚠️  No tables found in database (this might be expected for a new project)");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.message.includes('ENOTFOUND')) {
      console.log("   🔍 This looks like a DNS resolution issue.");
      console.log("   📋 Please check:");
      console.log("      - Your DATABASE_URL environment variable");
      console.log("      - If the Supabase project exists");
      console.log("      - If the hostname is correct");
    }
    
    if (error instanceof Error && error.message.includes('SSL')) {
      console.log("   🔍 This looks like an SSL connection issue.");
      console.log("   📋 Please check if your DATABASE_URL includes ?sslmode=require");
    }
    
    return false;
  }
}
