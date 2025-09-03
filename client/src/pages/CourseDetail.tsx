import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  GraduationCap, 
  FileText, 
  Target,
  Calendar,
  Award
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Course } from "@shared/schema";

const semesterColors = {
  1: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  2: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  3: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  4: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

export default function CourseDetail() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const courseId = parseInt(window.location.pathname.split('/').pop() || '0');

  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('courses.courseNotFound')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t('courses.courseNotFoundMessage')}
            </p>
            <Button onClick={() => setLocation('/courses')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('courses.backToCourses')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
                          <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 mb-4"
                onClick={() => setLocation('/courses')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('courses.backToCourses')}
              </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={semesterColors[course.semester as keyof typeof semesterColors] || "bg-gray-100 text-gray-700"}
                >
                  {t('courses.semester')} {course.semester}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  {course.credits} {t('courses.credits')}
                </Badge>
                {course.isActive && (
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    {t('courses.active')}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
                {course.title}
              </h1>
              
              {course.description && (
                <p className="text-xl text-blue-100 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-200" />
                      <div>
                                               <p className="text-sm text-blue-200">{t('courses.semester')}</p>
                       <p className="font-semibold">{course.semester}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                     <Award className="h-5 w-5 text-blue-200" />
                     <div>
                       <p className="text-sm text-blue-200">{t('courses.credits')}</p>
                       <p className="font-semibold">{course.credits}</p>
                     </div>
                   </div>
                   
                   {course.instructorId && (
                     <div className="flex items-center gap-3">
                       <User className="h-5 w-5 text-blue-200" />
                       <div>
                         <p className="text-sm text-blue-200">{t('courses.instructor')}</p>
                         <p className="font-semibold">À définir</p>
                       </div>
                     </div>
                   )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Objectives */}
              {course.objectives && (
                <Card>
                  <CardHeader>
                                       <CardTitle className="flex items-center gap-2">
                     <Target className="h-5 w-5" />
                     {t('courses.objectives')}
                   </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {course.objectives}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prerequisites */}
              {course.prerequisites && (
                <Card>
                  <CardHeader>
                                       <CardTitle className="flex items-center gap-2">
                     <GraduationCap className="h-5 w-5" />
                     {t('courses.prerequisites')}
                   </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {course.prerequisites}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Evaluation */}
              {course.evaluation && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('courses.evaluation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {course.evaluation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resources */}
              {course.resources && (
                <Card>
                  <CardHeader>
                                       <CardTitle className="flex items-center gap-2">
                     <FileText className="h-5 w-5" />
                     {t('courses.resources')}
                   </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {course.resources}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                                     <div className="flex items-center gap-2 text-sm">
                     <Calendar className="h-4 w-4 text-slate-500" />
                     <span className="text-slate-600 dark:text-slate-400">{t('courses.semester')}:</span>
                     <span className="font-medium">{course.semester}</span>
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm">
                     <Award className="h-4 w-4 text-slate-500" />
                     <span className="text-slate-600 dark:text-slate-400">{t('courses.credits')}:</span>
                     <span className="font-medium">{course.credits}</span>
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm">
                     <BookOpen className="h-4 w-4 text-slate-500" />
                     <span className="text-slate-600 dark:text-slate-400">Statut:</span>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       course.isActive 
                         ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                         : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                     }`}>
                       {course.isActive ? t('courses.active') : t('courses.inactive')}
                     </span>
                   </div>
                </CardContent>
              </Card>

              {/* Related Courses */}
              <Card>
                <CardHeader>
                                   <CardTitle>{t('courses.sameSemester')}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-slate-600 dark:text-slate-400">
                   Découvrez les autres cours du semestre {course.semester}.
                 </p>
                 <Button 
                   variant="outline" 
                   className="w-full mt-4"
                   onClick={() => setLocation(`/courses?semester=${course.semester}`)}
                 >
                   {t('courses.viewAllCourses')}
                 </Button>
                </CardContent>
              </Card>

              {/* Program Link */}
              <Card>
                <CardHeader>
                                   <CardTitle>{t('courses.completeProgram')}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                   {t('courses.consultProgram')}
                 </p>
                 <Link href="/program">
                   <Button variant="outline" className="w-full">
                     {t('courses.viewProgram')}
                   </Button>
                 </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
