import { db } from './db.js';
import { users } from '../shared/schema.js';

async function seedAdmin() {
  try {
    console.log('👤 Creating admin user...');
    
    const adminUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@bdsi.ma',
      firstName: 'Admin',
      lastName: 'BDSI',
      role: 'admin',
      profileImageUrl: null
    };
    
    await db.insert(users).values(adminUser).onConflictDoNothing();
    console.log(`✅ Admin user created: ${adminUser.email}`);
    console.log('🔑 Password: demo123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
