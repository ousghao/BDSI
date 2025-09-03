import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProjectCard } from "@/components/ProjectCard";
import { NewsCard } from "@/components/NewsCard";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Project, News, Event } from "@shared/schema";

export default function Home() {
  const { t } = useLanguage();
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
                & {t('landing.hero.title').split('& ')[1]}
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/program">
                  <Button 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
                    data-testid="discover-program-btn"
                  >
                    {t('landing.hero.discoverProgram')}
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-900 transition-all duration-300 px-8 py-4 text-lg h-auto"
                    data-testid="view-projects-btn"
                  >
                    {t('landing.hero.viewProjects')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0">
              <Card className="bg-white/10 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Particles d'arrière-plan */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Particules flottantes */}
                    <div className="absolute top-10 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-20 right-12 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
                    <div className="absolute bottom-16 left-16 w-3 h-3 bg-accent-400 rounded-full animate-bounce opacity-50"></div>
                    <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-32 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6 text-white text-center bg-gradient-to-r from-accent-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                    {t('landing.hero.techTitle')}
                  </h3>
                  
                  {/* Système solaire technologique amélioré */}
                  <div className="relative h-64 w-64 mx-auto">
                    {/* Étoiles de fond */}
                    <div className="absolute inset-0">
                      <div className="absolute top-4 left-12 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                      <div className="absolute top-16 right-8 w-0.5 h-0.5 bg-blue-200 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute bottom-12 left-8 w-1 h-1 bg-purple-200 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
                      <div className="absolute bottom-8 right-16 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
                    </div>
                    
                    {/* Centre - Soleil AI/ML avec pulsation */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        {/* Aura externe */}
                        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-accent-400 to-orange-500 rounded-full animate-pulse opacity-30 blur-sm"></div>
                        {/* Corps principal */}
                        <div className="relative w-16 h-16 bg-gradient-to-br from-accent-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
                          <span className="text-white font-bold text-base z-10">🧠</span>
                          {/* Rayons */}
                          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                            <div className="absolute top-0 left-1/2 w-0.5 h-5 bg-gradient-to-t from-transparent to-yellow-300 -translate-x-1/2 -translate-y-5"></div>
                            <div className="absolute bottom-0 left-1/2 w-0.5 h-5 bg-gradient-to-b from-transparent to-yellow-300 -translate-x-1/2 translate-y-5"></div>
                            <div className="absolute right-0 top-1/2 h-0.5 w-5 bg-gradient-to-r from-transparent to-yellow-300 translate-x-5 -translate-y-1/2"></div>
                            <div className="absolute left-0 top-1/2 h-0.5 w-5 bg-gradient-to-l from-transparent to-yellow-300 -translate-x-5 -translate-y-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Orbite 1 - Planètes principales */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin shadow-lg" style={{ animationDuration: '25s' }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-xl transform hover:scale-125 transition-all duration-300 hover:rotate-12 cursor-pointer">
                            <span className="text-white text-sm z-10">🐍</span>
                            {/* Trail effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-ping"></div>
                          </div>
                          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-30">
                            Python Data Science
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 rounded-full flex items-center justify-center shadow-xl transform hover:scale-125 transition-all duration-300 hover:rotate-12 cursor-pointer">
                            <span className="text-white text-sm z-10">⚡</span>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                          </div>
                          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-30">
                            Apache Spark
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-full flex items-center justify-center shadow-xl transform hover:scale-125 transition-all duration-300 hover:rotate-12 cursor-pointer">
                            <span className="text-white text-sm z-10">🤖</span>
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-600 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
                          </div>
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-30">
                            Machine Learning
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl transform hover:scale-125 transition-all duration-300 hover:rotate-12 cursor-pointer">
                            <span className="text-white text-sm z-10">📊</span>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1.5s' }}></div>
                          </div>
                          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-30">
                            Big Data Analytics
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Orbite 2 - Satellites */}
                    <div className="absolute inset-8 border border-white/15 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
                            <span className="text-white text-sm">�</span>
                          </div>
                          <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap z-30">
                            Blockchain
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
                            <span className="text-white text-sm">☁️</span>
                          </div>
                          <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap z-30">
                            Cloud Computing
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
                            <span className="text-white text-sm">🌐</span>
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap z-30">
                            IoT & Edge
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                        <div className="relative group">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
                            <span className="text-white text-sm">🧮</span>
                          </div>
                          <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-1 py-0.5 whitespace-nowrap z-30">
                            Deep Learning
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Orbite 3 - Micro satellites */}
                    <div className="absolute inset-16 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '12s' }}>
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-bounce"></div>
                      </div>
                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Légendes avec animations */}
                  <div className="mt-12 grid grid-cols-2 gap-6 text-center relative z-10">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-accent-400 font-bold text-lg group-hover:text-accent-300 transition-colors">🐍 Python & Spark</div>
                      <div className="text-blue-100 text-sm mt-1 group-hover:text-white transition-colors">Big Data Processing</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full animate-pulse" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.1s' }}>
                      <div className="text-accent-400 font-bold text-lg group-hover:text-accent-300 transition-colors">🧠 Deep Learning</div>
                      <div className="text-blue-100 text-sm mt-1 group-hover:text-white transition-colors">Neural Networks</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full animate-pulse" style={{ width: '88%', animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.2s' }}>
                      <div className="text-accent-400 font-bold text-lg group-hover:text-accent-300 transition-colors">📊 Data Mining</div>
                      <div className="text-blue-100 text-sm mt-1 group-hover:text-white transition-colors">Pattern Discovery</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-green-400 to-teal-500 h-1 rounded-full animate-pulse" style={{ width: '92%', animationDelay: '1s' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.3s' }}>
                      <div className="text-accent-400 font-bold text-lg group-hover:text-accent-300 transition-colors">☁️ Cloud & IoT</div>
                      <div className="text-blue-100 text-sm mt-1 group-hover:text-white transition-colors">Scalable Solutions</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full animate-pulse" style={{ width: '90%', animationDelay: '1.5s' }}></div>
                      </div>
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
              {t('home.featuredProjects')}
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
                {t('home.viewAllProjects')}
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('home.latestNews')}</h3>
                <Link href="/news">
                  <Button variant="ghost" className="text-primary-600 dark:text-primary-400">
                    {t('home.viewAllNews')} <ArrowRight className="ml-2 h-4 w-4" />
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
                {t('home.upcomingEvents')}
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
                    {t('home.viewAllEvents')}
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
