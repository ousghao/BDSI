import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProjectCard } from "@/components/ProjectCard";
import { NewsCard } from "@/components/NewsCard";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Project, News, Event } from "@shared/schema";

export default function Home() {
  const { data: featuredProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", { featured: true }],
  });

  const { data: latestNews, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ["/api/news", { featured: true }],
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { upcoming: true }],
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/80 dark:from-slate-900/90 dark:to-slate-700/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-playfair">
                Master <span className="text-accent-400">Big Data</span><br />
                & Systèmes Intelligents
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Formez-vous aux technologies d'avenir et devenez expert en intelligence artificielle et analyse de données massives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/program">
                  <Button 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
                    data-testid="discover-program-btn"
                  >
                    Découvrir le Programme
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 text-lg h-auto"
                    data-testid="view-projects-btn"
                  >
                    Voir les Projets
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">Chiffres Clés</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center" data-testid="stat-insertion">
                      <div className="text-3xl font-bold text-accent-400">95%</div>
                      <div className="text-blue-100">Taux d'insertion</div>
                    </div>
                    <div className="text-center" data-testid="stat-projects">
                      <div className="text-3xl font-bold text-accent-400">50+</div>
                      <div className="text-blue-100">Projets réalisés</div>
                    </div>
                    <div className="text-center" data-testid="stat-partners">
                      <div className="text-3xl font-bold text-accent-400">25+</div>
                      <div className="text-blue-100">Partenaires</div>
                    </div>
                    <div className="text-center" data-testid="stat-publications">
                      <div className="text-3xl font-bold text-accent-400">12</div>
                      <div className="text-blue-100">Publications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">
              Projets Vedettes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Découvrez les innovations développées par nos étudiants et leurs impacts concrets
            </p>
          </div>

          {projectsLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-2xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8" data-testid="featured-projects">
              {featuredProjects?.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4"
                data-testid="view-all-projects-btn"
              >
                <TrendingUp className="mr-3 h-5 w-5" />
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">
              Actualités & Événements
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Restez informé de la vie du master et des opportunités
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* News Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Dernières Actualités</h3>
                <Link href="/news">
                  <Button variant="ghost" className="text-primary-600 dark:text-primary-400">
                    Voir toutes <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {newsLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                        <div className="bg-slate-200 dark:bg-slate-700 h-32 rounded-xl"></div>
                        <div className="lg:col-span-2 mt-4 lg:mt-0 space-y-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8" data-testid="latest-news">
                  {latestNews?.slice(0, 3).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Events Sidebar */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 mt-16 lg:mt-0">
                Prochains Événements
              </h3>
              
              {eventsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-24"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6" data-testid="upcoming-events">
                  {upcomingEvents?.slice(0, 3).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}

              <div className="mt-8">
                <Link href="/events">
                  <Button 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    data-testid="view-calendar-btn"
                  >
                    Voir le calendrier complet
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
