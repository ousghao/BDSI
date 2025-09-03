import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const courseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  semester: z.number().int().min(1).max(12),
  credits: z.number().int().min(1).max(60),
  objectives: z.string().optional(),
  objectives_en: z.string().optional(),
  objectives_ar: z.string().optional(),
  prerequisites: z.string().optional(),
  prerequisites_en: z.string().optional(),
  prerequisites_ar: z.string().optional(),
  evaluation: z.string().optional(),
  evaluation_en: z.string().optional(),
  evaluation_ar: z.string().optional(),
  resources: z.string().optional(),
  resources_en: z.string().optional(),
  resources_ar: z.string().optional(),
  instructor_id: z.string().uuid().optional(),
  is_active: z.boolean().default(true),
});

type CourseFormData = z.infer<typeof courseSchema>;

export function CourseForm({ onClose }: { onClose?: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { is_active: true, semester: 1, credits: 6 },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const out = await res.json();
      if (res.ok && out.ok) {
        toast({ title: 'Cours créé', description: `"${data.title}" a été ajouté.` });
        reset();
        onClose?.();
      } else {
        toast({ title: 'Erreur', description: out.message || 'Création échouée', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Erreur', description: 'Connexion serveur échouée', variant: 'destructive' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Nouveau Cours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre *</Label>
              <Input id="semester" type="number" min={1} max={12} {...register('semester', { valueAsNumber: true })} />
              {errors.semester && <p className="text-sm text-red-500">{errors.semester.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Crédits (ECTS) *</Label>
              <Input id="credits" type="number" min={1} max={60} {...register('credits', { valueAsNumber: true })} />
              {errors.credits && <p className="text-sm text-red-500">{errors.credits.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor_id">ID Enseignant (optionnel)</Label>
              <Input id="instructor_id" {...register('instructor_id')} placeholder="uuid instructeur" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objectifs</Label>
            <Textarea id="objectives" rows={3} {...register('objectives')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Prérequis</Label>
            <Textarea id="prerequisites" rows={3} {...register('prerequisites')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluation">Évaluation</Label>
            <Textarea id="evaluation" rows={3} {...register('evaluation')} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="is_active" checked={watch('is_active')} onCheckedChange={(c) => setValue('is_active', c as boolean)} />
            <Label htmlFor="is_active">Actif</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => reset()}>Réinitialiser</Button>
            <Button type="submit">Créer le cours</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


