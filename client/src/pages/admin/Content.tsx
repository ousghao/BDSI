import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { PageToggle } from "@/components/admin/PageToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  BookOpen,
  Users as UsersIcon
} from "lucide-react";
import type { Project, News, Event, Course, Faculty } from "@shared/schema";

export default function Content() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>("");

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

  const { data: faculty } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
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

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setEditingType(type);
  };

  const handleCloseEditor = () => {
    setEditingItem(null);
    setEditingType("");
  };

  const filterData = (data: any[], searchQuery: string) => {
    if (!searchQuery) return data;
    return data.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredProjects = filterData(projects || [], searchQuery);
  const filteredNews = filterData(news || [], searchQuery);
  const filteredEvents = filterData(events || [], searchQuery);
  const filteredCourses = filterData(courses || [], searchQuery);
  const filteredFaculty = filterData(faculty || [], searchQuery);

  if (editingItem) {
    return (
      <Layout>
        <ContentEditor
          item={editingItem}
          type={editingType}
          onClose={handleCloseEditor}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="content-title">
              Gestion du contenu
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Créez, modifiez et gérez tout le contenu du site
            </p>
          </div>

          {/* Page Controls */}
          <Card className="mb-8" data-testid="page-controls">
            <CardHeader>
              <CardTitle>Contrôles des pages</CardTitle>
            </CardHeader>
            <CardContent>
              <PageToggle />
            </CardContent>
          </Card>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher du contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-content"
              />
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="content-tabs">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Projets
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Actualités
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Événements
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Cours
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center">
                <UsersIcon className="mr-2 h-4 w-4" />
                Équipe
              </TabsTrigger>
            </TabsList>

            {/* Projects */}
            <TabsContent value="projects" data-testid="projects-content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projets ({filteredProjects.length})</CardTitle>
                  <Button 
                    onClick={() => handleEdit(null, 'project')}
                    data-testid="add-project"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau projet
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div 
                        key={project.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        data-testid={`project-item-${project.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{project.title}</h3>
                            <Badge variant={project.isActive ? "default" : "secondary"}>
                              {project.isActive ? "Actif" : "Inactif"}
                            </Badge>
                            {project.isFeatured && (
                              <Badge variant="outline">Vedette</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {project.theme} • {project.year}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project, 'project')}
                            data-testid={`edit-project-${project.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-project-${project.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredProjects.length === 0 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Aucun projet trouvé
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News */}
            <TabsContent value="news" data-testid="news-content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Actualités ({filteredNews.length})</CardTitle>
                  <Button 
                    onClick={() => handleEdit(null, 'news')}
                    data-testid="add-news"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle actualité
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredNews.map((article) => (
                      <div 
                        key={article.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        data-testid={`news-item-${article.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{article.title}</h3>
                            <Badge variant={article.isActive ? "default" : "secondary"}>
                              {article.isActive ? "Actif" : "Inactif"}
                            </Badge>
                            {article.isFeatured && (
                              <Badge variant="outline">Vedette</Badge>
                            )}
                            <Badge variant="secondary">{article.category}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {article.publishedAt ? 
                              `Publié le ${new Date(article.publishedAt).toLocaleDateString('fr-FR')}` :
                              "Brouillon"
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(article, 'news')}
                            data-testid={`edit-news-${article.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-news-${article.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredNews.length === 0 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Aucune actualité trouvée
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events */}
            <TabsContent value="events" data-testid="events-content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Événements ({filteredEvents.length})</CardTitle>
                  <Button 
                    onClick={() => handleEdit(null, 'event')}
                    data-testid="add-event"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel événement
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        data-testid={`event-item-${event.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant={event.isActive ? "default" : "secondary"}>
                              {event.isActive ? "Actif" : "Inactif"}
                            </Badge>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {new Date(event.startDate).toLocaleDateString('fr-FR')} • {event.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event, 'event')}
                            data-testid={`edit-event-${event.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-event-${event.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredEvents.length === 0 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Aucun événement trouvé
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses */}
            <TabsContent value="courses" data-testid="courses-content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Cours ({filteredCourses.length})</CardTitle>
                  <Button 
                    onClick={() => handleEdit(null, 'course')}
                    data-testid="add-course"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau cours
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <div 
                        key={course.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        data-testid={`course-item-${course.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{course.title}</h3>
                            <Badge variant={course.isActive ? "default" : "secondary"}>
                              {course.isActive ? "Actif" : "Inactif"}
                            </Badge>
                            <Badge variant="outline">{course.credits} ECTS</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Semestre {course.semester}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(course, 'course')}
                            data-testid={`edit-course-${course.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-course-${course.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredCourses.length === 0 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Aucun cours trouvé
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Faculty */}
            <TabsContent value="faculty" data-testid="faculty-content">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Équipe pédagogique ({filteredFaculty.length})</CardTitle>
                  <Button 
                    onClick={() => handleEdit(null, 'faculty')}
                    data-testid="add-faculty"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau membre
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredFaculty.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        data-testid={`faculty-item-${member.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          {member.profileImageUrl && (
                            <img 
                              src={member.profileImageUrl} 
                              alt={member.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-medium">{member.name}</h3>
                              <Badge variant={member.isActive ? "default" : "secondary"}>
                                {member.isActive ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {member.title} • {member.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(member, 'faculty')}
                            data-testid={`edit-faculty-${member.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-faculty-${member.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredFaculty.length === 0 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Aucun membre trouvé
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
