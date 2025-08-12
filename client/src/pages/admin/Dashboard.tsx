import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Users, 
  FileText, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import type { Project, News, Event, Course } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Accès non autorisé",
        description: "Vous devez être connecté en tant qu'administrateur.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: news } = useQuery<News[]>({
    queryKey: ["/api/news"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated && user?.role === 'admin',
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter(p => p.isActive)?.length || 0,
    totalNews: news?.length || 0,
    publishedNews: news?.filter(n => n.publishedAt)?.length || 0,
    totalEvents: events?.length || 0,
    upcomingEvents: events?.filter(e => new Date(e.startDate) > new Date())?.length || 0,
    totalCourses: courses?.length || 0,
    activeCourses: courses?.filter(c => c.isActive)?.length || 0,
  };

  const recentActivities = [
    ...((news?.slice(0, 3) || []).map(item => ({
      type: 'news' as const,
      title: item.title,
      date: item.createdAt,
      status: item.publishedAt ? 'published' : 'draft',
      id: item.id,
    }))),
    ...((events?.slice(0, 3) || []).map(item => ({
      type: 'event' as const,
      title: item.title,
      date: item.createdAt,
      status: new Date(item.startDate) > new Date() ? 'upcoming' : 'past',
      id: item.id,
    }))),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="dashboard-title">
              Tableau de bord administrateur
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Bienvenue, {user?.firstName || 'Administrateur'}. Gérez le contenu et les paramètres du site.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Link href="/admin/content?tab=projects">
              <Button className="w-full h-16 bg-primary-600 hover:bg-primary-700" data-testid="quick-add-project">
                <Plus className="mr-2 h-5 w-5" />
                Nouveau projet
              </Button>
            </Link>
            <Link href="/admin/content?tab=news">
              <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-700" data-testid="quick-add-news">
                <Plus className="mr-2 h-5 w-5" />
                Nouvelle actualité
              </Button>
            </Link>
            <Link href="/admin/content?tab=events">
              <Button className="w-full h-16 bg-accent-500 hover:bg-accent-600" data-testid="quick-add-event">
                <Plus className="mr-2 h-5 w-5" />
                Nouvel événement
              </Button>
            </Link>
            <Link href="/admin/media">
              <Button className="w-full h-16 bg-purple-600 hover:bg-purple-700" data-testid="quick-media">
                <Eye className="mr-2 h-5 w-5" />
                Médiathèque
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card data-testid="stat-projects">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeProjects} actifs
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-news">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actualités</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNews}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedNews} publiées
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-events">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.upcomingEvents} à venir
                </p>
              </CardContent>
            </Card>

            <Card data-testid="stat-courses">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCourses} actifs
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <Card data-testid="recent-activities">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {activity.type === 'news' ? (
                            <FileText className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Calendar className="h-4 w-4 text-green-600" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(activity.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={activity.status === 'published' || activity.status === 'upcoming' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status === 'published' ? 'Publié' :
                           activity.status === 'upcoming' ? 'À venir' :
                           activity.status === 'draft' ? 'Brouillon' : 'Passé'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                      Aucune activité récente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card data-testid="quick-links">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/content">
                    <Button variant="outline" className="w-full justify-start" data-testid="link-content">
                      <Edit className="mr-2 h-4 w-4" />
                      Gérer le contenu
                    </Button>
                  </Link>
                  
                  <Link href="/admin/media">
                    <Button variant="outline" className="w-full justify-start" data-testid="link-media">
                      <Eye className="mr-2 h-4 w-4" />
                      Médiathèque
                    </Button>
                  </Link>
                  
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full justify-start" data-testid="link-settings">
                      <Users className="mr-2 h-4 w-4" />
                      Paramètres
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start" data-testid="link-public">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir le site public
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
