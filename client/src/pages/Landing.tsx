import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  GraduationCap, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight,
  Brain,
  Database,
  MessageSquare,
  Cpu
} from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();
  
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 font-playfair">
                Master <span className="text-accent-400">Big Data</span><br />
                & {t('landing.hero.title').split('& ')[1]}
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-6 leading-relaxed">
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
            
            <div className="mt-12 lg:mt-0 animate-slide-up">
              <Card className="bg-white/10 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Particles d'arrière-plan */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Particules flottantes */}
                    <div className="absolute top-10 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-20 right-12 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
                    <div className="absolute bottom-16 left-16 w-3 h-3 bg-accent-400 rounded-full animate-bounce opacity-50"></div>
                    <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-32 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-8 text-white text-center bg-gradient-to-r from-accent-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
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
                    <div className="absolute inset-12 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '12s' }}>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-bounce"></div>
                      </div>
                      <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Légendes avec animations */}
                  <div className="mt-6 grid grid-cols-2 gap-4 text-center relative z-10">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-accent-400 font-bold text-base group-hover:text-accent-300 transition-colors">🐍 Python & Spark</div>
                      <div className="text-blue-100 text-xs mt-1 group-hover:text-white transition-colors">Big Data Processing</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full animate-pulse" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.1s' }}>
                      <div className="text-accent-400 font-bold text-base group-hover:text-accent-300 transition-colors">🧠 Deep Learning</div>
                      <div className="text-blue-100 text-xs mt-1 group-hover:text-white transition-colors">Neural Networks</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full animate-pulse" style={{ width: '88%', animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.2s' }}>
                      <div className="text-accent-400 font-bold text-base group-hover:text-accent-300 transition-colors">📊 Data Mining</div>
                      <div className="text-blue-100 text-xs mt-1 group-hover:text-white transition-colors">Pattern Discovery</div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-green-400 to-teal-500 h-1 rounded-full animate-pulse" style={{ width: '92%', animationDelay: '1s' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 hover:bg-white/15 transition-all duration-300 group" style={{ animationDelay: '0.3s' }}>
                      <div className="text-accent-400 font-bold text-base group-hover:text-accent-300 transition-colors">☁️ Cloud & IoT</div>
                      <div className="text-blue-100 text-xs mt-1 group-hover:text-white transition-colors">Scalable Solutions</div>
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

      {/* Program Overview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                {t('landing.program.title')}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {t('landing.program.description')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3" data-testid="feature-ai">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{t('landing.features.ai.title')}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.features.ai.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-bigdata">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                    <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{t('landing.features.bigdata.title')}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.features.bigdata.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-nlp">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{t('landing.features.nlp.title')}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.features.nlp.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-systems">
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                    <Cpu className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{t('landing.features.systems.title')}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.features.systems.description')}</p>
                  </div>
                </div>
              </div>

              <Link href="/program">
                <Button 
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                  data-testid="detailed-program-btn"
                >
                  {t('landing.program.detailedProgram')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students collaborating in computer lab" 
                className="rounded-2xl shadow-xl"
                data-testid="program-image"
              />
              
              <Card className="relative -mt-16 ml-8 bg-white dark:bg-slate-700 max-w-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-accent-100 dark:bg-accent-900 p-2 rounded-lg">
                      <Award className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{t('landing.accredited.title')}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.accredited.subtitle')}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400" data-testid="program-duration">{t('landing.accredited.duration')}</div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{t('landing.accredited.details')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
            className="w-full h-full"
          ></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-playfair">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/admissions">
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
                data-testid="apply-now-btn"
              >
                <GraduationCap className="mr-3 h-5 w-5" />
                {t('landing.cta.applyNow')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-900 transition-all duration-300 px-8 py-4 text-lg h-auto"
                data-testid="contact-btn"
              >
                <Users className="mr-3 h-5 w-5" />
                {t('landing.cta.contactUs')}
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4" data-testid="next-session">{t('landing.info.nextSession')}</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center" data-testid="deadline-info">
                <i className="fas fa-calendar-check mr-2 text-accent-400"></i>
                <span>{t('landing.info.deadline')}</span>
              </div>
              <div className="flex items-center" data-testid="places-info">
                <i className="fas fa-users mr-2 text-accent-400"></i>
                <span>{t('landing.info.places')}</span>
              </div>
              <div className="flex items-center" data-testid="requirements-info">
                <i className="fas fa-graduation-cap mr-2 text-accent-400"></i>
                <span>{t('landing.info.requirements')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
