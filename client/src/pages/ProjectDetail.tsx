import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  ExternalLink, 
  MapPin,
  Tag,
  BookOpen,
  Video,
  Download
} from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

const themeColors = {
  "IA/ML": "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300",
  "Data Engineering": "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
  "NLP": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  "Computer Vision": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "IoT": "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

export default function ProjectDetail() {
  const [, setLocation] = useLocation();
  const projectId = parseInt(window.location.pathname.split('/').pop() || '0');

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Project not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Projet non trouvé
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Le projet que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => setLocation('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const students = project.students ? JSON.parse(project.students) : [];
  const supervisors = project.supervisors ? JSON.parse(project.supervisors) : [];
  const keywords = project.keywords ? JSON.parse(project.keywords) : [];
  const awards = project.awards ? JSON.parse(project.awards) : [];
  const documents = project.documents ? JSON.parse(project.documents) : [];

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-4"
              onClick={() => setLocation('/projects')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={themeColors[project.theme as keyof typeof themeColors] || "bg-gray-100 text-gray-700"}
                >
                  {project.theme}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  {project.year}
                </Badge>
                {awards.length > 0 && (
                  <Badge className="bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300">
                    <Award className="mr-1 h-3 w-3" />
                    {awards[0]}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
                {project.title}
              </h1>
              
              {project.summary && (
                <p className="text-xl text-blue-100 leading-relaxed">
                  {project.summary}
                </p>
              )}
            </div>
            
            {project.imageUrl && (
              <div className="lg:col-span-1">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {project.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Methodology */}
              {project.methodology && (
                <Card>
                  <CardHeader>
                    <CardTitle>Méthodologie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.methodology}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {project.results && (
                <Card>
                  <CardHeader>
                    <CardTitle>Résultats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.results}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video */}
              {project.videoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Présentation vidéo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video">
                      <iframe
                        src={project.videoUrl}
                        title={project.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team */}
              {(students.length > 0 || supervisors.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {students.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Étudiants</h4>
                        <div className="space-y-1">
                          {students.map((student: string, index: number) => (
                            <p key={index} className="text-sm text-slate-600 dark:text-slate-400">
                              {student}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {supervisors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Encadrants</h4>
                        <div className="space-y-1">
                          {supervisors.map((supervisor: string, index: number) => (
                            <p key={index} className="text-sm text-slate-600 dark:text-slate-400">
                              {supervisor}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Keywords */}
              {keywords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Mots-clés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Awards */}
              {awards.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Distinctions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {awards.map((award: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Award className="h-4 w-4 text-accent-500" />
                          {award}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {documents.map((doc: string, index: number) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Document {index + 1}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Année:</span>
                    <span className="font-medium">{project.year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Thème:</span>
                    <span className="font-medium">{project.theme}</span>
                  </div>
                  
                  {project.isFeatured && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-accent-500" />
                      <span className="text-accent-600 dark:text-accent-400 font-medium">
                        Projet mis en avant
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
