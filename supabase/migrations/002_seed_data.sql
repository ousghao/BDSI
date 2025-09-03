-- Seed data for Master BDSI website

-- Insert default admin user
INSERT INTO users (id, email, first_name, last_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@bdsi.ma', 'Admin', 'BDSI', 'admin');

-- Insert sample courses
INSERT INTO courses (title, title_en, title_ar, description, description_en, description_ar, semester, credits, objectives, objectives_en, objectives_ar, prerequisites, prerequisites_en, prerequisites_ar, evaluation, evaluation_en, evaluation_ar, resources, resources_en, resources_ar, instructor_id) VALUES
(
    'Introduction aux Systèmes Intelligents',
    'Introduction to Intelligent Systems',
    'مقدمة في الأنظمة الذكية',
    'Ce cours introduit les concepts fondamentaux des systèmes intelligents, incluant l''intelligence artificielle, l''apprentissage automatique et les systèmes experts.',
    'This course introduces the fundamental concepts of intelligent systems, including artificial intelligence, machine learning, and expert systems.',
    'يقدم هذا المساق المفاهيم الأساسية للأنظمة الذكية، بما في ذلك الذكاء الاصطناعي والتعلم الآلي والأنظمة الخبيرة.',
    1,
    6,
    'Comprendre les bases de l''IA, Maîtriser les algorithmes d''apprentissage, Analyser les systèmes experts',
    'Understand AI basics, Master learning algorithms, Analyze expert systems',
    'فهم أساسيات الذكاء الاصطناعي، إتقان خوارزميات التعلم، تحليل الأنظمة الخبيرة',
    'Programmation de base, Mathématiques appliquées',
    'Basic programming, Applied mathematics',
    'البرمجة الأساسية، الرياضيات التطبيقية',
    'Examen final (60%), Projet pratique (30%), Participation (10%)',
    'Final exam (60%), Practical project (30%), Participation (10%)',
    'الامتحان النهائي (60%)، المشروع العملي (30%)، المشاركة (10%)',
    'Python, Scikit-learn, TensorFlow, Documentation officielle',
    'Python, Scikit-learn, TensorFlow, Official documentation',
    'Python، Scikit-learn، TensorFlow، التوثيق الرسمي',
    '550e8400-e29b-41d4-a716-446655440000'
),
(
    'Big Data et Analytics',
    'Big Data and Analytics',
    'البيانات الضخمة والتحليلات',
    'Exploration des technologies Big Data, des outils d''analyse et des méthodes de traitement de données massives.',
    'Exploration of Big Data technologies, analytics tools, and methods for processing massive data.',
    'استكشاف تقنيات البيانات الضخمة وأدوات التحليل وطرق معالجة البيانات الضخمة.',
    2,
    6,
    'Maîtriser Hadoop et Spark, Analyser des données massives, Implémenter des pipelines ETL',
    'Master Hadoop and Spark, Analyze massive data, Implement ETL pipelines',
    'إتقان Hadoop و Spark، تحليل البيانات الضخمة، تنفيذ خطوط أنابيب ETL',
    'Bases de données, Programmation Python',
    'Database fundamentals, Python programming',
    'أساسيات قواعد البيانات، برمجة Python',
    'Projet Big Data (50%), Examen théorique (30%), Présentation (20%)',
    'Big Data project (50%), Theoretical exam (30%), Presentation (20%)',
    'مشروع البيانات الضخمة (50%)، الامتحان النظري (30%)، العرض التقديمي (20%)',
    'Hadoop, Spark, Kafka, MongoDB, Documentation technique',
    'Hadoop, Spark, Kafka, MongoDB, Technical documentation',
    'Hadoop، Spark، Kafka، MongoDB، التوثيق التقني',
    '550e8400-e29b-41d4-a716-446655440000'
);

-- Insert sample projects
INSERT INTO projects (title, title_en, title_ar, description, description_en, description_ar, summary, summary_en, summary_ar, methodology, methodology_en, methodology_ar, results, results_en, results_ar, theme, year, students, supervisors, keywords, awards, is_featured) VALUES
(
    'Système de Recommandation Intelligent pour E-commerce',
    'Intelligent Recommendation System for E-commerce',
    'نظام توصية ذكي للتجارة الإلكترونية',
    'Développement d''un système de recommandation basé sur l''apprentissage profond pour améliorer l''expérience utilisateur dans les plateformes e-commerce.',
    'Development of a deep learning-based recommendation system to improve user experience in e-commerce platforms.',
    'تطوير نظام توصية قائم على التعلم العميق لتحسين تجربة المستخدم في منصات التجارة الإلكترونية.',
    'Un système qui analyse le comportement utilisateur et propose des produits pertinents avec une précision de 85%.',
    'A system that analyzes user behavior and suggests relevant products with 85% accuracy.',
    'نظام يحلل سلوك المستخدم ويقترح منتجات ذات صلة بدقة 85%.',
    'Deep Learning, Collaborative Filtering, Content-Based Filtering, A/B Testing',
    'Deep Learning, Collaborative Filtering, Content-Based Filtering, A/B Testing',
    'التعلم العميق، التصفية التعاونية، التصفية القائمة على المحتوى، اختبار A/B',
    'Amélioration de 40% du taux de conversion, Réduction de 30% du taux d''abandon',
    '40% improvement in conversion rate, 30% reduction in bounce rate',
    'تحسن بنسبة 40% في معدل التحويل، انخفاض بنسبة 30% في معدل الارتداد',
    'IA/ML',
    2024,
    '["Ahmed Benali", "Fatima Zahra"]',
    '["Dr. Mohammed Alami", "Prof. Sarah Johnson"]',
    '["recommendation system", "deep learning", "e-commerce", "user behavior"]',
    '["Best Project Award 2024", "Innovation Prize"]',
    true
),
(
    'Analyse Prédictive pour la Maintenance Industrielle',
    'Predictive Analytics for Industrial Maintenance',
    'التحليل التنبؤي للصيانة الصناعية',
    'Implémentation d''un système d''analyse prédictive utilisant l''IoT et le machine learning pour optimiser la maintenance préventive.',
    'Implementation of a predictive analytics system using IoT and machine learning to optimize preventive maintenance.',
    'تنفيذ نظام تحليل تنبؤي باستخدام إنترنت الأشياء والتعلم الآلي لتحسين الصيانة الوقائية.',
    'Système capable de prédire les pannes avec 90% de précision, réduisant les coûts de maintenance de 25%.',
    'System capable of predicting failures with 90% accuracy, reducing maintenance costs by 25%.',
    'نظام قادر على التنبؤ بالأعطال بدقة 90%، مما يقلل تكاليف الصيانة بنسبة 25%.',
    'IoT Sensors, Time Series Analysis, Random Forest, Anomaly Detection',
    'IoT Sensors, Time Series Analysis, Random Forest, Anomaly Detection',
    'أجهزة استشعار إنترنت الأشياء، تحليل السلاسل الزمنية، الغابة العشوائية، كشف الشذوذ',
    'Prédiction de pannes avec 90% de précision, Économies de 25% sur les coûts de maintenance',
    'Failure prediction with 90% accuracy, 25% savings on maintenance costs',
    'التنبؤ بالأعطال بدقة 90%، توفير 25% في تكاليف الصيانة',
    'Data Engineering',
    2024,
    '["Youssef El Fassi", "Amina Tazi"]',
    '["Dr. Hassan Berrada", "Prof. Jean Dupont"]',
    '["predictive maintenance", "IoT", "machine learning", "industrial analytics"]',
    '["Industrial Innovation Award", "Best IoT Project"]',
    true
);

-- Insert sample news
INSERT INTO news (title, title_en, title_ar, summary, summary_en, summary_ar, content, content_en, content_ar, category, author_id, is_featured, published_at) VALUES
(
    'Nouveau Partenariat avec Google Cloud',
    'New Partnership with Google Cloud',
    'شراكة جديدة مع Google Cloud',
    'Le Master BDSI annonce un partenariat stratégique avec Google Cloud pour renforcer l''enseignement des technologies cloud.',
    'The Master BDSI announces a strategic partnership with Google Cloud to strengthen cloud technology education.',
    'يعلن ماجستير BDSI عن شراكة استراتيجية مع Google Cloud لتعزيز تعليم تقنيات السحابة.',
    'Ce partenariat permettra aux étudiants d''accéder aux dernières technologies cloud et de bénéficier de certifications Google Cloud reconnues mondialement. Les étudiants auront accès à des crédits cloud gratuits et à des formations spécialisées.',
    'This partnership will allow students to access the latest cloud technologies and benefit from globally recognized Google Cloud certifications. Students will have access to free cloud credits and specialized training.',
    'ستتيح هذه الشراكة للطلاب الوصول إلى أحدث تقنيات السحابة والاستفادة من شهادات Google Cloud المعترف بها عالمياً. سيكون لدى الطلاب إمكانية الوصول إلى رصيد سحابي مجاني وتدريب متخصص.',
    'announcement',
    '550e8400-e29b-41d4-a716-446655440000',
    true,
    NOW()
),
(
    'Succès de nos Alumni dans l''IA',
    'Success of our Alumni in AI',
    'نجاح خريجينا في الذكاء الاصطناعي',
    'Plusieurs de nos anciens étudiants ont obtenu des postes prestigieux dans des entreprises de renommée mondiale.',
    'Several of our former students have obtained prestigious positions in world-renowned companies.',
    'حصل العديد من طلابنا السابقين على مناصب مرموقة في شركات ذات شهرة عالمية.',
    'Nous sommes fiers d''annoncer que 15 de nos anciens étudiants ont été recrutés par des entreprises comme Microsoft, Amazon, et Meta. Leur formation en Big Data et Systèmes Intelligents leur a permis de se démarquer dans un marché très concurrentiel.',
    'We are proud to announce that 15 of our former students have been recruited by companies like Microsoft, Amazon, and Meta. Their training in Big Data and Intelligent Systems has allowed them to stand out in a highly competitive market.',
    'نحن فخورون بالإعلان عن أن 15 من طلابنا السابقين تم توظيفهم من قبل شركات مثل Microsoft و Amazon و Meta. تدريبهم في البيانات الضخمة والأنظمة الذكية سمح لهم بالتميز في سوق تنافسي للغاية.',
    'success_story',
    '550e8400-e29b-41d4-a716-446655440000',
    true,
    NOW()
);

-- Insert sample events
INSERT INTO events (title, title_en, title_ar, description, description_en, description_ar, type, location, location_en, location_ar, start_date, end_date, speakers, registration_url) VALUES
(
    'Conférence sur l''IA Générative',
    'Conference on Generative AI',
    'مؤتمر حول الذكاء الاصطناعي التوليدي',
    'Une conférence exclusive sur les dernières avancées en IA générative avec des experts internationaux.',
    'An exclusive conference on the latest advances in generative AI with international experts.',
    'مؤتمر حصري حول أحدث التطورات في الذكاء الاصطناعي التوليدي مع خبراء دوليين.',
    'seminar',
    'Amphithéâtre Principal, FS Dhar El Mehraz',
    'Main Amphitheater, FS Dhar El Mehraz',
    'المدرج الرئيسي، كلية العلوم ظهر المهراز',
    '2024-03-15 09:00:00',
    '2024-03-15 17:00:00',
    '["Dr. Yann LeCun (Meta AI)", "Prof. Yoshua Bengio (Mila)", "Dr. Sara Ahmed (Google Research)"]',
    'https://forms.gle/example'
),
(
    'Défense de Projets PFE',
    'PFE Project Defense',
    'دفاع مشاريع نهاية الدراسة',
    'Présentation et évaluation des projets de fin d''études de la promotion 2024.',
    'Presentation and evaluation of final year projects for the 2024 class.',
    'عرض وتقييم مشاريع نهاية الدراسة للدفعة 2024.',
    'defense',
    'Salle de Conférences, FS Dhar El Mehraz',
    'Conference Room, FS Dhar El Mehraz',
    'قاعة المؤتمرات، كلية العلوم ظهر المهراز',
    '2024-06-20 08:00:00',
    '2024-06-22 18:00:00',
    '["Jury Académique", "Professionnels du Secteur", "Anciens Étudiants"]',
    'https://forms.gle/example2'
);

-- Insert sample faculty
INSERT INTO faculty (name, name_en, name_ar, title, title_en, title_ar, specialization, specialization_en, specialization_ar, bio, bio_en, bio_ar, research, research_en, research_ar, email, phone, linkedin_url, profile_image_url, "order") VALUES
(
    'Dr. Mohammed Alami',
    'Dr. Mohammed Alami',
    'د. محمد العلمي',
    'Professeur Titulaire',
    'Full Professor',
    'أستاذ كامل',
    'Intelligence Artificielle et Machine Learning',
    'Artificial Intelligence and Machine Learning',
    'الذكاء الاصطناعي والتعلم الآلي',
    'Expert en IA avec plus de 15 ans d''expérience dans l''enseignement et la recherche. Auteur de plus de 50 publications scientifiques.',
    'AI expert with over 15 years of experience in teaching and research. Author of more than 50 scientific publications.',
    'خبير في الذكاء الاصطناعي مع أكثر من 15 عاماً من الخبرة في التدريس والبحث. مؤلف أكثر من 50 منشور علمي.',
    'Deep Learning, Computer Vision, Natural Language Processing',
    'Deep Learning, Computer Vision, Natural Language Processing',
    'التعلم العميق، رؤية الحاسوب، معالجة اللغة الطبيعية',
    'm.alami@bdsi.ma',
    '+212-5-37-77-77-77',
    'https://linkedin.com/in/mohammed-alami',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    1
),
(
    'Prof. Sarah Johnson',
    'Prof. Sarah Johnson',
    'أ.د. سارة جونسون',
    'Professeure Associée',
    'Associate Professor',
    'أستاذة مشاركة',
    'Big Data Analytics et Data Science',
    'Big Data Analytics and Data Science',
    'تحليلات البيانات الضخمة وعلوم البيانات',
    'Spécialiste en Big Data avec une expertise en Hadoop, Spark et les architectures de données distribuées.',
    'Big Data specialist with expertise in Hadoop, Spark and distributed data architectures.',
    'متخصصة في البيانات الضخمة مع خبرة في Hadoop و Spark ومعماريات البيانات الموزعة.',
    'Distributed Systems, Data Mining, Predictive Analytics',
    'Distributed Systems, Data Mining, Predictive Analytics',
    'الأنظمة الموزعة، استخراج البيانات، التحليلات التنبؤية',
    's.johnson@bdsi.ma',
    '+212-5-37-77-77-78',
    'https://linkedin.com/in/sarah-johnson',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    2
);

-- Insert sample partnerships
INSERT INTO partnerships (name, name_en, name_ar, type, description, description_en, description_ar, logo_url, website_url, contact_email, contact_person) VALUES
(
    'Microsoft Morocco',
    'Microsoft Morocco',
    'مايكروسوفت المغرب',
    'company',
    'Partenariat stratégique pour l''accès aux technologies Microsoft Azure et l''intelligence artificielle.',
    'Strategic partnership for access to Microsoft Azure technologies and artificial intelligence.',
    'شراكة استراتيجية للوصول إلى تقنيات Microsoft Azure والذكاء الاصطناعي.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    'https://www.microsoft.com/ma-fr',
    'partnerships@microsoft.com',
    'Ahmed Benjelloun'
),
(
    'Institut National de Recherche en Informatique',
    'National Institute for Computer Research',
    'المعهد الوطني للبحث في المعلوماتية',
    'laboratory',
    'Collaboration de recherche en intelligence artificielle et traitement du langage naturel.',
    'Research collaboration in artificial intelligence and natural language processing.',
    'تعاون بحثي في الذكاء الاصطناعي ومعالجة اللغة الطبيعية.',
    'https://example.com/inria-logo.png',
    'https://www.inria.fr',
    'contact@inria.fr',
    'Dr. Marie Dubois'
);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, role_en, role_ar, content, content_en, content_ar, company, graduation_year, is_featured) VALUES
(
    'Fatima Zahra Benali',
    'Data Scientist Senior',
    'Senior Data Scientist',
    'عالمة بيانات أولى',
    'Le Master BDSI m''a donné les compétences techniques et pratiques nécessaires pour exceller dans le domaine de la data science. Les projets pratiques et l''encadrement de qualité ont été déterminants.',
    'The Master BDSI gave me the technical and practical skills needed to excel in the field of data science. The practical projects and quality supervision were decisive.',
    'منحني ماجستير BDSI المهارات التقنية والعملية اللازمة للتميز في مجال علوم البيانات. كانت المشاريع العملية والإشراف الجيد حاسمين.',
    'Amazon Web Services',
    2022,
    true
),
(
    'Youssef El Fassi',
    'Machine Learning Engineer',
    'Machine Learning Engineer',
    'مهندس تعلم آلي',
    'Grâce à la formation BDSI, j''ai pu intégrer une équipe de recherche en IA chez Google. La qualité de l''enseignement et les opportunités de stage ont été exceptionnelles.',
    'Thanks to the BDSI training, I was able to join an AI research team at Google. The quality of teaching and internship opportunities were exceptional.',
    'بفضل التدريب في BDSI، تمكنت من الانضمام إلى فريق بحث في الذكاء الاصطناعي في Google. كانت جودة التدريس وفرص التدريب استثنائية.',
    'Google Research',
    2023,
    true
);

