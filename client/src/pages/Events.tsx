import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Search, Filter, Clock, MapPin, Users } from "lucide-react";
import type { Event } from "@shared/schema";

export default function Events() {
  const { t } = useLanguage();
  
  const eventTypes = [
    { value: "all", label: t('events.types.all') },
    { value: "seminar", label: t('events.types.seminars') },
    { value: "defense", label: t('events.types.defenses') },
    { value: "workshop", label: t('events.types.workshops') },
    { value: "meetup", label: t('events.types.meetups') },
  ];

  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"upcoming" | "all">("upcoming");

  const filters: any = {};
  if (selectedType !== "all") filters.type = selectedType;
  if (viewMode === "upcoming") filters.upcoming = true;

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", filters],
  });

  const filteredEvents = events?.filter(event => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
    );
  });

  const upcomingEvents = filteredEvents?.filter(event => 
    new Date(event.startDate) >= new Date()
  );

  const eventsToShow = viewMode === "upcoming" ? upcomingEvents : filteredEvents;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair" data-testid="page-title">
              {t('events.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('events.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card data-testid="stat-upcoming">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {upcomingEvents?.length || 0}
                </div>
                <p className="text-slate-600 dark:text-slate-400">{t('events.upcoming')}</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-month">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {upcomingEvents?.filter(event => {
                    const eventDate = new Date(event.startDate);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-types">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-accent-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {new Set(events?.map(event => event.type)).size || 0}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Types d'événements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Filtres:</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("upcoming")}
                  data-testid="view-upcoming"
                >
                  À venir
                </Button>
                <Button
                  variant={viewMode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("all")}
                  data-testid="view-all"
                >
                  Tous
                </Button>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48" data-testid="type-filter">
                  <SelectValue placeholder="Type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      data-testid={`type-option-${type.value}`}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedType !== "all" || searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Filtres actifs:</span>
              {selectedType !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setSelectedType("all")}
                  data-testid={`active-filter-type-${selectedType}`}
                >
                  {eventTypes.find(t => t.value === selectedType)?.label} ×
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
                  setSelectedType("all");
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

      {/* Events List */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-32"></div>
              ))}
            </div>
          ) : eventsToShow && eventsToShow.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <p className="text-slate-600 dark:text-slate-400" data-testid="results-count">
                  {eventsToShow.length} événement{eventsToShow.length > 1 ? 's' : ''} 
                  {viewMode === "upcoming" ? " à venir" : ""} trouvé{eventsToShow.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-grid">
                {eventsToShow
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16" data-testid="no-results">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {viewMode === "upcoming" 
                  ? "Aucun événement prévu pour le moment. Revenez bientôt !" 
                  : "Essayez de modifier vos critères de recherche."
                }
              </p>
              {viewMode !== "upcoming" && (
                <Button
                  onClick={() => {
                    setSelectedType("all");
                    setSearchQuery("");
                    setViewMode("upcoming");
                  }}
                  data-testid="reset-filters-btn"
                >
                  Voir les événements à venir
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
