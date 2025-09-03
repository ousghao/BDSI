import { db } from './db';
import { settings } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Default settings
const defaultSettings = {
  siteName: "Master BDSI - FS Dhar El Mehraz",
  siteDescription: "Formation d'excellence en Big Data et Systèmes Intelligents pour les futurs leaders technologiques.",
  contactEmail: "master.bdsi@usmba.ac.ma",
  contactPhone: "+212 5 35 60 XX XX",
  address: "Faculté des Sciences Dhar El Mehraz, Route d'Imouzzer, BP 1796, 30000 Fès, Maroc",
  linkedinUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  darkModeEnabled: true,
  multiLanguageEnabled: true,
  registrationEnabled: false,
  metaKeywords: "master, big data, systèmes intelligents, intelligence artificielle, fès, maroc",
  metaDescription: "Master Big Data & Systèmes Intelligents à la Faculté des Sciences Dhar El Mehraz, Fès. Formation d'excellence en IA et analyse de données massives.",
  maintenanceMode: false,
  maintenanceMessage: "Le site est temporairement en maintenance. Nous serons bientôt de retour.",
};

async function seedSettings() {
  try {
    console.log('🌱 Seeding site settings...');
    
    // Insert all default settings
    for (const [key, value] of Object.entries(defaultSettings)) {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      await db
        .insert(settings)
        .values({
          key,
          value: stringValue,
          type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
          category: 'site_settings'
        })
        .onConflictDoUpdate({
          target: settings.key,
          set: {
            value: stringValue,
            type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
            updatedAt: new Date()
          }
        });
    }
    
    console.log('✅ Site settings seeded successfully!');
    
    // Display current settings
    const dbSettings = await db.select().from(settings).where(eq(settings.category, 'site_settings'));
    console.log('\n📋 Current settings:');
    dbSettings.forEach(setting => {
      console.log(`  ${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedSettings().then(() => {
    console.log('🎉 Settings seeding completed!');
    process.exit(0);
  });
}

export { seedSettings };
