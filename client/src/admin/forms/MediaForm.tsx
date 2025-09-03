import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText, Image, Video, Music, File } from 'lucide-react';

const mediaSchema = z.object({
  filename: z.string().min(1, "Le nom du fichier est requis"),
  original_name: z.string().min(1, "Le nom original est requis"),
  mime_type: z.string().min(1, "Le type MIME est requis"),
  size: z.number().min(1, "La taille doit être supérieure à 0"),
  url: z.string().url("L'URL doit être valide"),
  alt_text: z.string().optional(),
  category: z.enum(['image', 'document', 'video', 'audio']).default('image'),
  tags: z.string().optional(),
  uploaded_by: z.string().uuid().optional()
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface DropdownData {
  users: Array<{ id: string; name: string; email: string }>;
  categories?: string[];
}

interface MediaFormProps {
  onClose?: () => void;
}

export function MediaForm({ onClose }: MediaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      category: 'image'
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Auto-fill form fields
      setValue('filename', file.name);
      setValue('original_name', file.name);
      setValue('mime_type', file.type);
      setValue('size', file.size);

      // Auto-detect category based on MIME type
      if (file.type.startsWith('image/')) {
        setValue('category', 'image');
      } else if (file.type.startsWith('video/')) {
        setValue('category', 'video');
      } else if (file.type.startsWith('audio/')) {
        setValue('category', 'audio');
      } else {
        setValue('category', 'document');
      }
    }
  };

  const onSubmit = async (data: MediaFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/media', {
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
          description: `Média "${data.filename}" créé avec succès!`,
        });
        reset();
        setFileInfo(null);
        onClose?.();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de la création du média",
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

  const addTag = () => {
    const input = document.querySelector('input[placeholder="Ajouter un tag"]') as HTMLInputElement;
    if (input?.value.trim()) {
      const currentTags = watch('tags') || '';
      const newTags = currentTags ? `${currentTags}, ${input.value.trim()}` : input.value.trim();
      setValue('tags', newTags);
      input.value = '';
    }
  };

  const removeTag = (index: number) => {
    const currentTags = watch('tags') || '';
    const tags = currentTags.split(',').map(t => t.trim());
    tags.splice(index, 1);
    setValue('tags', tags.join(', '));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
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
        <CardTitle className="text-2xl font-bold">Médiathèque - Nouveau Média</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Fichier *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Cliquez pour sélectionner un fichier ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">
                  Images, vidéos, audio, documents (PDF, DOC, TXT)
                </p>
              </label>
            </div>
            {fileInfo && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(watch('category'))}
                  <span className="font-medium">{fileInfo.name}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Taille: {(fileInfo.size / 1024 / 1024).toFixed(2)} MB | 
                  Type: {fileInfo.type}
                </p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="filename">Nom du fichier *</Label>
              <Input
                id="filename"
                {...register('filename')}
                placeholder="Nom du fichier"
              />
              {errors.filename && (
                <p className="text-sm text-red-500">{errors.filename.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(dropdownData?.categories) && dropdownData.categories.length > 0
                    ? dropdownData.categories.filter((cat) => typeof cat === 'string' && cat.trim() !== '').map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                      ))
                    : ["image","video","audio","document"].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL du fichier *</Label>
              <Input
                id="url"
                {...register('url')}
                placeholder="https://example.com/file.pdf"
                type="url"
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_text">Texte alternatif</Label>
              <Input
                id="alt_text"
                {...register('alt_text')}
                placeholder="Description pour l'accessibilité"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(watch('tags') || '').split(',').map((tag, index) => (
                tag.trim() && (
                  <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">
                    <span>{tag.trim()}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Uploader */}
          <div className="space-y-2">
            <Label htmlFor="uploaded_by">Téléchargé par</Label>
            <Select onValueChange={(value) => setValue('uploaded_by', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Utilisateur actuel</SelectItem>
                {dropdownData.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setFileInfo(null);
              }}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading || !fileInfo}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le média'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
