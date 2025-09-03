import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar } from "lucide-react";
import type { News } from "@shared/schema";

export default function News() {
  const { t } = useLanguage();
  
  const categories = [
    { value: "all", label: t('news.categories.all') },
    { value: "event", label: t('news.categories.events') },
    { value: "research", label: t('news.categories.research') },
    { value: "success_story", label: t('news.categories.successStories') },
    { value: "announcement", label: t('news.categories.announcements') },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: any = {};
  if (selectedCategory !== "all") filters.category = selectedCategory;

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news", filters],
  });

  const filteredNews = news?.filter(article => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.summary?.toLowerCase().includes(searchLower) ||
      article.content?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair" data-testid="page-title">
              {t('news.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('news.subtitle')}
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
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('news.filters')}:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-64" data-testid="category-filter">
                  <SelectValue placeholder={t('news.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      data-testid={`category-option-${category.value}`}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('news.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "all" || searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Filtres actifs:</span>
              {selectedCategory !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                  data-testid={`active-filter-category-${selectedCategory}`}
                >
                  {categories.find(c => c.value === selectedCategory)?.label} ×
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
                  setSelectedCategory("all");
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

      {/* News Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews && filteredNews.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <p className="text-slate-600 dark:text-slate-400" data-testid="results-count">
                  {filteredNews.length} actualité{filteredNews.length > 1 ? 's' : ''} trouvée{filteredNews.length > 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Featured Articles */}
              {filteredNews.some(article => article.isFeatured) && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">À la une</h2>
                  <div className="grid lg:grid-cols-2 gap-8" data-testid="featured-articles">
                    {filteredNews
                      .filter(article => article.isFeatured)
                      .slice(0, 2)
                      .map((article) => (
                        <NewsCard key={article.id} article={article} variant="vertical" />
                      ))}
                  </div>
                </div>
              )}
              
              {/* All Articles */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                  {filteredNews.some(article => article.isFeatured) ? "Toutes les actualités" : "Actualités"}
                </h2>
                <div className="space-y-8" data-testid="news-list">
                  {filteredNews
                    .filter(article => !article.isFeatured)
                    .map((article) => (
                      <NewsCard key={article.id} article={article} variant="horizontal" />
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16" data-testid="no-results">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Aucune actualité trouvée
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Essayez de modifier vos critères de recherche ou d'effacer les filtres.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("all");
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
