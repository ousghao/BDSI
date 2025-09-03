import { db } from './db-supabase';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    const adminEmail = 'admin@fssouan.fes.com';
    
    // Check if admin user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);
    
    if (existingUser.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Role: ${existingUser[0].role}`);
      
      // Update role to admin if it's not already
      if (existingUser[0].role !== 'admin') {
        await db
          .update(users)
          .set({ 
            role: 'admin',
            updatedAt: new Date()
          })
          .where(eq(users.email, adminEmail));
        
        console.log('✅ Updated user role to admin!');
      }
      
      console.log('📋 Admin Credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: demo123`);
      console.log('🌐 Login at: http://localhost:5000/admin');
      return;
    }
    
    // Create admin user (let the database generate the UUID)
    const newUser = await db
      .insert(users)
      .values({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('📋 Admin Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: demo123`);
    console.log(`   Role: admin`);
    console.log(`   User ID: ${newUser[0].id}`);
    console.log('');
    console.log('🌐 Login at: http://localhost:5000/admin');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      console.log('ℹ️  Admin user already exists. Trying to update role...');
      
      try {
        await db
          .update(users)
          .set({ 
            role: 'admin',
            updatedAt: new Date()
          })
          .where(eq(users.email, 'admin@fssouan.fes.com'));
        
        console.log('✅ Updated existing user to admin role!');
        console.log('📋 Admin Credentials:');
        console.log(`   Email: admin@fssouan.fes.com`);
        console.log(`   Password: demo123`);
        console.log(`   Role: admin`);
      } catch (updateError) {
        console.error('❌ Error updating user role:', updateError);
      }
    }
  }
  
  process.exit(0);
}

// Run the script
createAdminUser().catch((error) => {
  console.error('Failed to create admin user:', error);
  process.exit(1);
});
