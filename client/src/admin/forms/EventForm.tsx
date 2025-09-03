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
import { Loader2, Calendar, MapPin, Users } from 'lucide-react';

import type { Event } from "@shared/schema";

const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(500),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description: z.string().min(1, "La description est requise").max(2000),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  type: z.enum(['seminar', 'defense', 'workshop', 'meetup']),
  location: z.string().min(1, "Le lieu est requis").max(500),
  location_en: z.string().optional(),
  location_ar: z.string().optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
  speakers: z.string().optional(),
  registration_url: z.string().url().optional().or(z.literal('')),
  documents_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true)
});

type EventFormData = z.infer<typeof eventSchema>;

interface DropdownData {
  eventTypes: string[];
}

interface EventFormProps {
  event?: Event | null;
  onClose?: () => void;
}

export function EventForm({ event, onClose }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
  const { toast } = useToast();
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      title: event.title,
      title_en: event.titleEn || '',
      title_ar: event.titleAr || '',
      description: event.description || '',
      description_en: event.descriptionEn || '',
      description_ar: event.descriptionAr || '',
      type: event.type as 'seminar' | 'defense' | 'workshop' | 'meetup',
      location: event.location || '',
      location_en: event.locationEn || '',
      location_ar: event.locationAr || '',
      start_date: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      end_date: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      speakers: event.speakers || '',
      registration_url: event.registrationUrl || '',
      documents_url: event.documentsUrl || '',
      image_url: event.imageUrl || '',
      is_active: event.isActive ?? true
    } : {
      is_active: true,
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16) // 2 hours later
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

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      // Transform form data to match API schema
      const apiData = {
        title: data.title,
        titleEn: data.title_en,
        titleAr: data.title_ar,
        description: data.description,
        descriptionEn: data.description_en,
        descriptionAr: data.description_ar,
        type: data.type,
        location: data.location,
        locationEn: data.location_en,
        locationAr: data.location_ar,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        speakers: data.speakers,
        registrationUrl: data.registration_url,
        documentsUrl: data.documents_url,
        imageUrl: data.image_url,
        isActive: data.is_active
      };

      const url = isEditing ? `/api/admin/events/${event.id}` : '/api/admin/events';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Succès",
          description: isEditing 
            ? `Événement "${data.title}" modifié avec succès!`
            : `Événement "${data.title}" créé avec succès!`,
        });
        if (!isEditing) {
          reset();
        }
        onClose?.();
      } else {
        throw new Error(result.message || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} de l'événement`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} event:`, error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : `Une erreur s'est produite lors de ${isEditing ? 'la modification' : 'la création'}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSpeaker = () => {
    const input = document.querySelector('input[placeholder="Nom du conférencier"]') as HTMLInputElement;
    if (input?.value.trim()) {
      const currentSpeakers = watch('speakers') || '';
      const newSpeakers = currentSpeakers ? `${currentSpeakers}, ${input.value.trim()}` : input.value.trim();
      setValue('speakers', newSpeakers);
      input.value = '';
    }
  };

  const removeSpeaker = (index: number) => {
    const currentSpeakers = watch('speakers') || '';
    const speakers = currentSpeakers.split(',').map(s => s.trim());
    speakers.splice(index, 1);
    setValue('speakers', speakers.join(', '));
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
        <CardTitle className="text-2xl font-bold">Nouvel Événement</CardTitle>
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
                placeholder="Titre de l'événement en français"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownData.eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'seminar' && 'Séminaire'}
                      {type === 'defense' && 'Défense'}
                      {type === 'workshop' && 'Atelier'}
                      {type === 'meetup' && 'Rencontre'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début *</Label>
              <div className="relative">
                <Input
                  id="start_date"
                  type="datetime-local"
                  {...register('start_date')}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin *</Label>
              <div className="relative">
                <Input
                  id="end_date"
                  type="datetime-local"
                  {...register('end_date')}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.end_date && (
                <p className="text-sm text-red-500">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu *</Label>
            <div className="relative">
              <Input
                id="location"
                {...register('location')}
                placeholder="Lieu de l'événement"
              />
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description détaillée de l'événement"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Speakers */}
          <div className="space-y-2">
            <Label>Conférenciers</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nom du conférencier"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSpeaker();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpeaker}
              >
                <Users className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(watch('speakers') || '').split(',').map((speaker, index) => (
                speaker.trim() && (
                  <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    <span>{speaker.trim()}</span>
                    <button
                      type="button"
                      onClick={() => removeSpeaker(index)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="registration_url">URL d'inscription</Label>
              <Input
                id="registration_url"
                {...register('registration_url')}
                placeholder="https://example.com/register"
                type="url"
              />
              {errors.registration_url && (
                <p className="text-sm text-red-500">{errors.registration_url.message}</p>
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
                'Créer l\'événement'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
