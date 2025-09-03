import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(500),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description: z.string().min(1, "La description est requise").max(2000),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  summary: z.string().optional(),
  summary_en: z.string().optional(),
  summary_ar: z.string().optional(),
  methodology: z.string().optional(),
  methodology_en: z.string().optional(),
  methodology_ar: z.string().optional(),
  results: z.string().optional(),
  results_en: z.string().optional(),
  results_ar: z.string().optional(),
  theme: z.enum(['IA/ML', 'Data Engineering', 'NLP', 'Computer Vision', 'IoT']),
  year: z.number().min(2020).max(2030),
  students: z.string().optional(),
  supervisors: z.string().optional(),
  keywords: z.string().optional(),
  awards: z.string().optional(),
  documents: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false)
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface DropdownData {
  users: Array<{ id: string; name: string; email: string }>;
  faculty: Array<{ id: string; name: string; title: string }>;
  themes: string[];
}

interface ProjectFormProps {
  onClose?: () => void;
}

export function ProjectForm({ onClose }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      year: new Date().getFullYear()
    }
  });

  useEffect(() => {
    // Fetch dropdown data
    fetch('/api/admin/dropdowns')
      .then(res => res.json())
      .then(data => setDropdownData(data))
      .catch(err => {
        console.error('Failed to fetch dropdown data:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de référence",
          variant: "destructive"
        });
      });
  }, [toast]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await response.json();

      if (result.ok) {
        toast({
          title: "Succès",
          description: `Projet "${data.title}" créé avec succès!`,
        });
        reset();
        onClose?.();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de la création du projet",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addArrayItem = (field: keyof ProjectFormData, value: string) => {
    const currentValue = watch(field) as string || '';
    const newValue = currentValue ? `${currentValue}, ${value}` : value;
    setValue(field, newValue);
  };

  const removeArrayItem = (field: keyof ProjectFormData, index: number) => {
    const currentValue = watch(field) as string || '';
    const items = currentValue.split(',').map(item => item.trim());
    items.splice(index, 1);
    setValue(field, items.join(', '));
  };

  if (!dropdownData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Nouveau Projet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Titre du projet en français"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Thème *</Label>
              <Select onValueChange={(value) => setValue('theme', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un thème" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownData.themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.theme && (
                <p className="text-sm text-red-500">{errors.theme.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Année *</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                min={2020}
                max={2030}
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                {...register('image_url')}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              {errors.image_url && (
                <p className="text-sm text-red-500">{errors.image_url.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description détaillée du projet"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Résumé</Label>
            <Textarea
              id="summary"
              {...register('summary')}
              placeholder="Résumé court du projet"
              rows={3}
            />
          </div>

          {/* Arrays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Étudiants</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de l'étudiant"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addArrayItem('students', input.value.trim());
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Nom de l\'étudiant"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      addArrayItem('students', input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(watch('students') || '').split(',').map((item, index) => (
                  item.trim() && (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <span>{item.trim()}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('students', index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mots-clés</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Mot-clé"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addArrayItem('keywords', input.value.trim());
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Mot-clé"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      addArrayItem('keywords', input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(watch('keywords') || '').split(',').map((item, index) => (
                  item.trim() && (
                    <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">
                      <span>{item.trim()}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('keywords', index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={watch('is_featured')}
                onCheckedChange={(checked) => setValue('is_featured', checked as boolean)}
              />
              <Label htmlFor="is_featured">Mis en avant</Label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le projet'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
