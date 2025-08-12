import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Award, Target, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Course } from "@shared/schema";

const programData = {
  overview: {
    title: "Master Big Data & Systèmes Intelligents",
    duration: "4 semestres (2 ans)",
    credits: "120 ECTS",
    degree: "Master professionnel",
    language: "Français, Anglais",
    location: "Faculté des Sciences Dhar El Mehraz, Fès"
  },
  objectives: [
    "Maîtriser les technologies Big Data et les systèmes de traitement distribué",
    "Développer des compétences en intelligence artificielle et machine learning",
    "Concevoir et implémenter des solutions analytiques complexes",
    "Gérer des projets data science de bout en bout",
    "Comprendre les enjeux éthiques et légaux des données"
  ],
  skills: [
    "Programmation (Python, R, Scala, Java)",
    "Frameworks Big Data (Hadoop, Spark, Kafka)",
    "Machine Learning et Deep Learning",
    "Bases de données NoSQL et NewSQL",
    "Visualisation et Business Intelligence",
    "Cloud Computing et architectures distribuées"
  ],
  careers: [
    "Data Scientist",
    "Ingénieur Big Data",
    "Architecte de données",
    "Consultant en intelligence artificielle",
    "Chef de projet data",
    "Chercheur en IA"
  ]
};

export default function Program() {
  const { t } = useLanguage();
  
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const coursesBySemester = courses?.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<number, Course[]>);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair" data-testid="page-title">
              {programData.overview.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Formation d'excellence pour devenir expert en analyse de données massives et systèmes intelligents
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                Vue d'ensemble du programme
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Notre master combine formation théorique solide et expérience pratique intensive pour préparer 
                les futurs experts en Big Data et systèmes intelligents aux défis du monde professionnel.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3" data-testid="program-duration">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Durée</h4>
                    <p className="text-slate-600 dark:text-slate-400">{programData.overview.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-testid="program-credits">
                  <Award className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Crédits</h4>
                    <p className="text-slate-600 dark:text-slate-400">{programData.overview.credits}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-testid="program-language">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Langues</h4>
                    <p className="text-slate-600 dark:text-slate-400">{programData.overview.language}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-testid="program-degree">
                  <Users className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Diplôme</h4>
                    <p className="text-slate-600 dark:text-slate-400">{programData.overview.degree}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students working with data analysis" 
                className="rounded-2xl shadow-xl"
                data-testid="program-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="objectives" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12" data-testid="program-tabs">
              <TabsTrigger value="objectives">Objectifs</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="careers">Débouchés</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="objectives" data-testid="objectives-content">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Objectifs pédagogiques
                  </h3>
                  <div className="grid gap-4">
                    {programData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                        <p className="text-slate-600 dark:text-slate-400">{objective}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" data-testid="skills-content">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Compétences acquises
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {programData.skills.map((skill, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                        <p className="text-slate-600 dark:text-slate-400">{skill}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="careers" data-testid="careers-content">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Débouchés professionnels
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programData.careers.map((career, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="p-3 justify-center text-center"
                      >
                        {career}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="curriculum" data-testid="curriculum-content">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                  Structure du programme par semestre
                </h3>
                
                {isLoading ? (
                  <div className="grid gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {[1, 2, 3, 4].map(semester => (
                      <Card key={semester} data-testid={`semester-${semester}`}>
                        <CardContent className="p-6">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Semestre {semester}
                          </h4>
                          
                          {coursesBySemester?.[semester] ? (
                            <Accordion type="single" collapsible className="w-full">
                              {coursesBySemester[semester].map((course) => (
                                <AccordionItem key={course.id} value={`course-${course.id}`}>
                                  <AccordionTrigger 
                                    className="text-left"
                                    data-testid={`course-trigger-${course.id}`}
                                  >
                                    <div className="flex items-center justify-between w-full pr-4">
                                      <span className="font-medium">{course.title}</span>
                                      <Badge variant="outline">{course.credits} ECTS</Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent data-testid={`course-content-${course.id}`}>
                                    <div className="space-y-4 text-slate-600 dark:text-slate-400">
                                      {course.description && (
                                        <p>{course.description}</p>
                                      )}
                                      {course.objectives && (
                                        <div>
                                          <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                                            Objectifs
                                          </h5>
                                          <p>{course.objectives}</p>
                                        </div>
                                      )}
                                      {course.prerequisites && (
                                        <div>
                                          <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                                            Prérequis
                                          </h5>
                                          <p>{course.prerequisites}</p>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          ) : (
                            <p className="text-slate-500 dark:text-slate-400 italic">
                              Aucun cours disponible pour ce semestre
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-playfair">
            Prêt à rejoindre notre programme ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Découvrez comment postuler et rejoindre notre communauté d'étudiants passionnés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3"
              data-testid="apply-btn"
            >
              Candidater maintenant
            </Button>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3"
              data-testid="contact-btn"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
