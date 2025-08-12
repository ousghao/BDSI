import { Layout } from "@/components/Layout";
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
            <div className="animate-fade-in">
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
            
            <div className="mt-12 lg:mt-0 animate-slide-up">
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

      {/* Program Overview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                Un Programme d'Excellence
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Notre master combine théorie avancée et pratique intensive pour former les futurs experts en Big Data et systèmes intelligents.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3" data-testid="feature-ai">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Intelligence Artificielle</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Machine Learning, Deep Learning, Vision par ordinateur</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-bigdata">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                    <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Big Data</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Hadoop, Spark, NoSQL, Streaming temps réel</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-nlp">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Traitement du Langage</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">NLP, Analyse textuelle, Chatbots</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3" data-testid="feature-systems">
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                    <Cpu className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Systèmes Intelligents</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">IoT, Systèmes embarqués, Edge Computing</p>
                  </div>
                </div>
              </div>

              <Link href="/program">
                <Button 
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                  data-testid="detailed-program-btn"
                >
                  Programme détaillé <ArrowRight className="ml-2 h-4 w-4" />
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
                      <h4 className="font-semibold text-slate-900 dark:text-white">Formation Accréditée</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Master professionnel reconnu</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400" data-testid="program-duration">4 Semestres</div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">120 ECTS • Stage en entreprise</p>
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
            Prêt à Façonner l'Avenir ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Rejoignez notre communauté d'étudiants passionnés et devenez les leaders de demain en Big Data et systèmes intelligents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/admissions">
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
                data-testid="apply-now-btn"
              >
                <GraduationCap className="mr-3 h-5 w-5" />
                Postuler Maintenant
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 text-lg h-auto"
                data-testid="contact-btn"
              >
                <Users className="mr-3 h-5 w-5" />
                Prendre Rendez-vous
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4" data-testid="next-session">Prochaine rentrée: Septembre 2024</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center" data-testid="deadline-info">
                <i className="fas fa-calendar-check mr-2 text-accent-400"></i>
                <span>Date limite candidatures: 30 Juin</span>
              </div>
              <div className="flex items-center" data-testid="places-info">
                <i className="fas fa-users mr-2 text-accent-400"></i>
                <span>Places limitées: 30 étudiants</span>
              </div>
              <div className="flex items-center" data-testid="requirements-info">
                <i className="fas fa-graduation-cap mr-2 text-accent-400"></i>
                <span>Niveau requis: Licence ou équivalent</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
