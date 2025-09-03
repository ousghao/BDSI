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
  'nav.admissions': {
    fr: 'Admissions',
    en: 'Admissions',
    ar: 'القبول'
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

  // Admissions
  'admissions.title': {
    fr: 'Candidature au Master BDSI',
    en: 'Master BDSI Application',
    ar: 'طلب الالتحاق بماجستير BDSI'
  },
  'admissions.subtitle': {
    fr: 'Postulez au Master "Big Data & Systèmes Intelligents" de la Faculté des Sciences Dhar El Mehraz.',
    en: 'Apply to the "Big Data & Intelligent Systems" Master\'s program at the Faculty of Sciences Dhar El Mehraz.',
    ar: 'تقدم بطلب للالتحاق ببرنامج الماجستير "البيانات الضخمة والأنظمة الذكية" في كلية العلوم ظهر المهراز.'
  },
  'admissions.form.title': {
    fr: 'Formulaire de candidature',
    en: 'Application Form',
    ar: 'نموذج الطلب'
  },
  'admissions.form.submit': {
    fr: 'Soumettre ma candidature',
    en: 'Submit my application',
    ar: 'إرسال طلبي'
  },
  'admissions.success.title': {
    fr: 'Candidature soumise avec succès !',
    en: 'Application submitted successfully!',
    ar: 'تم إرسال الطلب بنجاح!'
  },

  // Courses
  'courses.title': {
    fr: 'Matières et Cours',
    en: 'Courses and Subjects',
    ar: 'المواد والدورات'
  },
  'courses.subtitle': {
    fr: 'Découvrez notre programme complet de formation en Big Data et Systèmes Intelligents',
    en: 'Discover our complete training program in Big Data and Intelligent Systems',
    ar: 'اكتشف برنامجنا التدريبي الكامل في البيانات الضخمة والأنظمة الذكية'
  },
  'courses.semester': {
    fr: 'Semestre',
    en: 'Semester',
    ar: 'الفصل الدراسي'
  },
  'courses.credits': {
    fr: 'crédits',
    en: 'credits',
    ar: 'وحدات'
  },
  'courses.viewCourse': {
    fr: 'Voir le cours',
    en: 'View course',
    ar: 'عرض الدورة'
  },
  'courses.objectives': {
    fr: 'Objectifs d\'apprentissage',
    en: 'Learning objectives',
    ar: 'أهداف التعلم'
  },
  'courses.prerequisites': {
    fr: 'Prérequis',
    en: 'Prerequisites',
    ar: 'المتطلبات المسبقة'
  },
  'courses.evaluation': {
    fr: 'Méthodes d\'évaluation',
    en: 'Evaluation methods',
    ar: 'طرق التقييم'
  },
  'courses.resources': {
    fr: 'Ressources pédagogiques',
    en: 'Educational resources',
    ar: 'الموارد التعليمية'
  },
  'courses.instructor': {
    fr: 'Enseignant',
    en: 'Instructor',
    ar: 'المدرب'
  },
  'courses.active': {
    fr: 'Actif',
    en: 'Active',
    ar: 'نشط'
  },
  'courses.inactive': {
    fr: 'Inactif',
    en: 'Inactive',
    ar: 'غير نشط'
  },
  'courses.backToCourses': {
    fr: 'Retour aux cours',
    en: 'Back to courses',
    ar: 'العودة إلى الدورات'
  },
  'courses.courseNotFound': {
    fr: 'Cours non trouvé',
    en: 'Course not found',
    ar: 'الدورة غير موجودة'
  },
  'courses.courseNotFoundMessage': {
    fr: 'Le cours que vous recherchez n\'existe pas ou a été supprimé.',
    en: 'The course you are looking for does not exist or has been deleted.',
    ar: 'الدورة التي تبحث عنها غير موجودة أو تم حذفها.'
  },
  'courses.sameSemester': {
    fr: 'Cours du même semestre',
    en: 'Courses from the same semester',
    ar: 'دورات من نفس الفصل الدراسي'
  },
  'courses.viewAllCourses': {
    fr: 'Voir tous les cours',
    en: 'View all courses',
    ar: 'عرض جميع الدورات'
  },
  'courses.completeProgram': {
    fr: 'Programme complet',
    en: 'Complete program',
    ar: 'البرنامج الكامل'
  },
  'courses.viewProgram': {
    fr: 'Voir le programme',
    en: 'View program',
    ar: 'عرض البرنامج'
  },
  'courses.consultProgram': {
    fr: 'Consultez le programme complet de formation.',
    en: 'Consult the complete training program.',
    ar: 'استشر البرنامج التدريبي الكامل.'
  },
  'courses.noCoursesFound': {
    fr: 'Aucun cours trouvé',
    en: 'No courses found',
    ar: 'لم يتم العثور على دورات'
  },
  'courses.noCoursesMessage': {
    fr: 'Essayez de modifier vos critères de recherche ou de supprimer certains filtres.',
    en: 'Try modifying your search criteria or removing some filters.',
    ar: 'حاول تعديل معايير البحث أو إزالة بعض المرشحات.'
  },
  'courses.resetFilters': {
    fr: 'Réinitialiser les filtres',
    en: 'Reset filters',
    ar: 'إعادة تعيين المرشحات'
  },
  'courses.searchPlaceholder': {
    fr: 'Rechercher un cours...',
    en: 'Search for a course...',
    ar: 'البحث عن دورة...'
  },
  'courses.filters': {
    fr: 'Filtres:',
    en: 'Filters:',
    ar: 'المرشحات:'
  },
  'courses.selectSemester': {
    fr: 'Sélectionner un semestre',
    en: 'Select a semester',
    ar: 'اختر الفصل الدراسي'
  },
  'courses.allSemesters': {
    fr: 'Tous',
    en: 'All',
    ar: 'الكل'
  },
  'courses.allCredits': {
    fr: 'Tous',
    en: 'All',
    ar: 'الكل'
  },
  'courses.coursesFound': {
    fr: 'cours trouvé',
    en: 'course found',
    ar: 'دورة وجدت'
  },
  'courses.coursesFoundPlural': {
    fr: 'cours trouvés',
    en: 'courses found',
    ar: 'دورات وجدت'
  },
  'courses.total': {
    fr: 'Total:',
    en: 'Total:',
    ar: 'المجموع:'
  },

  // Admin Interface
  'admin.navigation': {
    fr: 'NAVIGATION',
    en: 'NAVIGATION',
    ar: 'التنقل'
  },
  'admin.settings': {
    fr: 'PARAMÈTRES',
    en: 'SETTINGS',
    ar: 'الإعدادات'
  },
  'admin.account': {
    fr: 'COMPTE',
    en: 'ACCOUNT',
    ar: 'الحساب'
  },
  'admin.theme': {
    fr: 'Thème',
    en: 'Theme',
    ar: 'المظهر'
  },
  'admin.language': {
    fr: 'Langue',
    en: 'Language',
    ar: 'اللغة'
  },
  'admin.logout': {
    fr: 'Déconnexion',
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  'admin.admin': {
    fr: 'Admin',
    en: 'Admin',
    ar: 'مشرف'
  },
  'admin.administrator': {
    fr: 'Administrator',
    en: 'Administrator',
    ar: 'مدير'
  },
  'admin.unauthorized': {
    fr: 'Accès non autorisé',
    en: 'Unauthorized access',
    ar: 'وصول غير مصرح'
  },
  'admin.welcomeMessage': {
    fr: 'Bienvenue, {name}. Gérez le contenu et les paramètres du site.',
    en: 'Welcome, {name}. Manage site content and settings.',
    ar: 'أهلاً وسهلاً، {name}. إدارة محتوى الموقع والإعدادات.'
  },
  'admin.quickActions': {
    fr: 'Actions rapides',
    en: 'Quick Actions',
    ar: 'إجراءات سريعة'
  },
  'admin.recentActivities': {
    fr: 'Activités récentes',
    en: 'Recent Activities',
    ar: 'الأنشطة الأخيرة'
  },
  'admin.noRecentActivity': {
    fr: 'Aucune activité récente',
    en: 'No recent activity',
    ar: 'لا توجد أنشطة حديثة'
  },
  'admin.manageContent': {
    fr: 'Gérer le contenu',
    en: 'Manage Content',
    ar: 'إدارة المحتوى'
  },
  'admin.manageApplications': {
    fr: 'Gérer les candidatures',
    en: 'Manage Applications',
    ar: 'إدارة الطلبات'
  },
  'admin.viewPublicSite': {
    fr: 'Voir le site public',
    en: 'View Public Site',
    ar: 'عرض الموقع العام'
  },
  'admin.forms.newProject': {
    fr: 'Nouveau Projet',
    en: 'New Project',
    ar: 'مشروع جديد'
  },
  'admin.forms.newNews': {
    fr: 'Nouvelle Actualité',
    en: 'New News Article',
    ar: 'مقال إخباري جديد'
  },
  'admin.forms.newEvent': {
    fr: 'Nouvel Événement',
    en: 'New Event',
    ar: 'حدث جديد'
  },
  'admin.forms.newMedia': {
    fr: 'Nouveau Média',
    en: 'New Media',
    ar: 'وسائط جديدة'
  },
  'status.published': {
    fr: 'Publié',
    en: 'Published',
    ar: 'منشور'
  },
  'status.draft': {
    fr: 'Brouillon',
    en: 'Draft',
    ar: 'مسودة'
  },
  'status.upcoming': {
    fr: 'À venir',
    en: 'Upcoming',
    ar: 'قادم'
  },
  'status.past': {
    fr: 'Passé',
    en: 'Past',
    ar: 'سابق'
  },
  'status.active': {
    fr: 'actifs',
    en: 'active',
    ar: 'نشط'
  },
  'settings.title': {
    fr: 'Paramètres du site',
    en: 'Site Settings',
    ar: 'إعدادات الموقع'
  },
  'settings.description': {
    fr: 'Configurez les paramètres généraux, l\'apparence et les fonctionnalités du site.',
    en: 'Configure general settings, appearance, and site features.',
    ar: 'تكوين الإعدادات العامة والمظهر وميزات الموقع.'
  },
  'settings.loadError': {
    fr: 'Erreur de chargement',
    en: 'Loading Error',
    ar: 'خطأ في التحميل'
  },
  'settings.loadErrorDescription': {
    fr: 'Impossible de charger les paramètres du site.',
    en: 'Unable to load site settings.',
    ar: 'غير قادر على تحميل إعدادات الموقع.'
  },
  'settings.noChanges': {
    fr: 'Aucun changement',
    en: 'No Changes',
    ar: 'لا توجد تغييرات'
  },
  'settings.noChangesDescription': {
    fr: 'Aucune modification à sauvegarder.',
    en: 'No changes to save.',
    ar: 'لا توجد تغييرات للحفظ.'
  },
  'settings.saved': {
    fr: 'Paramètres sauvegardés',
    en: 'Settings Saved',
    ar: 'تم حفظ الإعدادات'
  },
  'settings.savedDescription': {
    fr: 'Les paramètres ont été mis à jour avec succès.',
    en: 'Settings have been updated successfully.',
    ar: 'تم تحديث الإعدادات بنجاح.'
  },
  'settings.error': {
    fr: 'Erreur',
    en: 'Error',
    ar: 'خطأ'
  },
  'settings.errorDescription': {
    fr: 'Une erreur s\'est produite lors de la sauvegarde.',
    en: 'An error occurred while saving.',
    ar: 'حدث خطأ أثناء الحفظ.'
  },
  'settings.resetChanges': {
    fr: 'Modifications annulées',
    en: 'Changes Cancelled',
    ar: 'تم إلغاء التغييرات'
  },
  'settings.resetDescription': {
    fr: 'Les paramètres ont été remis à leur valeur d\'origine.',
    en: 'Settings have been reset to their original values.',
    ar: 'تم إعادة تعيين الإعدادات إلى قيمها الأصلية.'
  },
  'settings.unsavedChanges': {
    fr: '⚠️ Modifications non sauvegardées',
    en: '⚠️ Unsaved changes',
    ar: '⚠️ تغييرات غير محفوظة'
  },
  'settings.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'settings.save': {
    fr: 'Sauvegarder',
    en: 'Save',
    ar: 'حفظ'
  },
  'settings.saving': {
    fr: 'Sauvegarde...',
    en: 'Saving...',
    ar: 'جاري الحفظ...'
  },
  'settings.tabs.general': {
    fr: 'Général',
    en: 'General',
    ar: 'عام'
  },
  'settings.tabs.contact': {
    fr: 'Contact',
    en: 'Contact',
    ar: 'اتصال'
  },
  'settings.tabs.features': {
    fr: 'Fonctionnalités',
    en: 'Features',
    ar: 'الميزات'
  },
  'settings.tabs.seo': {
    fr: 'SEO',
    en: 'SEO',
    ar: 'تحسين محركات البحث'
  },
  'settings.tabs.maintenance': {
    fr: 'Maintenance',
    en: 'Maintenance',
    ar: 'الصيانة'
  },
  'settings.general.title': {
    fr: 'Paramètres généraux',
    en: 'General Settings',
    ar: 'الإعدادات العامة'
  },
  'settings.general.siteName': {
    fr: 'Nom du site',
    en: 'Site Name',
    ar: 'اسم الموقع'
  },
  'settings.general.siteDescription': {
    fr: 'Description du site',
    en: 'Site Description',
    ar: 'وصف الموقع'
  },
  'settings.social.title': {
    fr: 'Réseaux sociaux',
    en: 'Social Networks',
    ar: 'الشبكات الاجتماعية'
  },
  'content.title': {
    fr: 'Gestion de contenu',
    en: 'Content Management',
    ar: 'إدارة المحتوى'
  },
  'content.description': {
    fr: 'Gérez tous les contenus du site : projets, actualités, événements et équipe.',
    en: 'Manage all site content: projects, news, events and team.',
    ar: 'إدارة جميع محتوى الموقع: المشاريع والأخبار والأحداث والفريق.'
  },
  'content.tabs.projects': {
    fr: 'Projets',
    en: 'Projects',
    ar: 'المشاريع'
  },
  'content.tabs.news': {
    fr: 'Actualités',
    en: 'News',
    ar: 'الأخبار'
  },
  'content.tabs.events': {
    fr: 'Événements',
    en: 'Events',
    ar: 'الأحداث'
  },
  'content.tabs.courses': {
    fr: 'Cours',
    en: 'Courses',
    ar: 'الدورات'
  },
  'content.tabs.faculty': {
    fr: 'Équipe',
    en: 'Faculty',
    ar: 'الفريق'
  },
  'content.search.placeholder': {
    fr: 'Rechercher...',
    en: 'Search...',
    ar: 'بحث...'
  },
  'content.add.new': {
    fr: 'Ajouter',
    en: 'Add New',
    ar: 'إضافة جديد'
  },
  'content.actions.edit': {
    fr: 'Modifier',
    en: 'Edit',
    ar: 'تعديل'
  },
  'content.actions.delete': {
    fr: 'Supprimer',
    en: 'Delete',
    ar: 'حذف'
  },
  'content.actions.view': {
    fr: 'Voir',
    en: 'View',
    ar: 'عرض'
  },
  'content.status.published': {
    fr: 'Publié',
    en: 'Published',
    ar: 'منشور'
  },
  'content.status.draft': {
    fr: 'Brouillon',
    en: 'Draft',
    ar: 'مسودة'
  },
  'content.status.active': {
    fr: 'Actif',
    en: 'Active',
    ar: 'نشط'
  },
  'content.status.inactive': {
    fr: 'Inactif',
    en: 'Inactive',
    ar: 'غير نشط'
  },
  'messages.title': {
    fr: 'Messages de contact',
    en: 'Contact Messages',
    ar: 'رسائل الاتصال'
  },
  'messages.description': {
    fr: 'Consultez et gérez les messages de contact reçus.',
    en: 'View and manage received contact messages.',
    ar: 'عرض وإدارة رسائل الاتصال المستلمة.'
  },
  'messages.filter.all': {
    fr: 'Tous',
    en: 'All',
    ar: 'الكل'
  },
  'messages.filter.unread': {
    fr: 'Non lus',
    en: 'Unread',
    ar: 'غير مقروء'
  },
  'messages.filter.read': {
    fr: 'Lus',
    en: 'Read',
    ar: 'مقروء'
  },
  'messages.filter.archived': {
    fr: 'Archivés',
    en: 'Archived',
    ar: 'مؤرشف'
  },
  'messages.search.placeholder': {
    fr: 'Rechercher dans les messages...',
    en: 'Search messages...',
    ar: 'البحث في الرسائل...'
  },
  'messages.actions.markRead': {
    fr: 'Marquer comme lu',
    en: 'Mark as read',
    ar: 'وضع علامة كمقروء'
  },
  'messages.actions.archive': {
    fr: 'Archiver',
    en: 'Archive',
    ar: 'أرشفة'
  },
  'messages.actions.delete': {
    fr: 'Supprimer',
    en: 'Delete',
    ar: 'حذف'
  },
  'messages.status.new': {
    fr: 'Nouveau',
    en: 'New',
    ar: 'جديد'
  },
  'messages.status.read': {
    fr: 'Lu',
    en: 'Read',
    ar: 'مقروء'
  },
  'messages.status.archived': {
    fr: 'Archivé',
    en: 'Archived',
    ar: 'مؤرشف'
  },
  'media.copied': {
    fr: 'URL copiée',
    en: 'URL copied',
    ar: 'تم نسخ الرابط'
  },
  'media.copiedDescription': {
    fr: 'L\'URL du fichier a été copiée dans le presse-papiers.',
    en: 'The file URL has been copied to clipboard.',
    ar: 'تم نسخ رابط الملف إلى الحافظة.'
  },
  'media.deleted': {
    fr: 'Fichier supprimé',
    en: 'File deleted',
    ar: 'تم حذف الملف'
  },
  'media.deletedDescription': {
    fr: 'Le fichier a été supprimé avec succès.',
    en: 'The file has been successfully deleted.',
    ar: 'تم حذف الملف بنجاح.'
  },
  'media.title': {
    fr: 'Médiathèque',
    en: 'Media Library',
    ar: 'مكتبة الوسائط'
  },
  'media.description': {
    fr: 'Gérez tous vos fichiers multimédias : images, vidéos et documents.',
    en: 'Manage all your media files: images, videos and documents.',
    ar: 'إدارة جميع ملفات الوسائط: الصور ومقاطع الفيديو والوثائق.'
  },
  'media.upload': {
    fr: 'Télécharger un fichier',
    en: 'Upload File',
    ar: 'تحميل ملف'
  },
  'media.search': {
    fr: 'Rechercher des fichiers...',
    en: 'Search files...',
    ar: 'البحث عن الملفات...'
  },
  'media.filter.all': {
    fr: 'Tous les types',
    en: 'All types',
    ar: 'جميع الأنواع'
  },
  'media.filter.images': {
    fr: 'Images',
    en: 'Images',
    ar: 'الصور'
  },
  'media.filter.videos': {
    fr: 'Vidéos',
    en: 'Videos',
    ar: 'الفيديوهات'
  },
  'media.filter.documents': {
    fr: 'Documents',
    en: 'Documents',
    ar: 'المستندات'
  },
  'media.view.grid': {
    fr: 'Grille',
    en: 'Grid',
    ar: 'شبكة'
  },
  'media.view.list': {
    fr: 'Liste',
    en: 'List',
    ar: 'قائمة'
  },
  'media.actions.download': {
    fr: 'Télécharger',
    en: 'Download',
    ar: 'تحميل'
  },
  'media.actions.copy': {
    fr: 'Copier URL',
    en: 'Copy URL',
    ar: 'نسخ الرابط'
  },
  'media.copied': {
    fr: 'URL copiée',
    en: 'URL copied',
    ar: 'تم نسخ الرابط'
  },
  'media.copiedDescription': {
    fr: 'L\'URL du fichier a été copiée dans le presse-papiers.',
    en: 'The file URL has been copied to clipboard.',
    ar: 'تم نسخ رابط الملف إلى الحافظة.'
  },
  'media.deleted': {
    fr: 'Fichier supprimé',
    en: 'File deleted',
    ar: 'تم حذف الملف'
  },
  'media.deletedDescription': {
    fr: 'Le fichier a été supprimé avec succès.',
    en: 'The file has been deleted successfully.',
    ar: 'تم حذف الملف بنجاح.'
  },
  'landing.hero.title': {
    fr: 'Master Big Data & Systèmes Intelligents',
    en: 'Master Big Data & Intelligent Systems',
    ar: 'ماجستير البيانات الضخمة والأنظمة الذكية'
  },
  'landing.hero.subtitle': {
    fr: 'Formez-vous aux technologies d\'avenir et devenez expert en intelligence artificielle et analyse de données massives.',
    en: 'Train in future technologies and become an expert in artificial intelligence and big data analysis.',
    ar: 'تدرب على تقنيات المستقبل وأصبح خبيراً في الذكاء الاصطناعي وتحليل البيانات الضخمة.'
  },
  'landing.hero.discoverProgram': {
    fr: 'Découvrir le Programme',
    en: 'Discover the Program',
    ar: 'اكتشف البرنامج'
  },
  'landing.hero.viewProjects': {
    fr: 'Voir les Projets',
    en: 'View Projects',
    ar: 'عرض المشاريع'
  },
  'landing.hero.techTitle': {
    fr: '🚀 Technologies de Pointe',
    en: '🚀 Cutting-Edge Technologies',
    ar: '🚀 تقنيات متطورة'
  },
  'landing.program.title': {
    fr: 'Un Programme d\'Excellence',
    en: 'A Program of Excellence',
    ar: 'برنامج متميز'
  },
  'landing.program.description': {
    fr: 'Notre master combine théorie avancée et pratique intensive pour former les futurs experts en Big Data et systèmes intelligents.',
    en: 'Our master\'s combines advanced theory and intensive practice to train future experts in Big Data and intelligent systems.',
    ar: 'يجمع برنامج الماجستير لدينا بين النظرية المتقدمة والممارسة المكثفة لتدريب الخبراء المستقبليين في البيانات الضخمة والأنظمة الذكية.'
  },
  'landing.features.ai.title': {
    fr: 'Intelligence Artificielle',
    en: 'Artificial Intelligence',
    ar: 'الذكاء الاصطناعي'
  },
  'landing.features.ai.description': {
    fr: 'Machine Learning, Deep Learning, Vision par ordinateur',
    en: 'Machine Learning, Deep Learning, Computer Vision',
    ar: 'التعلم الآلي، التعلم العميق، الرؤية الحاسوبية'
  },
  'landing.features.bigdata.title': {
    fr: 'Big Data',
    en: 'Big Data',
    ar: 'البيانات الضخمة'
  },
  'landing.features.bigdata.description': {
    fr: 'Hadoop, Spark, NoSQL, Streaming temps réel',
    en: 'Hadoop, Spark, NoSQL, Real-time Streaming',
    ar: 'هادوب، سبارك، NoSQL، البث المباشر'
  },
  'landing.features.nlp.title': {
    fr: 'Traitement du Langage',
    en: 'Natural Language Processing',
    ar: 'معالجة اللغة الطبيعية'
  },
  'landing.features.nlp.description': {
    fr: 'NLP, Analyse textuelle, Chatbots',
    en: 'NLP, Text Analysis, Chatbots',
    ar: 'معالجة اللغة، تحليل النصوص، روبوتات الدردشة'
  },
  'landing.features.systems.title': {
    fr: 'Systèmes Intelligents',
    en: 'Intelligent Systems',
    ar: 'الأنظمة الذكية'
  },
  'landing.features.systems.description': {
    fr: 'IoT, Systèmes embarqués, Edge Computing',
    en: 'IoT, Embedded Systems, Edge Computing',
    ar: 'إنترنت الأشياء، الأنظمة المدمجة، الحوسبة الطرفية'
  },
  'landing.program.detailedProgram': {
    fr: 'Programme détaillé',
    en: 'Detailed Program',
    ar: 'البرنامج التفصيلي'
  },
  'landing.accredited.title': {
    fr: 'Formation Accréditée',
    en: 'Accredited Training',
    ar: 'تدريب معتمد'
  },
  'landing.accredited.subtitle': {
    fr: 'Master de recherche reconnu',
    en: 'Recognized research master',
    ar: 'ماجستير بحث معترف به'
  },
  'landing.accredited.duration': {
    fr: '4 Semestres',
    en: '4 Semesters',
    ar: '4 فصول دراسية'
  },
  'landing.accredited.details': {
    fr: '120 ECTS • Stage en entreprise',
    en: '120 ECTS • Company internship',
    ar: '120 وحدة دراسية • تدريب في الشركة'
  },
  'landing.cta.title': {
    fr: 'Prêt à Façonner l\'Avenir ?',
    en: 'Ready to Shape the Future?',
    ar: 'هل أنت مستعد لتشكيل المستقبل؟'
  },
  'landing.cta.subtitle': {
    fr: 'Rejoignez notre communauté d\'étudiants passionnés et devenez les leaders de demain en Big Data et systèmes intelligents.',
    en: 'Join our community of passionate students and become tomorrow\'s leaders in Big Data and intelligent systems.',
    ar: 'انضم إلى مجتمعنا من الطلاب المتحمسين وكن قادة الغد في البيانات الضخمة والأنظمة الذكية.'
  },
  'landing.cta.applyNow': {
    fr: 'Postuler Maintenant',
    en: 'Apply Now',
    ar: 'قدم الآن'
  },
  'landing.cta.contactUs': {
    fr: 'Prendre Rendez-vous',
    en: 'Schedule Appointment',
    ar: 'حدد موعداً'
  },
  'landing.info.nextSession': {
    fr: 'Prochaine rentrée: Septembre 2024',
    en: 'Next intake: September 2024',
    ar: 'القبول القادم: سبتمبر 2024'
  },
  'landing.info.deadline': {
    fr: 'Date limite candidatures: 30 Juin',
    en: 'Application deadline: June 30',
    ar: 'الموعد النهائي للتقديم: 30 يونيو'
  },
  'landing.info.places': {
    fr: 'Places limitées: 30 étudiants',
    en: 'Limited places: 30 students',
    ar: 'أماكن محدودة: 30 طالب'
  },
  'landing.info.requirements': {
    fr: 'Niveau requis: Licence ou équivalent',
    en: 'Required level: Bachelor\'s or equivalent',
    ar: 'المستوى المطلوب: بكالوريوس أو ما يعادلها'
  },
  'home.featuredProjects': {
    fr: 'Projets Phares',
    en: 'Featured Projects',
    ar: 'المشاريع المميزة'
  },
  'home.viewAllProjects': {
    fr: 'Voir tous les projets',
    en: 'View All Projects',
    ar: 'عرض جميع المشاريع'
  },
  'home.latestNews': {
    fr: 'Dernières Actualités',
    en: 'Latest News',
    ar: 'آخر الأخبار'
  },
  'home.viewAllNews': {
    fr: 'Voir toutes les actualités',
    en: 'View All News',
    ar: 'عرض جميع الأخبار'
  },
  'home.upcomingEvents': {
    fr: 'Événements à Venir',
    en: 'Upcoming Events',
    ar: 'الأحداث القادمة'
  },
  'home.viewAllEvents': {
    fr: 'Voir tous les événements',
    en: 'View All Events',
    ar: 'عرض جميع الأحداث'
  },
  'home.noContent': {
    fr: 'Aucun contenu disponible pour le moment.',
    en: 'No content available at the moment.',
    ar: 'لا يوجد محتوى متاح في الوقت الحالي.'
  },
  'program.title': {
    fr: 'Master Big Data & Systèmes Intelligents (BDSaS)',
    en: 'Master Big Data & Intelligent Systems (BDSaS)',
    ar: 'ماجستير البيانات الضخمة والأنظمة الذكية'
  },
  'program.duration': {
    fr: '4 semestres (2 ans)',
    en: '4 semesters (2 years)',
    ar: '4 فصول دراسية (سنتان)'
  },
  'program.credits': {
    fr: '120 ECTS',
    en: '120 ECTS',
    ar: '120 وحدة دراسية'
  },
  'program.degree': {
    fr: 'Master de recherche',
    en: 'Research Master\'s',
    ar: 'ماجستير بحث'
  },
  'program.language': {
    fr: 'Français & Anglais',
    en: 'French & English',
    ar: 'الفرنسية والإنجليزية'
  },
  'program.location': {
    fr: 'Faculté des Sciences, Université Sidi Mohamed Ben Abdellah (Fès)',
    en: 'Faculty of Sciences, Sidi Mohamed Ben Abdellah University (Fez)',
    ar: 'كلية العلوم، جامعة سيدي محمد بن عبد الله (فاس)'
  },
  'program.overview': {
    fr: 'Vue d\'ensemble',
    en: 'Overview',
    ar: 'نظرة عامة'
  },
  'program.objectives': {
    fr: 'Objectifs',
    en: 'Objectives',
    ar: 'الأهداف'
  },
  'program.skills': {
    fr: 'Compétences acquises',
    en: 'Skills Acquired',
    ar: 'المهارات المكتسبة'
  },
  'program.careers': {
    fr: 'Débouchés professionnels',
    en: 'Career Prospects',
    ar: 'الآفاق المهنية'
  },
  'program.curriculum': {
    fr: 'Programme des cours',
    en: 'Curriculum',
    ar: 'المنهج الدراسي'
  },

  // Admin Login
  'admin.login.title': {
    fr: 'Espace Administration',
    en: 'Administration Area',
    ar: 'منطقة الإدارة'
  },
  'admin.login.loginTitle': {
    fr: 'Connexion',
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  'admin.login.loginDescription': {
    fr: 'Connectez-vous à votre compte Master BDSI',
    en: 'Sign in to your Master BDSI account',
    ar: 'تسجيل الدخول إلى حساب ماستر BDSI الخاص بك'
  },
  'admin.login.signIn': {
    fr: 'Se connecter',
    en: 'Sign in',
    ar: 'تسجيل الدخول'
  },
  'admin.login.adminSignIn': {
    fr: 'Connexion Admin',
    en: 'Admin Login',
    ar: 'تسجيل دخول المدير'
  },
  'admin.login.successTitle': {
    fr: 'Connexion réussie',
    en: 'Login successful',
    ar: 'تم تسجيل الدخول بنجاح'
  },
  'admin.login.successMessage': {
    fr: 'Vous êtes maintenant connecté.',
    en: 'You are now logged in.',
    ar: 'تم تسجيل الدخول بنجاح.'
  },
  'admin.login.adminSuccessTitle': {
    fr: 'Connexion admin réussie',
    en: 'Admin login successful',
    ar: 'تم تسجيل دخول المدير بنجاح'
  },
  'admin.login.adminSuccessMessage': {
    fr: 'Vous êtes maintenant connecté en tant qu\'administrateur.',
    en: 'You are now logged in as administrator.',
    ar: 'تم تسجيل دخولك كمدير.'
  },
  'admin.login.errorTitle': {
    fr: 'Erreur de connexion',
    en: 'Login error',
    ar: 'خطأ في تسجيل الدخول'
  },
  'admin.login.adminErrorTitle': {
    fr: 'Erreur de connexion admin',
    en: 'Admin login error',
    ar: 'خطأ في تسجيل دخول المدير'
  },
  'admin.login.invalidCredentials': {
    fr: 'Identifiants invalides.',
    en: 'Invalid credentials.',
    ar: 'بيانات اعتماد غير صالحة.'
  },
  'admin.login.connectionError': {
    fr: 'Une erreur s\'est produite lors de la connexion.',
    en: 'An error occurred during login.',
    ar: 'حدث خطأ أثناء تسجيل الدخول.'
  },
  'admin.login.adminConnectionError': {
    fr: 'Une erreur s\'est produite lors de la connexion admin.',
    en: 'An error occurred during admin login.',
    ar: 'حدث خطأ أثناء تسجيل دخول المدير.'
  },
  'admin.login.demo': {
    fr: 'Démo',
    en: 'Demo',
    ar: 'تجريبي'
  },
  'admin.login.userDemo': {
    fr: 'Utilisateur: n\'importe quel email + mot de passe: demo123',
    en: 'User: any email + password: demo123',
    ar: 'المستخدم: أي إيميل + كلمة المرور: demo123'
  },
  'admin.login.adminDemo': {
    fr: 'Admin: n\'importe quel email + mot de passe: admin123',
    en: 'Admin: any email + password: admin123',
    ar: 'المدير: أي إيميل + كلمة المرور: admin123'
  },

  // Admin Admissions
  'admin.admissions.title': {
    fr: 'Gestion des candidatures',
    en: 'Applications Management',
    ar: 'إدارة الطلبات'
  },
  'admin.admissions.status.submitted': {
    fr: 'Soumis',
    en: 'Submitted',
    ar: 'مُرسل'
  },
  'admin.admissions.status.under_review': {
    fr: 'En cours d\'examen',
    en: 'Under Review',
    ar: 'قيد المراجعة'
  },
  'admin.admissions.status.accepted': {
    fr: 'Accepté',
    en: 'Accepted',
    ar: 'مقبول'
  },
  'admin.admissions.status.rejected': {
    fr: 'Rejeté',
    en: 'Rejected',
    ar: 'مرفوض'
  },

  // Admin Dashboard
  'admin.dashboard.title': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'admin.dashboard.welcome': {
    fr: 'Bienvenue, {{name}}. Gérez le contenu et les paramètres du site.',
    en: 'Welcome, {{name}}. Manage the content and settings of the site.',
    ar: 'مرحبا، {{name}}. إدارة المحتوى وإعدادات الموقع.'
  },
  'admin.dashboard.defaultWelcome': {
    fr: 'Administrateur',
    en: 'Administrator',
    ar: 'مدير'
  },

  // Content Management
  'admin.content.title': {
    fr: 'Gestion du contenu',
    en: 'Content Management',
    ar: 'إدارة المحتوى'
  },
  'admin.content.manage': {
    fr: 'Gérer le contenu',
    en: 'Manage content',
    ar: 'إدارة المحتوى'
  },
  'admin.content.courses': {
    fr: 'Gestion des matières',
    en: 'Course Management',
    ar: 'إدارة المواد'
  },
  'admin.content.faculty': {
    fr: 'Gestion de l\'équipe',
    en: 'Faculty Management',
    ar: 'إدارة الفريق'
  },
  'admin.content.projects': {
    fr: 'Gestion des projets',
    en: 'Project Management',
    ar: 'إدارة المشاريع'
  },
  'admin.content.news': {
    fr: 'Gestion des actualités',
    en: 'News Management',
    ar: 'إدارة الأخبار'
  },
  'admin.content.events': {
    fr: 'Gestion des événements',
    en: 'Event Management',
    ar: 'إدارة الأحداث'
  },
  'admin.content.media': {
    fr: 'Médiathèque',
    en: 'Media Library',
    ar: 'مكتبة الوسائط'
  },

  // Admin Settings
  'admin.settings.title': {
    fr: 'Paramètres du site',
    en: 'Site Settings',
    ar: 'إعدادات الموقع'
  },
  'admin.settings.description': {
    fr: 'Configurez les paramètres généraux, l\'apparence et les fonctionnalités du site',
    en: 'Configure general settings, appearance and site features',
    ar: 'تكوين الإعدادات العامة والمظهر وميزات الموقع'
  },
  'admin.settings.general': {
    fr: 'Paramètres généraux',
    en: 'General Settings',
    ar: 'الإعدادات العامة'
  },
  'admin.settings.metadata': {
    fr: 'Paramètres et métadonnées',
    en: 'Settings and metadata',
    ar: 'الإعدادات والبيانات الوصفية'
  },
  'admin.settings.saved': {
    fr: 'Paramètres sauvegardés',
    en: 'Settings saved',
    ar: 'تم حفظ الإعدادات'
  },
  'admin.settings.savedDescription': {
    fr: 'Les paramètres ont été mis à jour avec succès.',
    en: 'Settings have been updated successfully.',
    ar: 'تم تحديث الإعدادات بنجاح.'
  },
  'admin.settings.reset': {
    fr: 'Les paramètres ont été remis à leur valeur d\'origine.',
    en: 'Settings have been reset to their original values.',
    ar: 'تم إعادة تعيين الإعدادات إلى قيمها الأصلية.'
  },
  'admin.settings.loadError': {
    fr: 'Impossible de charger les paramètres du site.',
    en: 'Unable to load site settings.',
    ar: 'غير قادر على تحميل إعدادات الموقع.'
  },
  'admin.settings.pageUpdated': {
    fr: 'Les paramètres des pages ont été mis à jour.',
    en: 'Page settings have been updated.',
    ar: 'تم تحديث إعدادات الصفحة.'
  },

  // Messages and Contact
  'admin.contact.title': {
    fr: 'Messages de contact',
    en: 'Contact Messages',
    ar: 'رسائل الاتصال'
  },
  'admin.admissions.title': {
    fr: 'Candidatures',
    en: 'Applications',
    ar: 'الطلبات'
  },
  'admin.admissions.manage': {
    fr: 'Gérer les candidatures',
    en: 'Manage applications',
    ar: 'إدارة الطلبات'
  },

  // Logout messages
  'logout.success': {
    fr: 'Déconnexion réussie',
    en: 'Logout successful',
    ar: 'تم تسجيل الخروج بنجاح'
  },
  'logout.error': {
    fr: 'Erreur de déconnexion',
    en: 'Logout error',
    ar: 'خطأ في تسجيل الخروج'
  },
  'logout.errorDescription': {
    fr: 'Une erreur s\'est produite lors de la déconnexion.',
    en: 'An error occurred during logout.',
    ar: 'حدث خطأ أثناء تسجيل الخروج.'
  },

  // Contact Page
  'contact.title': {
    fr: 'Nous contacter',
    en: 'Contact Us',
    ar: 'اتصل بنا'
  },
  'contact.subtitle': {
    fr: 'N\'hésitez pas à nous contacter pour toute question concernant le Master BDSI',
    en: 'Feel free to contact us for any questions about the BDSI Master\'s program',
    ar: 'لا تتردد في الاتصال بنا لأي أسئلة حول برنامج الماجستير BDSI'
  },
  'contact.form.title': {
    fr: 'Envoyer un message',
    en: 'Send a message',
    ar: 'إرسال رسالة'
  },
  'contact.info.title': {
    fr: 'Informations de contact',
    en: 'Contact Information',
    ar: 'معلومات الاتصال'
  },
  'contact.location.title': {
    fr: 'Notre emplacement',
    en: 'Our Location',
    ar: 'موقعنا'
  },
  'contact.location.address': {
    fr: 'Faculté des Sciences Dhar El Mehraz, Université Sidi Mohammed Ben Abdellah, Fès, Maroc',
    en: 'Faculty of Sciences Dhar El Mehraz, Sidi Mohammed Ben Abdellah University, Fez, Morocco',
    ar: 'كلية العلوم ظهر المهراز، جامعة سيدي محمد بن عبدالله، فاس، المغرب'
  },
  'contact.access.title': {
    fr: 'Comment nous rejoindre',
    en: 'How to reach us',
    ar: 'كيفية الوصول إلينا'
  },
  'contact.access.description': {
    fr: 'Le campus de la Faculté des Sciences Dhar El Mehraz est facilement accessible par les transports en commun depuis le centre-ville de Fès.',
    en: 'The Faculty of Sciences Dhar El Mehraz campus is easily accessible by public transport from downtown Fez.',
    ar: 'يمكن الوصول بسهولة إلى حرم كلية العلوم ظهر المهراز بواسطة وسائل النقل العام من وسط مدينة فاس.'
  },
  'contact.reason.admission': {
    fr: 'Candidature et admission',
    en: 'Application and admission',
    ar: 'الطلب والقبول'
  },
  'contact.reason.program': {
    fr: 'Information sur le programme',
    en: 'Program information',
    ar: 'معلومات البرنامج'
  },
  'contact.reason.partnership': {
    fr: 'Partenariat entreprise',
    en: 'Business partnership',
    ar: 'شراكة تجارية'
  },
  'contact.reason.internship': {
    fr: 'Stage ou projet',
    en: 'Internship or project',
    ar: 'تدريب أو مشروع'
  },
  'contact.reason.research': {
    fr: 'Collaboration recherche',
    en: 'Research collaboration',
    ar: 'تعاون بحثي'
  },
  'contact.reason.other': {
    fr: 'Autre',
    en: 'Other',
    ar: 'آخر'
  },
  'contact.hours': {
    fr: 'Horaires d\'ouverture',
    en: 'Opening hours',
    ar: 'ساعات العمل'
  },
  'contact.hours.weekdays': {
    fr: 'Du lundi au vendredi : 8h00 - 18h00',
    en: 'Monday to Friday: 8:00 AM - 6:00 PM',
    ar: 'من الإثنين إلى الجمعة: 8:00 - 18:00'
  },

  // Forms
  'form.name': {
    fr: 'Nom',
    en: 'Name',
    ar: 'الاسم'
  },
  'form.fullName': {
    fr: 'Nom complet',
    en: 'Full Name',
    ar: 'الاسم الكامل'
  },
  'form.firstName': {
    fr: 'Prénom',
    en: 'First Name',
    ar: 'الاسم الأول'
  },
  'form.lastName': {
    fr: 'Nom de famille',
    en: 'Last Name',
    ar: 'اسم العائلة'
  },
  'form.email': {
    fr: 'Email',
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  'form.phone': {
    fr: 'Téléphone',
    en: 'Phone',
    ar: 'الهاتف'
  },
  'form.organization': {
    fr: 'Organisation',
    en: 'Organization',
    ar: 'المنظمة'
  },
  'form.contactReason': {
    fr: 'Motif de contact',
    en: 'Contact reason',
    ar: 'سبب التواصل'
  },
  'form.selectReason': {
    fr: 'Sélectionnez un motif',
    en: 'Select a reason',
    ar: 'اختر السبب'
  },
  'form.message': {
    fr: 'Message',
    en: 'Message',
    ar: 'الرسالة'
  },
  'form.subject': {
    fr: 'Sujet',
    en: 'Subject',
    ar: 'الموضوع'
  },
  'form.send': {
    fr: 'Envoyer',
    en: 'Send',
    ar: 'إرسال'
  },
  'form.sendMessage': {
    fr: 'Envoyer le message',
    en: 'Send message',
    ar: 'إرسال الرسالة'
  },

  'form.placeholders.name': {
    fr: 'Votre nom complet',
    en: 'Your full name',
    ar: 'اسمك الكامل'
  },
  'form.placeholders.email': {
    fr: 'votre.email@exemple.com',
    en: 'your.email@example.com',
    ar: 'البريد.الإلكتروني@مثال.com'
  },
  'form.placeholders.phone': {
    fr: '+212 6XX XX XX XX',
    en: '+212 6XX XX XX XX',
    ar: '+212 6XX XX XX XX'
  },
  'form.placeholders.organization': {
    fr: 'Votre entreprise/université',
    en: 'Your company/university',
    ar: 'شركتك/جامعتك'
  },
  'form.placeholders.subject': {
    fr: 'Objet de votre message',
    en: 'Subject of your message',
    ar: 'موضوع رسالتك'
  },
  'form.placeholders.message': {
    fr: 'Décrivez votre demande en détail...',
    en: 'Describe your request in detail...',
    ar: 'صف طلبك بالتفصيل...'
  },
  'form.required': {
    fr: 'Champ obligatoire',
    en: 'Required field',
    ar: 'حقل مطلوب'
  },
  'form.sending': {
    fr: 'Envoi en cours...',
    en: 'Sending...',
    ar: 'جارٍ الإرسال...'
  },
  'form.sent': {
    fr: 'Message envoyé',
    en: 'Message sent',
    ar: 'تم إرسال الرسالة'
  },
  'form.error': {
    fr: 'Erreur d\'envoi',
    en: 'Sending error',
    ar: 'خطأ في الإرسال'
  },

  // Faculty Page
  'faculty.title': {
    fr: 'Notre équipe pédagogique',
    en: 'Our Teaching Staff',
    ar: 'فريقنا التعليمي'
  },
  'faculty.subtitle': {
    fr: 'Découvrez l\'équipe d\'enseignants-chercheurs experts en Big Data et Systèmes Intelligents',
    en: 'Meet our team of expert teacher-researchers in Big Data and Intelligent Systems',
    ar: 'تعرف على فريق الباحثين والمدرسين الخبراء في البيانات الضخمة والأنظمة الذكية'
  },
  'faculty.professor': {
    fr: 'Professeur',
    en: 'Professor',
    ar: 'أستاذ'
  },
  'faculty.expertise': {
    fr: 'Domaines d\'expertise',
    en: 'Areas of expertise',
    ar: 'مجالات الخبرة'
  },
  'faculty.publications': {
    fr: 'Publications',
    en: 'Publications',
    ar: 'المنشورات'
  },
  'faculty.contact': {
    fr: 'Contacter',
    en: 'Contact',
    ar: 'اتصال'
  },

  // News Page
  'news.title': {
    fr: 'Actualités',
    en: 'News',
    ar: 'الأخبار'
  },
  'news.subtitle': {
    fr: 'Restez informé des dernières nouvelles et événements du Master Big Data & Systèmes Intelligents',
    en: 'Stay informed about the latest news and events from the Master in Big Data & Intelligent Systems',
    ar: 'ابق على اطلاع على آخر الأخبار والأحداث من ماجستير البيانات الضخمة والأنظمة الذكية'
  },
  'news.filters': {
    fr: 'Filtres',
    en: 'Filters',
    ar: 'المرشحات'
  },
  'news.selectCategory': {
    fr: 'Sélectionner une catégorie',
    en: 'Select a category',
    ar: 'اختر فئة'
  },
  'news.searchPlaceholder': {
    fr: 'Rechercher dans les actualités...',
    en: 'Search in news...',
    ar: 'البحث في الأخبار...'
  },
  'news.categories.all': {
    fr: 'Toutes les catégories',
    en: 'All categories',
    ar: 'جميع الفئات'
  },
  'news.categories.events': {
    fr: 'Événements',
    en: 'Events',
    ar: 'الأحداث'
  },
  'news.categories.research': {
    fr: 'Recherche',
    en: 'Research',
    ar: 'البحث'
  },
  'news.categories.successStories': {
    fr: 'Success Stories',
    en: 'Success Stories',
    ar: 'قصص النجاح'
  },
  'news.categories.announcements': {
    fr: 'Annonces',
    en: 'Announcements',
    ar: 'الإعلانات'
  },
  'news.publishedOn': {
    fr: 'Publié le',
    en: 'Published on',
    ar: 'نُشر في'
  },
  'news.readTime': {
    fr: 'min de lecture',
    en: 'min read',
    ar: 'دقيقة قراءة'
  },
  'news.backToNews': {
    fr: 'Retour aux actualités',
    en: 'Back to news',
    ar: 'العودة إلى الأخبار'
  },

  // Events Page
  'events.title': {
    fr: 'Événements',
    en: 'Events',
    ar: 'الأحداث'
  },
  'events.subtitle': {
    fr: 'Participez aux séminaires, workshops et événements qui enrichissent votre parcours académique',
    en: 'Participate in seminars, workshops and events that enrich your academic journey',
    ar: 'شارك في الندوات وورش العمل والأحداث التي تثري رحلتك الأكاديمية'
  },
  'events.types.all': {
    fr: 'Tous les types',
    en: 'All types',
    ar: 'جميع الأنواع'
  },
  'events.types.seminars': {
    fr: 'Séminaires',
    en: 'Seminars',
    ar: 'الندوات'
  },
  'events.types.defenses': {
    fr: 'Soutenances',
    en: 'Defenses',
    ar: 'المناقشات'
  },
  'events.types.workshops': {
    fr: 'Workshops',
    en: 'Workshops',
    ar: 'ورش العمل'
  },
  'events.types.meetups': {
    fr: 'Meetups',
    en: 'Meetups',
    ar: 'اللقاءات'
  },
  'events.subtitle': {
    fr: 'Découvrez les événements à venir et les activités du Master BDSI',
    en: 'Discover upcoming events and activities of the BDSI Master\'s program',
    ar: 'اكتشف الأحداث القادمة وأنشطة برنامج الماجستير BDSI'
  },
  'events.upcoming': {
    fr: 'Événements à venir',
    en: 'Upcoming events',
    ar: 'الأحداث القادمة'
  },
  'events.past': {
    fr: 'Événements passés',
    en: 'Past events',
    ar: 'الأحداث السابقة'
  },
  'events.date': {
    fr: 'Date',
    en: 'Date',
    ar: 'التاريخ'
  },
  'events.time': {
    fr: 'Heure',
    en: 'Time',
    ar: 'الوقت'
  },
  'events.location': {
    fr: 'Lieu',
    en: 'Location',
    ar: 'المكان'
  },
  'events.register': {
    fr: 'S\'inscrire',
    en: 'Register',
    ar: 'سجل'
  },
  'events.noEvents': {
    fr: 'Aucun événement prévu pour le moment.',
    en: 'No events scheduled at the moment.',
    ar: 'لا توجد أحداث مجدولة في الوقت الحالي.'
  },

  // Projects Page
  'projects.title': {
    fr: 'Projets étudiants',
    en: 'Student Projects',
    ar: 'مشاريع الطلاب'
  },
  'projects.subtitle': {
    fr: 'Découvrez les projets innovants réalisés par nos étudiants',
    en: 'Discover the innovative projects created by our students',
    ar: 'اكتشف المشاريع المبتكرة التي أنجزها طلابنا'
  },
  'projects.technologies': {
    fr: 'Technologies utilisées',
    en: 'Technologies used',
    ar: 'التقنيات المستخدمة'
  },
  'projects.team': {
    fr: 'Équipe',
    en: 'Team',
    ar: 'الفريق'
  },
  'projects.supervisor': {
    fr: 'Encadrant',
    en: 'Supervisor',
    ar: 'المشرف'
  },
  'projects.status': {
    fr: 'Statut',
    en: 'Status',
    ar: 'الحالة'
  },
  'projects.filters': {
    fr: 'Filtres',
    en: 'Filters',
    ar: 'المرشحات'
  },
  'projects.selectTheme': {
    fr: 'Sélectionner un thème',
    en: 'Select a theme',
    ar: 'اختر موضوعاً'
  },
  'projects.year': {
    fr: 'Année',
    en: 'Year',
    ar: 'السنة'
  },
  'projects.searchPlaceholder': {
    fr: 'Rechercher un projet...',
    en: 'Search for a project...',
    ar: 'البحث عن مشروع...'
  },
  'projects.themes.all': {
    fr: 'Tous',
    en: 'All',
    ar: 'الكل'
  },
  'projects.years.all': {
    fr: 'Toutes',
    en: 'All',
    ar: 'الكل'
  },
  'projects.completed': {
    fr: 'Terminé',
    en: 'Completed',
    ar: 'مكتمل'
  },
  'projects.inProgress': {
    fr: 'En cours',
    en: 'In Progress',
    ar: 'قيد التنفيذ'
  }
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

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}

export const i18n = new I18n();

export function setLanguage(lang: string) {
  i18n.setLanguage(lang);
}

// Hook pour utiliser les traductions dans les composants
export function useTranslations() {
  return {
    t: (key: string, params?: Record<string, any>) => i18n.t(key, params),
    currentLanguage: i18n.getCurrentLanguage()
  };
}
