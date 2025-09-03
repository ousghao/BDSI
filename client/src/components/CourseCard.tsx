import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, User, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

const semesterColors = {
  1: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  2: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  3: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  4: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
                      <Badge 
              className={semesterColors[course.semester as keyof typeof semesterColors] || "bg-gray-100 text-gray-700"}
            >
              {t('courses.semester')} {course.semester}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {course.credits} {t('courses.credits')}
            </Badge>
        </div>
        
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {course.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {course.description && (
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
            {course.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          {course.objectives && (
            <div className="flex items-start gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 line-clamp-2">
                {course.objectives}
              </span>
            </div>
          )}
          
          {course.prerequisites && (
            <div className="flex items-start gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                             <span className="text-slate-600 dark:text-slate-400 line-clamp-2">
                 {t('courses.prerequisites')}: {course.prerequisites}
               </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
                           <span>Sem. {course.semester}</span>
           </div>
           {course.instructorId && (
             <div className="flex items-center gap-1">
               <User className="h-4 w-4" />
               <span>{t('courses.instructor')}</span>
             </div>
           )}
          </div>
          
          <Link href={`/courses/${course.id}`}>
                         <Button variant="outline" size="sm" className="group-hover:bg-primary-600 group-hover:text-white transition-colors">
               {t('courses.viewCourse')}
             </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
