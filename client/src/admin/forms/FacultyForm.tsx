import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  user_id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nom requis'),
  name_en: z.string().optional(),
  name_ar: z.string().optional(),
  title: z.string().min(1, 'Titre requis'),
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  specialization: z.string().optional(),
  specialization_en: z.string().optional(),
  specialization_ar: z.string().optional(),
  bio: z.string().optional(),
  bio_en: z.string().optional(),
  bio_ar: z.string().optional(),
  research: z.string().optional(),
  research_en: z.string().optional(),
  research_ar: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  profile_image_url: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
  is_active: z.boolean().default(true),
});

type FacultyFormData = z.infer<typeof schema>;

export function FacultyForm({ onClose }: { onClose?: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FacultyFormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true },
  });

  const onSubmit = async (data: FacultyFormData) => {
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const out = await res.json();
      if (res.ok && out.ok) {
        toast({ title: 'Membre créé', description: `"${data.name}" a été ajouté.` });
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
        <CardTitle>Nouveau Membre</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" {...register('linkedin_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Site web</Label>
              <Input id="website_url" {...register('website_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile_image_url">Photo (URL)</Label>
              <Input id="profile_image_url" {...register('profile_image_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordre</Label>
              <Input id="order" type="number" {...register('order', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Spécialisation</Label>
            <Input id="specialization" {...register('specialization')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} {...register('bio')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="research">Recherche</Label>
            <Textarea id="research" rows={3} {...register('research')} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="is_active" checked={watch('is_active')} onCheckedChange={(c) => setValue('is_active', c as boolean)} />
            <Label htmlFor="is_active">Actif</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => reset()}>Réinitialiser</Button>
            <Button type="submit">Créer le membre</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


