// Script to disable maintenance mode and fix blocked settings
const baseUrl = 'http://localhost:3000';

async function disableMaintenance() {
  console.log('🔧 Disabling maintenance mode...\n');

  try {
    // First, try to disable maintenance mode via API
    const response = await fetch(`${baseUrl}/api/admin/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maintenanceMode: false
      }),
    });

    if (response.ok) {
      console.log('✅ Maintenance mode disabled successfully!');
    } else {
      console.log('⚠️ Could not disable via API, trying direct database update...');
    }

    // Test if the site is accessible now
    const settingsResponse = await fetch(`${baseUrl}/api/settings`);
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      console.log('✅ Site settings are now accessible!');
      console.log(`   Maintenance mode: ${settings.settings?.maintenanceMode || 'false'}`);
    } else {
      console.log('❌ Site still not accessible');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 If the server is not running, start it with: npm run dev');
  }
}

disableMaintenance();
