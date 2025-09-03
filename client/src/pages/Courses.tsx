import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Course } from "@shared/schema";

const semesters = [
  "Tous",
  "Semestre 1",
  "Semestre 2", 
  "Semestre 3",
  "Semestre 4"
];

const creditRanges = [
  "Tous",
  "1-3 crédits",
  "4-6 crédits",
  "Plus de 6 crédits"
];

export default function Courses() {
  const { t } = useLanguage();
  const [selectedSemester, setSelectedSemester] = useState("Tous");
  const [selectedCredits, setSelectedCredits] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const filteredCourses = courses?.filter(course => {
    // Filtre par semestre
    if (selectedSemester !== "Tous") {
      const semesterNumber = parseInt(selectedSemester.split(" ")[1]);
      if (course.semester !== semesterNumber) return false;
    }
    
    // Filtre par crédits
    if (selectedCredits !== "Tous") {
      const creditRange = selectedCredits.replace(" crédits", "");
      if (creditRange === "1-3") {
        if (course.credits < 1 || course.credits > 3) return false;
      } else if (creditRange === "4-6") {
        if (course.credits < 4 || course.credits > 6) return false;
      } else if (creditRange === "Plus de 6") {
        if (course.credits <= 6) return false;
      }
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchLower) ||
        course.titleEn?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.objectives?.toLowerCase().includes(searchLower) ||
        course.prerequisites?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const semesterStats = courses?.reduce((acc, course) => {
    acc[course.semester] = (acc[course.semester] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
              {t('courses.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('courses.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(semesterStats).map(([semester, count]) => (
              <div key={semester} className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {count}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t('courses.semester')} {semester}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('courses.filters')}</span>
              </div>
              
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-48" data-testid="semester-filter">
                  <SelectValue placeholder={t('courses.selectSemester')} />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester} data-testid={`semester-option-${semester.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCredits} onValueChange={setSelectedCredits}>
                <SelectTrigger className="w-40" data-testid="credits-filter">
                  <SelectValue placeholder="Crédits" />
                </SelectTrigger>
                <SelectContent>
                  {creditRanges.map((range) => (
                    <SelectItem key={range} value={range} data-testid={`credits-option-${range.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('courses.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Programme par semestre */}
          {selectedSemester === "Tous" && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                Programme Master Big Data & Systems Intelligents
              </h2>
              
              {[1, 2, 3, 4].map((semesterNum) => {
                const semesterCourses = courses?.filter(course => course.semester === semesterNum) || [];
                const totalCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
                
                return (
                  <div key={semesterNum} className="mb-12">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                          Semestre {semesterNum}
                        </h3>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="text-sm">
                            {semesterCourses.length} modules
                          </Badge>
                          <Badge variant="outline" className="text-sm">
                            {totalCredits} crédits ECTS
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {semesterCourses.map((course) => (
                          <div key={course.id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                                {course.title}
                              </h4>
                              <Badge variant="outline" className="text-xs ml-2">
                                {course.credits} ECTS
                              </Badge>
                            </div>
                            {course.titleEn && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-2">
                                {course.titleEn}
                              </p>
                            )}
                            {course.description && (
                              <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                                {course.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {semesterNum === 4 && (
                        <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <p className="text-sm text-primary-800 dark:text-primary-200">
                            <strong>Note :</strong> Le semestre 4 est principalement consacré au Projet de Fin d'Études (PFE) 
                            qui permet aux étudiants d'appliquer leurs connaissances sur un projet concret en entreprise ou en laboratoire.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredCourses && filteredCourses.length > 0 && selectedSemester !== "Tous" ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredCourses.length} {filteredCourses.length > 1 ? t('courses.coursesFoundPlural') : t('courses.coursesFound')}
                </h2>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('courses.total')} {courses?.length || 0} cours
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          ) : selectedSemester !== "Tous" ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {t('courses.noCoursesFound')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('courses.noCoursesMessage')}
              </p>
              <Button 
                onClick={() => {
                  setSelectedSemester("Tous");
                  setSelectedCredits("Tous");
                  setSearchQuery("");
                }}
                variant="outline"
              >
                {t('courses.resetFilters')}
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
