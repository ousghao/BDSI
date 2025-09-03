import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import type { Project } from "@shared/schema";

const themes = [
  "Tous",
  "IA/ML",
  "Data Engineering", 
  "NLP",
  "Computer Vision",
  "IoT"
];

const years = [
  "Toutes",
  "2024",
  "2023", 
  "2022",
  "2021"
];

export default function Projects() {
  const { t } = useLanguage();
  
  const themes = [
    { key: "all", label: t('projects.themes.all') },
    { key: "AI_ML", label: "IA/ML" },
    { key: "DataEngineering", label: "Data Engineering" }, 
    { key: "NLP", label: "NLP" },
    { key: "ComputerVision", label: "Computer Vision" },
    { key: "IoT", label: "IoT" }
  ];

  const years = [
    { key: "all", label: t('projects.years.all') },
    { key: "2024", label: "2024" },
    { key: "2023", label: "2023" }, 
    { key: "2022", label: "2022" },
    { key: "2021", label: "2021" }
  ];

  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: any = {};
  if (selectedTheme !== "all") filters.theme = selectedTheme;
  if (selectedYear !== "all") filters.year = parseInt(selectedYear);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", filters],
  });

  const filteredProjects = projects?.filter(project => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      (project.keywords && project.keywords.toLowerCase().includes(searchLower)) ||
      (project.students && project.students.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
              {t('projects.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
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
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('projects.filters')}:</span>
              </div>
              
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-48" data-testid="theme-filter">
                  <SelectValue placeholder={t('projects.selectTheme')} />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.key} value={theme.key} data-testid={`theme-option-${theme.key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32" data-testid="year-filter">
                  <SelectValue placeholder={t('projects.year')} />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.key} value={year.key} data-testid={`year-option-${year.key.toLowerCase()}`}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('projects.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTheme !== "Tous" || selectedYear !== "Toutes" || searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Filtres actifs:</span>
              {selectedTheme !== "Tous" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setSelectedTheme("Tous")}
                  data-testid={`active-filter-theme-${selectedTheme.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {selectedTheme} ×
                </Badge>
              )}
              {selectedYear !== "Toutes" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setSelectedYear("Toutes")}
                  data-testid={`active-filter-year-${selectedYear.toLowerCase()}`}
                >
                  {selectedYear} ×
                </Badge>
              )}
              {searchQuery && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setSearchQuery("")}
                  data-testid="active-filter-search"
                >
                  "{searchQuery}" ×
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTheme("Tous");
                  setSelectedYear("Toutes");
                  setSearchQuery("");
                }}
                className="text-xs"
                data-testid="clear-all-filters"
              >
                Effacer tout
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects && filteredProjects.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <p className="text-slate-600 dark:text-slate-400" data-testid="results-count">
                  {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-grid">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16" data-testid="no-results">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Essayez de modifier vos critères de recherche ou d'effacer les filtres.
              </p>
              <Button
                onClick={() => {
                  setSelectedTheme("Tous");
                  setSelectedYear("Toutes");
                  setSearchQuery("");
                }}
                data-testid="reset-filters-btn"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
