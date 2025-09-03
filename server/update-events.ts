import { db } from './db.js';
import { events } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const futureEvents = [
  {
    id: 1, // Séminaire IA Générative
    startDate: new Date('2025-12-15T09:00:00Z'),
    endDate: new Date('2025-12-15T17:00:00Z')
  },
  {
    id: 2, // Soutenance PFE
    startDate: new Date('2025-12-20T08:00:00Z'),
    endDate: new Date('2025-12-22T18:00:00Z')
  },
  {
    id: 3, // Workshop ML
    startDate: new Date('2025-10-15T14:00:00Z'),
    endDate: new Date('2025-10-15T18:00:00Z')
  },
  {
    id: 4, // Rencontre Alumni
    startDate: new Date('2025-11-30T16:00:00Z'),
    endDate: new Date('2025-11-30T19:00:00Z')
  }
];

// Ajouter aussi de nouveaux événements
const newEvents = [
  {
    title: 'Conférence Data Science 2025',
    titleEn: 'Data Science Conference 2025',
    titleAr: 'مؤتمر علوم البيانات 2025',
    description: 'Découvrez les dernières tendances en science des données et intelligence artificielle.',
    descriptionEn: 'Discover the latest trends in data science and artificial intelligence.',
    descriptionAr: 'اكتشف أحدث الاتجاهات في علوم البيانات والذكاء الاصطناعي.',
    type: 'seminar',
    location: 'Grand Amphithéâtre - FS Dhar El Mehraz',
    locationEn: 'Grand Amphitheater - FS Dhar El Mehraz',
    locationAr: 'المدرج الكبير - كلية العلوم ظهر المهراز',
    startDate: new Date('2025-09-20T09:00:00Z'),
    endDate: new Date('2025-09-20T17:00:00Z'),
    speakers: JSON.stringify(['Prof. Yann LeCun', 'Dr. Fei-Fei Li', 'Prof. Andrew Ng']),
    registrationUrl: 'https://forms.gle/datascienceconf2025',
    isActive: true
  },
  {
    title: 'Hackathon Big Data',
    titleEn: 'Big Data Hackathon',
    titleAr: 'هاكاثون البيانات الضخمة',
    description: 'Compétition de 48h pour développer des solutions innovantes avec le Big Data.',
    descriptionEn: '48-hour competition to develop innovative solutions with Big Data.',
    descriptionAr: 'مسابقة 48 ساعة لتطوير حلول مبتكرة بالبيانات الضخمة.',
    type: 'workshop',
    location: 'Laboratoires Informatique - FS Dhar El Mehraz',
    locationEn: 'Computer Labs - FS Dhar El Mehraz',
    locationAr: 'مختبرات الحاسوب - كلية العلوم ظهر المهراز',
    startDate: new Date('2025-10-05T09:00:00Z'),
    endDate: new Date('2025-10-07T18:00:00Z'),
    speakers: JSON.stringify(['Équipes étudiantes', 'Mentors industriels', 'Jury expert']),
    registrationUrl: 'https://forms.gle/hackathonbd2025',
    isActive: true
  }
];

async function updateEventsToFuture() {
  try {
    console.log('📅 Updating events to future dates...');
    
    // Mettre à jour les événements existants
    for (const eventUpdate of futureEvents) {
      await db
        .update(events)
        .set({
          startDate: eventUpdate.startDate,
          endDate: eventUpdate.endDate,
          updatedAt: new Date()
        })
        .where(eq(events.id, eventUpdate.id));
      
      console.log(`✅ Updated event ID ${eventUpdate.id} to future dates`);
    }
    
    // Ajouter de nouveaux événements
    for (const event of newEvents) {
      await db.insert(events).values(event);
      console.log(`✅ Created new event: ${event.title}`);
    }
    
    console.log('🎉 All events updated successfully!');
    
    // Afficher tous les événements pour vérification
    const allEvents = await db.select().from(events);
    console.log('\n📋 Current events:');
    allEvents.forEach(event => {
      console.log(`- ${event.title} (${event.startDate})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating events:', error);
  } finally {
    process.exit(0);
  }
}

updateEventsToFuture();
