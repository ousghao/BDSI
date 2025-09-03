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
import { Loader2, Calendar } from 'lucide-react';

const newsSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(500),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  summary: z.string().min(1, "Le résumé est requis").max(1000),
  summary_en: z.string().optional(),
  summary_ar: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis").max(10000),
  content_en: z.string().optional(),
  content_ar: z.string().optional(),
  category: z.enum(['event', 'research', 'success_story', 'announcement']),
  image_url: z.string().url().optional().or(z.literal('')),
  author_id: z.string().uuid().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional()
});

type NewsFormData = z.infer<typeof newsSchema>;

interface DropdownData {
  users: Array<{ id: string; name: string; email: string }>;
  categories: string[];
}

interface NewsFormProps {
  onClose?: () => void;
}

export function NewsForm({ onClose }: NewsFormProps) {
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
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      published_at: new Date().toISOString().slice(0, 16),
      author_id: undefined,
      category: 'announcement',
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

  const onSubmit = async (data: NewsFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/news', {
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
          description: `Actualité "${data.title}" créée avec succès!`,
        });
        reset();
        onClose?.();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de la création de l'actualité",
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
        <CardTitle className="text-2xl font-bold">Nouvelle Actualité</CardTitle>
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
                placeholder="Titre de l'actualité en français"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value as any, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(dropdownData.categories) && dropdownData.categories.length > 0
                    ? dropdownData.categories.filter((category) => typeof category === 'string' && category.trim() !== '').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'event' && 'Événement'}
                          {category === 'research' && 'Recherche'}
                          {category === 'success_story' && 'Histoire de succès'}
                          {category === 'announcement' && 'Annonce'}
                        </SelectItem>
                      ))
                    : ['event', 'research', 'success_story', 'announcement'].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'event' && 'Événement'}
                          {category === 'research' && 'Recherche'}
                          {category === 'success_story' && 'Histoire de succès'}
                          {category === 'announcement' && 'Annonce'}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_at">Date de publication</Label>
              <div className="relative">
                <Input
                  id="published_at"
                  type="datetime-local"
                  {...register('published_at')}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
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

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Résumé *</Label>
            <Textarea
              id="summary"
              {...register('summary')}
              placeholder="Résumé court de l'actualité"
              rows={3}
            />
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Contenu détaillé de l'actualité"
              rows={8}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author_id">Auteur</Label>
            <Select
              value={watch('author_id') ?? 'none'}
              onValueChange={(value) => setValue('author_id', value === 'none' ? undefined : value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un auteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun auteur spécifique</SelectItem>
                {dropdownData.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                'Créer l\'actualité'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
