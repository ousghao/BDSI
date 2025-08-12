import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  Home,
  BookOpen,
  FileText,
  Calendar,
  Users,
  Mail,
  Award,
  Building,
  GraduationCap
} from "lucide-react";

interface PageSettings {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
  description: string;
  category: 'main' | 'content' | 'info';
}

export function PageToggle() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [pages, setPages] = useState<PageSettings[]>([
    // Main pages
    {
      id: 'home',
      name: 'Accueil',
      path: '/',
      icon: <Home className="h-4 w-4" />,
      isActive: true,
      description: 'Page principale du site',
      category: 'main'
    },
    {
      id: 'program',
      name: 'Programme',
      path: '/program',
      icon: <BookOpen className="h-4 w-4" />,
      isActive: true,
      description: 'Présentation du programme d\'études',
      category: 'main'
    },
    {
      id: 'admissions',
      name: 'Admissions',
      path: '/admissions',
      icon: <GraduationCap className="h-4 w-4" />,
      isActive: true,
      description: 'Informations sur les candidatures',
      category: 'main'
    },
    
    // Content pages
    {
      id: 'projects',
      name: 'Projets',
      path: '/projects',
      icon: <FileText className="h-4 w-4" />,
      isActive: true,
      description: 'Galerie des projets étudiants',
      category: 'content'
    },
    {
      id: 'news',
      name: 'Actualités',
      path: '/news',
      icon: <FileText className="h-4 w-4" />,
      isActive: true,
      description: 'Articles et communiqués',
      category: 'content'
    },
    {
      id: 'events',
      name: 'Événements',
      path: '/events',
      icon: <Calendar className="h-4 w-4" />,
      isActive: true,
      description: 'Calendrier des événements',
      category: 'content'
    },
    
    // Info pages
    {
      id: 'faculty',
      name: 'Équipe pédagogique',
      path: '/faculty',
      icon: <Users className="h-4 w-4" />,
      isActive: true,
      description: 'Présentation de l\'équipe',
      category: 'info'
    },
    {
      id: 'partnerships',
      name: 'Partenariats',
      path: '/partnerships',
      icon: <Building className="h-4 w-4" />,
      isActive: false,
      description: 'Nos partenaires entreprises et académiques',
      category: 'info'
    },
    {
      id: 'alumni',
      name: 'Alumni',
      path: '/alumni',
      icon: <Award className="h-4 w-4" />,
      isActive: false,
      description: 'Réseau des anciens étudiants',
      category: 'info'
    },
    {
      id: 'contact',
      name: 'Contact',
      path: '/contact',
      icon: <Mail className="h-4 w-4" />,
      isActive: true,
      description: 'Informations de contact',
      category: 'info'
    }
  ]);

  const togglePage = (pageId: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, isActive: !page.isActive }
        : page
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres des pages ont été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'main': return 'Pages principales';
      case 'content': return 'Contenu';
      case 'info': return 'Informations';
      default: return 'Autres';
    }
  };

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, PageSettings[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Activez ou désactivez les pages selon vos besoins. Les pages désactivées ne seront pas accessibles aux visiteurs.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary-600 hover:bg-primary-700"
          data-testid="save-page-settings"
        >
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </>
          )}
        </Button>
      </div>

      {Object.entries(groupedPages).map(([category, categoryPages]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {getCategoryName(category)}
          </h3>
          
          <div className="grid gap-4">
            {categoryPages.map((page) => (
              <Card key={page.id} className={`transition-all duration-200 ${
                !page.isActive ? 'opacity-60' : ''
              }`} data-testid={`page-toggle-${page.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {page.icon}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {page.name}
                            </h4>
                            <Badge 
                              variant={page.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {page.isActive ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Visible
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Masqué
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{page.path}</span>
                            <span>•</span>
                            <span>{page.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${page.id}`} className="sr-only">
                        Activer/désactiver {page.name}
                      </Label>
                      <Switch
                        id={`toggle-${page.id}`}
                        checked={page.isActive}
                        onCheckedChange={() => togglePage(page.id)}
                        data-testid={`switch-${page.id}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <Card className="bg-slate-50 dark:bg-slate-800" data-testid="page-summary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-600">
                  {pages.filter(p => p.isActive).length} pages actives
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeOff className="h-4 w-4 text-slate-500" />
                <span className="text-slate-500">
                  {pages.filter(p => !p.isActive).length} pages désactivées
                </span>
              </div>
            </div>
            <div className="text-slate-500">
              Total: {pages.length} pages
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