-- Insert sample settings
INSERT INTO settings ("key", value, value_en, value_ar, type, category) VALUES
('site_title', 'Master Big Data & Systèmes Intelligents', 'Master Big Data & Intelligent Systems', 'ماجستير البيانات الضخمة والأنظمة الذكية', 'text', 'general'),
('site_description', 'Formation d''excellence en Big Data et Intelligence Artificielle', 'Excellence training in Big Data and Artificial Intelligence', 'تدريب متميز في البيانات الضخمة والذكاء الاصطناعي', 'text', 'general'),
('contact_email', 'contact@bdsi.ma', 'contact@bdsi.ma', 'contact@bdsi.ma', 'text', 'contact'),
('contact_phone', '+212 5 37 77 77 77', '+212 5 37 77 77 77', '+212 5 37 77 77 77', 'text', 'contact'),
('contact_address', 'FS Dhar El Mehraz, Fès, Maroc', 'FS Dhar El Mehraz, Fez, Morocco', 'كلية العلوم ظهر المهراز، فاس، المغرب', 'text', 'contact'),
('social_facebook', 'https://facebook.com/bdsi.fes', 'https://facebook.com/bdsi.fes', 'https://facebook.com/bdsi.fes', 'text', 'social'),
('social_linkedin', 'https://linkedin.com/company/bdsi-fes', 'https://linkedin.com/company/bdsi-fes', 'https://linkedin.com/company/bdsi-fes', 'text', 'social'),
('featured_projects_limit', '6', '6', '6', 'number', 'display'),
('featured_news_limit', '4', '4', '4', 'number', 'display'),
('upcoming_events_limit', '5', '5', '5', 'number', 'display'),
('enable_dark_mode', 'true', 'true', 'true', 'boolean', 'features'),
('enable_multilingual', 'true', 'true', 'true', 'boolean', 'features'),
('enable_search', 'true', 'true', 'true', 'boolean', 'features'); 