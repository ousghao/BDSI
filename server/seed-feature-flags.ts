import { db } from './db-supabase';
import { featureFlags } from '../shared/schema';

export async function seedFeatureFlags() {
  console.log('Seeding feature flags...');

  const flags = [
    { key: 'home', enabled: true },
    { key: 'program', enabled: true },
    { key: 'projects', enabled: true },
    { key: 'news', enabled: true },
    { key: 'events', enabled: true },
    { key: 'faculty', enabled: true },
    { key: 'contact', enabled: true },
    { key: 'admissions', enabled: true },
    { key: 'dark_mode', enabled: true },
    { key: 'multilingual', enabled: true },
  ];

  for (const flag of flags) {
    try {
      await db.insert(featureFlags).values({
        key: flag.key,
        enabled: flag.enabled,
      }).onConflictDoNothing();
      console.log(`✓ Feature flag "${flag.key}" seeded`);
    } catch (error) {
      console.log(`⚠ Feature flag "${flag.key}" already exists`);
    }
  }

  console.log('Feature flags seeding completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  seedFeatureFlags()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
