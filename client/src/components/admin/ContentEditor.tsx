import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { 
  Save,
  X,
  Calendar,
  Tag,
  Globe,
  Eye,
  EyeOff,
  Star,
  Image as ImageIcon
} from "lucide-react";
import type { Project, News, Event, Course, Faculty } from "@shared/schema";

interface ContentEditorProps {
  item: any;
  type: 'project' | 'news' | 'event' | 'course' | 'faculty';
  onClose: () => void;
}

export function ContentEditor({ item, type, onClose }: ContentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Initialize form data based on type and item
    if (item) {
      setFormData(item);
    } else {
      // Default values for new items
      switch (type) {
        case 'project':
          setFormData({
            title: '',
            description: '',
            theme: 'IA/ML',
            year: new Date().getFullYear(),
            students: '[]',
            supervisors: '[]',
            keywords: '[]',
            awards: '[]',
            isActive: true,
            isFeatured: false,
          });
          break;
        case 'news':
          setFormData({
            title: '',
            summary: '',
            content: '',
            category: 'announcement',
            isActive: true,
            isFeatured: false,
          });
          break;
        case 'event':
          setFormData({
            title: '',
            description: '',
            type: 'seminar',
            location: '',
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
            speakers: '[]',
            isActive: true,
          });
          break;
        case 'course':
          setFormData({
            title: '',
            description: '',
            semester: 1,
            credits: 3,
            objectives: '',
            prerequisites: '',
            evaluation: '',
            resources: '',
            isActive: true,
          });
          break;
        case 'faculty':
          setFormData({
            name: '',
            title: '',
            specialization: '',
            bio: '',
            research: '',
            email: '',
            phone: '',
            order: 0,
            isActive: true,
          });
          break;
      }
    }
  }, [item, type]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = item 
        ? `/api/admin/${type}s/${item.id}`
        : `/api/admin/${type}s`;
      const method = item ? 'PUT' : 'POST';
      
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      toast({
        title: item ? "Contenu mis à jour" : "Contenu créé",
        description: `${type === 'project' ? 'Le projet' : 
                      type === 'news' ? 'L\'actualité' :
                      type === 'event' ? 'L\'événement' :
                      type === 'course' ? 'Le cours' :
                      'Le membre'} a été ${item ? 'mis à jour' : 'créé'} avec succès.`,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Convert string arrays to JSON for projects
      if (type === 'project') {
        const processedData = { ...formData };
        if (typeof processedData.students === 'string') {
          processedData.students = JSON.stringify(processedData.students.split(',').map(s => s.trim()).filter(Boolean));
        }
        if (typeof processedData.supervisors === 'string') {
          processedData.supervisors = JSON.stringify(processedData.supervisors.split(',').map(s => s.trim()).filter(Boolean));
        }
        if (typeof processedData.keywords === 'string') {
          processedData.keywords = JSON.stringify(processedData.keywords.split(',').map(s => s.trim()).filter(Boolean));
        }
        if (typeof processedData.awards === 'string') {
          processedData.awards = JSON.stringify(processedData.awards.split(',').map(s => s.trim()).filter(Boolean));
        }
        mutation.mutate(processedData);
      } else if (type === 'event') {
        const processedData = { ...formData };
        if (typeof processedData.speakers === 'string') {
          processedData.speakers = JSON.stringify(processedData.speakers.split(',').map(s => s.trim()).filter(Boolean));
        }
        mutation.mutate(processedData);
      } else {
        mutation.mutate(formData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    const typeLabels = {
      project: 'projet',
      news: 'actualité',
      event: 'événement',
      course: 'cours',
      faculty: 'membre de l\'équipe'
    };
    return `${item ? 'Modifier' : 'Créer'} ${typeLabels[type]}`;
  };

  // Helper function to display array fields as comma-separated strings
  const getArrayAsString = (field: string) => {
    const value = formData[field];
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object' && value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch {
        return '';
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="editor-title">
              {getTitle()}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {item ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations pour créer le contenu'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              data-testid="cancel-button"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="save-button"
            >
              {isSaving ? (
                "Sauvegarde..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {item ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="meta">Métadonnées</TabsTrigger>
            <TabsTrigger value="multilang">Multilingue</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" data-testid="content-tab">
            <Card>
              <CardHeader>
                <CardTitle>Contenu principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Common fields */}
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Titre du contenu"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Description détaillée"
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>

                {/* Type-specific fields */}
                {type === 'project' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="theme">Thème</Label>
                        <Select value={formData.theme || ''} onValueChange={(value) => updateField('theme', value)}>
                          <SelectTrigger data-testid="select-theme">
                            <SelectValue placeholder="Sélectionner un thème" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IA/ML">IA/ML</SelectItem>
                            <SelectItem value="Data Engineering">Data Engineering</SelectItem>
                            <SelectItem value="NLP">NLP</SelectItem>
                            <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                            <SelectItem value="IoT">IoT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="year">Année</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.year || ''}
                          onChange={(e) => updateField('year', parseInt(e.target.value))}
                          data-testid="input-year"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="students">Étudiants (séparés par des virgules)</Label>
                      <Input
                        id="students"
                        value={getArrayAsString('students')}
                        onChange={(e) => updateField('students', e.target.value)}
                        placeholder="Nom Étudiant1, Nom Étudiant2"
                        data-testid="input-students"
                      />
                    </div>

                    <div>
                      <Label htmlFor="supervisors">Encadrants (séparés par des virgules)</Label>
                      <Input
                        id="supervisors"
                        value={getArrayAsString('supervisors')}
                        onChange={(e) => updateField('supervisors', e.target.value)}
                        placeholder="Prof. Nom1, Dr. Nom2"
                        data-testid="input-supervisors"
                      />
                    </div>

                    <div>
                      <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
                      <Input
                        id="keywords"
                        value={getArrayAsString('keywords')}
                        onChange={(e) => updateField('keywords', e.target.value)}
                        placeholder="machine learning, python, tensorflow"
                        data-testid="input-keywords"
                      />
                    </div>
                  </>
                )}

                {type === 'news' && (
                  <>
                    <div>
                      <Label htmlFor="summary">Résumé</Label>
                      <Textarea
                        id="summary"
                        value={formData.summary || ''}
                        onChange={(e) => updateField('summary', e.target.value)}
                        placeholder="Résumé court de l'actualité"
                        rows={2}
                        data-testid="textarea-summary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Contenu complet</Label>
                      <Textarea
                        id="content"
                        value={formData.content || ''}
                        onChange={(e) => updateField('content', e.target.value)}
                        placeholder="Contenu détaillé de l'actualité"
                        rows={8}
                        data-testid="textarea-content"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select value={formData.category || ''} onValueChange={(value) => updateField('category', value)}>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Événement</SelectItem>
                          <SelectItem value="research">Recherche</SelectItem>
                          <SelectItem value="success_story">Success Story</SelectItem>
                          <SelectItem value="announcement">Annonce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {type === 'event' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate || ''}
                          onChange={(e) => updateField('startDate', e.target.value)}
                          data-testid="input-start-date"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate || ''}
                          onChange={(e) => updateField('endDate', e.target.value)}
                          data-testid="input-end-date"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventType">Type</Label>
                        <Select value={formData.type || ''} onValueChange={(value) => updateField('type', value)}>
                          <SelectTrigger data-testid="select-event-type">
                            <SelectValue placeholder="Type d'événement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seminar">Séminaire</SelectItem>
                            <SelectItem value="defense">Soutenance</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="meetup">Meetup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Lieu</Label>
                        <Input
                          id="location"
                          value={formData.location || ''}
                          onChange={(e) => updateField('location', e.target.value)}
                          placeholder="Salle, bâtiment, campus"
                          data-testid="input-location"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="speakers">Intervenants (séparés par des virgules)</Label>
                      <Input
                        id="speakers"
                        value={getArrayAsString('speakers')}
                        onChange={(e) => updateField('speakers', e.target.value)}
                        placeholder="Dr. Nom1, Prof. Nom2"
                        data-testid="input-speakers"
                      />
                    </div>
                  </>
                )}

                {type === 'course' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="semester">Semestre</Label>
                        <Select value={formData.semester?.toString() || ''} onValueChange={(value) => updateField('semester', parseInt(value))}>
                          <SelectTrigger data-testid="select-semester">
                            <SelectValue placeholder="Semestre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Semestre 1</SelectItem>
                            <SelectItem value="2">Semestre 2</SelectItem>
                            <SelectItem value="3">Semestre 3</SelectItem>
                            <SelectItem value="4">Semestre 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="credits">Crédits ECTS</Label>
                        <Input
                          id="credits"
                          type="number"
                          value={formData.credits || ''}
                          onChange={(e) => updateField('credits', parseInt(e.target.value))}
                          data-testid="input-credits"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="objectives">Objectifs</Label>
                      <Textarea
                        id="objectives"
                        value={formData.objectives || ''}
                        onChange={(e) => updateField('objectives', e.target.value)}
                        rows={3}
                        data-testid="textarea-objectives"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prerequisites">Prérequis</Label>
                      <Textarea
                        id="prerequisites"
                        value={formData.prerequisites || ''}
                        onChange={(e) => updateField('prerequisites', e.target.value)}
                        rows={2}
                        data-testid="textarea-prerequisites"
                      />
                    </div>
                  </>
                )}

                {type === 'faculty' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="Dr. Prénom Nom"
                          data-testid="input-faculty-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="facultyTitle">Titre/Grade</Label>
                        <Input
                          id="facultyTitle"
                          value={formData.title || ''}
                          onChange={(e) => updateField('title', e.target.value)}
                          placeholder="Professeur, Maître de conférences..."
                          data-testid="input-faculty-title"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialization">Spécialisation</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization || ''}
                        onChange={(e) => updateField('specialization', e.target.value)}
                        placeholder="Intelligence Artificielle, Big Data..."
                        data-testid="input-specialization"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ''}
                        onChange={(e) => updateField('bio', e.target.value)}
                        rows={4}
                        data-testid="textarea-bio"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facultyEmail">Email</Label>
                        <Input
                          id="facultyEmail"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => updateField('email', e.target.value)}
                          data-testid="input-faculty-email"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="facultyPhone">Téléphone</Label>
                        <Input
                          id="facultyPhone"
                          value={formData.phone || ''}
                          onChange={(e) => updateField('phone', e.target.value)}
                          data-testid="input-faculty-phone"
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meta Tab */}
          <TabsContent value="meta" data-testid="meta-tab">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres et métadonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Contenu actif</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Le contenu sera visible sur le site public
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive || false}
                    onCheckedChange={(checked) => updateField('isActive', checked)}
                    data-testid="switch-active"
                  />
                </div>

                {(type === 'project' || type === 'news') && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isFeatured">Contenu vedette</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Le contenu sera mis en avant sur la page d'accueil
                      </p>
                    </div>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured || false}
                      onCheckedChange={(checked) => updateField('isFeatured', checked)}
                      data-testid="switch-featured"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                    data-testid="input-image-url"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Prévisualisation" 
                        className="w-32 h-32 object-cover rounded-lg"
                        data-testid="image-preview"
                      />
                    </div>
                  )}
                </div>

                {type === 'news' && (
                  <div>
                    <Label htmlFor="publishedAt">Date de publication</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateField('publishedAt', e.target.value)}
                      data-testid="input-published-at"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multilang Tab */}
          <TabsContent value="multilang" data-testid="multilang-tab">
            <Card>
              <CardHeader>
                <CardTitle>Contenu multilingue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Traduisez votre contenu en anglais et en arabe pour une portée internationale.
                </div>

                {/* English version */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Version anglaise
                  </h3>
                  
                  <div>
                    <Label htmlFor="titleEn">Titre (EN)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn || ''}
                      onChange={(e) => updateField('titleEn', e.target.value)}
                      placeholder="English title"
                      data-testid="input-title-en"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descriptionEn">Description (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn || ''}
                      onChange={(e) => updateField('descriptionEn', e.target.value)}
                      placeholder="English description"
                      rows={3}
                      data-testid="textarea-description-en"
                    />
                  </div>
                </div>

                {/* Arabic version */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Version arabe
                  </h3>
                  
                  <div>
                    <Label htmlFor="titleAr">العنوان (AR)</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr || ''}
                      onChange={(e) => updateField('titleAr', e.target.value)}
                      placeholder="العنوان بالعربية"
                      className="text-right"
                      dir="rtl"
                      data-testid="input-title-ar"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descriptionAr">الوصف (AR)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={formData.descriptionAr || ''}
                      onChange={(e) => updateField('descriptionAr', e.target.value)}
                      placeholder="الوصف بالعربية"
                      rows={3}
                      className="text-right"
                      dir="rtl"
                      data-testid="textarea-description-ar"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
