import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout/Layout";
import { FacultyCard } from "@/components/FacultyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, Users, Award, BookOpen } from "lucide-react";
import type { Faculty } from "@shared/schema";

export default function Faculty() {
  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  // Group faculty by specialization
  const facultyBySpecialization = faculty?.reduce((acc, member) => {
    const specialization = member.specialization || "Autre";
    if (!acc[specialization]) {
      acc[specialization] = [];
    }
    acc[specialization].push(member);
    return acc;
  }, {} as Record<string, Faculty[]>);

  const specializations = facultyBySpecialization ? Object.keys(facultyBySpecialization) : [];

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair" data-testid="page-title">
              Équipe Pédagogique
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Apprenez auprès d'experts reconnus dans leurs domaines et bénéficiez de leur expérience 
              en recherche et en industrie
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card data-testid="stat-faculty">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {faculty?.length || 0}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Enseignants-chercheurs</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-specializations">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {specializations.length}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Domaines d'expertise</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-experience">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-accent-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  15+
                </div>
                <p className="text-slate-600 dark:text-slate-400">Années d'expérience moyenne</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Faculty by Specialization */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 w-32 h-32 rounded-full mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : faculty && faculty.length > 0 ? (
            <div className="space-y-16">
              {specializations.map((specialization) => (
                <div key={specialization} data-testid={`specialization-${specialization.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">
                      {specialization}
                    </h2>
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="text-sm">
                        {facultyBySpecialization![specialization].length} expert{facultyBySpecialization![specialization].length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {facultyBySpecialization![specialization]
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((member) => (
                        <FacultyCard key={member.id} member={member} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="no-faculty">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Équipe en cours de mise à jour
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Les informations de l'équipe pédagogique seront bientôt disponibles.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
            Nous Contacter
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Vous souhaitez échanger avec un membre de notre équipe pédagogique ?
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center" data-testid="contact-email">
              <Mail className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email</h3>
              <p className="text-slate-600 dark:text-slate-400">master.bdsi@usmba.ac.ma</p>
            </div>
            
            <div className="flex flex-col items-center" data-testid="contact-phone">
              <Phone className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Téléphone</h3>
              <p className="text-slate-600 dark:text-slate-400">+212 5 35 60 XX XX</p>
            </div>
            
            <div className="flex flex-col items-center" data-testid="contact-website">
              <Globe className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Site web</h3>
              <p className="text-slate-600 dark:text-slate-400">www.fsdm.ac.ma</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
