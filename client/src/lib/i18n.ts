// Simple internationalization system
interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    fr: 'Accueil',
    en: 'Home',
    ar: 'الرئيسية'
  },
  'nav.program': {
    fr: 'Programme',
    en: 'Program',
    ar: 'البرنامج'
  },
  'nav.courses': {
    fr: 'Matières',
    en: 'Courses',
    ar: 'المواد'
  },
  'nav.faculty': {
    fr: 'Équipe',
    en: 'Faculty',
    ar: 'الفريق'
  },
  'nav.projects': {
    fr: 'Projets',
    en: 'Projects',
    ar: 'المشاريع'
  },
  'nav.news': {
    fr: 'Actualités',
    en: 'News',
    ar: 'الأخبار'
  },
  'nav.events': {
    fr: 'Événements',
    en: 'Events',
    ar: 'الأحداث'
  },
  'nav.contact': {
    fr: 'Contact',
    en: 'Contact',
    ar: 'اتصال'
  },

  // Common
  'common.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
    ar: 'جارٍ التحميل...'
  },
  'common.error': {
    fr: 'Une erreur s\'est produite',
    en: 'An error occurred',
    ar: 'حدث خطأ'
  },
  'common.readMore': {
    fr: 'Lire la suite',
    en: 'Read more',
    ar: 'اقرأ المزيد'
  },
  'common.learnMore': {
    fr: 'En savoir plus',
    en: 'Learn more',
    ar: 'تعلم المزيد'
  },

  // Home page
  'home.hero.title': {
    fr: 'Master Big Data & Systèmes Intelligents',
    en: 'Master Big Data & Intelligent Systems',
    ar: 'ماجستير البيانات الضخمة والأنظمة الذكية'
  },
  'home.hero.subtitle': {
    fr: 'Formez-vous aux technologies d\'avenir et devenez expert en intelligence artificielle et analyse de données massives.',
    en: 'Train in future technologies and become an expert in artificial intelligence and big data analysis.',
    ar: 'تدرب على تقنيات المستقبل وكن خبيرًا في الذكاء الاصطناعي وتحليل البيانات الضخمة.'
  },
  'home.hero.discoverProgram': {
    fr: 'Découvrir le Programme',
    en: 'Discover the Program',
    ar: 'اكتشف البرنامج'
  },
  'home.hero.viewProjects': {
    fr: 'Voir les Projets',
    en: 'View Projects',
    ar: 'عرض المشاريع'
  },

  // Stats
  'stats.insertionRate': {
    fr: 'Taux d\'insertion',
    en: 'Job placement rate',
    ar: 'معدل التوظيف'
  },
  'stats.projectsCompleted': {
    fr: 'Projets réalisés',
    en: 'Completed projects',
    ar: 'المشاريع المكتملة'
  },
  'stats.partners': {
    fr: 'Partenaires',
    en: 'Partners',
    ar: 'الشركاء'
  },
  'stats.publications': {
    fr: 'Publications',
    en: 'Publications',
    ar: 'المنشورات'
  },

  // Projects
  'projects.featured': {
    fr: 'Projets Vedettes',
    en: 'Featured Projects',
    ar: 'المشاريع المميزة'
  },
  'projects.viewAll': {
    fr: 'Voir tous les projets',
    en: 'View all projects',
    ar: 'عرض جميع المشاريع'
  },

  // Footer
  'footer.formation': {
    fr: 'Formation',
    en: 'Training',
    ar: 'التكوين'
  },
  'footer.resources': {
    fr: 'Ressources',
    en: 'Resources',
    ar: 'الموارد'
  },
  'footer.contact': {
    fr: 'Contact',
    en: 'Contact',
    ar: 'اتصال'
  },
  'footer.copyright': {
    fr: '© 2024 Master BDSI - FS Dhar El Mehraz. Tous droits réservés.',
    en: '© 2024 Master BDSI - FS Dhar El Mehraz. All rights reserved.',
    ar: '© 2024 ماجستير BDSI - كلية العلوم ظهر المهراز. جميع الحقوق محفوظة.'
  },
};

class I18n {
  private currentLanguage = 'fr';

  setLanguage(lang: string) {
    this.currentLanguage = lang;
  }

  t(key: string, params?: Record<string, any>): string {
    const translation = translations[key]?.[this.currentLanguage] || key;
    
    if (params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return translation;
  }
}

export const i18n = new I18n();

export function setLanguage(lang: string) {
  i18n.setLanguage(lang);
}
