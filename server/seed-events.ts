import { db } from './db.js';
import { events } from '../shared/schema.js';

const sampleEvents = [
  {
    title: 'Séminaire IA Générative',
    titleEn: 'Generative AI Seminar',
    titleAr: 'ندوة الذكاء الاصطناعي التوليدي',
    description: 'Découvrez les dernières avancées en intelligence artificielle générative avec nos experts.',
    descriptionEn: 'Discover the latest advances in generative artificial intelligence with our experts.',
    descriptionAr: 'اكتشف أحدث التطورات في الذكاء الاصطناعي التوليدي مع خبرائنا.',
    type: 'seminar',
    location: 'Amphithéâtre Principal - FS Dhar El Mehraz',
    locationEn: 'Main Amphitheater - FS Dhar El Mehraz',
    locationAr: 'المدرج الرئيسي - كلية العلوم ظهر المهراز',
    startDate: new Date('2024-12-15T09:00:00Z'),
    endDate: new Date('2024-12-15T17:00:00Z'),
    speakers: JSON.stringify(['Dr. Ahmed Bennani', 'Prof. Sarah Johnson', 'Dr. Mohamed Alami']),
    registrationUrl: 'https://forms.gle/example',
    isActive: true
  },
  {
    title: 'Soutenance PFE Promotion 2024',
    titleEn: 'Final Year Project Defense 2024',
    titleAr: 'دفاع مشروع نهاية الدراسة 2024',
    description: 'Présentation des projets de fin d\'études des étudiants de la promotion 2024.',
    descriptionEn: 'Presentation of final year projects by students of the 2024 class.',
    descriptionAr: 'عرض مشاريع نهاية الدراسة لطلاب دفعة 2024.',
    type: 'defense',
    location: 'Salle de Conférences B3',
    locationEn: 'Conference Room B3',
    locationAr: 'قاعة المؤتمرات ب3',
    startDate: new Date('2024-12-20T08:00:00Z'),
    endDate: new Date('2024-12-22T18:00:00Z'),
    speakers: JSON.stringify(['Jury Académique', 'Professionnels du Secteur']),
    registrationUrl: 'https://forms.gle/example2',
    isActive: true
  },
  {
    title: 'Workshop Machine Learning',
    titleEn: 'Machine Learning Workshop',
    titleAr: 'ورشة التعلم الآلي',
    description: 'Atelier pratique sur les techniques de machine learning appliquées au Big Data.',
    descriptionEn: 'Practical workshop on machine learning techniques applied to Big Data.',
    descriptionAr: 'ورشة عملية حول تقنيات التعلم الآلي المطبقة على البيانات الضخمة.',
    type: 'workshop',
    location: 'Laboratoire Informatique L1',
    locationEn: 'Computer Lab L1',
    locationAr: 'مختبر الحاسوب ل1',
    startDate: new Date('2024-12-10T14:00:00Z'),
    endDate: new Date('2024-12-10T18:00:00Z'),
    speakers: JSON.stringify(['Dr. Fatima Zahra', 'Ing. Youssef Benali']),
    registrationUrl: 'https://forms.gle/example3',
    isActive: true
  },
  {
    title: 'Rencontre Alumni',
    titleEn: 'Alumni Meetup',
    titleAr: 'لقاء الخريجين',
    description: 'Rencontrez nos anciens diplômés et découvrez leurs parcours professionnels.',
    descriptionEn: 'Meet our graduates and discover their professional journeys.',
    descriptionAr: 'تعرف على خريجينا واكتشف مساراتهم المهنية.',
    type: 'meetup',
    location: 'Cafétéria de la Faculté',
    locationEn: 'Faculty Cafeteria',
    locationAr: 'كافيتيريا الكلية',
    startDate: new Date('2024-11-30T16:00:00Z'),
    endDate: new Date('2024-11-30T19:00:00Z'),
    speakers: JSON.stringify(['Anciens diplômés 2020-2023']),
    registrationUrl: 'https://forms.gle/example4',
    isActive: true
  }
];

async function seedEvents() {
  try {
    console.log('🌱 Seeding events...');
    
    for (const event of sampleEvents) {
      await db.insert(events).values(event);
      console.log(`✅ Created event: ${event.title}`);
    }
    
    console.log('🎉 Events seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding events:', error);
  } finally {
    process.exit(0);
  }
}

seedEvents();
