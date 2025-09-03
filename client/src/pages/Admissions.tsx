import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// Validation schema
const admissionSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis").max(200),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le numéro de téléphone est requis").max(20),
  nationalId: z.string().min(1, "La CIN/passeport est requis").max(50),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  address: z.string().min(1, "L'adresse est requise").max(500),
  priorDegree: z.enum(['bac', 'licence', 'master', 'equivalent']),
  gpaOrScore: z.string().optional(),
  programTrack: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const priorDegreeOptions = [
  { value: 'bac', label: 'Baccalauréat' },
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'equivalent', label: 'Équivalent' },
];

export default function Admissions() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      priorDegree: 'bac',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setFileError('Seuls les fichiers PDF sont acceptés');
      setSelectedFile(null);
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setFileError('Le fichier ne doit pas dépasser 20 MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const onSubmit = async (data: AdmissionFormData) => {
    if (!selectedFile) {
      setFileError('Le fichier PDF est requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      
      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      const response = await fetch('/api/admissions', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.ok) {
        setIsSuccess(true);
        toast({
          title: "Candidature soumise",
          description: "Votre candidature a été soumise avec succès. Nous vous contacterons bientôt.",
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la soumission');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la soumission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Candidature soumise avec succès !</CardTitle>
                <CardDescription>
                  Merci pour votre candidature au Master Big Data & Systèmes Intelligents.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Nous avons bien reçu votre dossier de candidature. Notre équipe va l'examiner 
                  et vous contactera dans les plus brefs délais.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Prochaines étapes :
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                    <li>• Examen de votre dossier par notre comité</li>
                    <li>• Contact par email ou téléphone</li>
                    <li>• Convocation pour entretien (si nécessaire)</li>
                    <li>• Notification de la décision finale</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4"
                >
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Candidature au Master BDSI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Postulez au Master "Big Data & Systèmes Intelligents" de la Faculté des Sciences 
              Dhar El Mehraz. Remplissez le formulaire ci-dessous pour soumettre votre candidature.
            </p>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Formulaire de candidature</CardTitle>
              <CardDescription>
                Veuillez remplir tous les champs obligatoires et joindre votre dossier PDF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Informations personnelles
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        {...register('fullName')}
                        placeholder="Votre nom complet"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="votre.email@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+212 6 12 34 56 78"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nationalId">CIN/Passeport *</Label>
                      <Input
                        id="nationalId"
                        {...register('nationalId')}
                        placeholder="AB123456"
                        className={errors.nationalId ? 'border-red-500' : ''}
                      />
                      {errors.nationalId && (
                        <p className="text-red-500 text-sm mt-1">{errors.nationalId.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dob">Date de naissance *</Label>
                      <Input
                        id="dob"
                        type="date"
                        {...register('dob')}
                        className={errors.dob ? 'border-red-500' : ''}
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="priorDegree">Diplôme obtenu *</Label>
                      <Select
                        value={watch('priorDegree')}
                        onValueChange={(value) => setValue('priorDegree', value as any)}
                      >
                        <SelectTrigger className={errors.priorDegree ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionnez votre diplôme" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorDegreeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.priorDegree && (
                        <p className="text-red-500 text-sm mt-1">{errors.priorDegree.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse complète *</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      placeholder="Votre adresse complète"
                      rows={3}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gpaOrScore">Moyenne/Score (optionnel)</Label>
                      <Input
                        id="gpaOrScore"
                        {...register('gpaOrScore')}
                        placeholder="Ex: 15.5/20 ou 85%"
                      />
                    </div>

                    <div>
                      <Label htmlFor="programTrack">Spécialisation souhaitée (optionnel)</Label>
                      <Input
                        id="programTrack"
                        {...register('programTrack')}
                        placeholder="Ex: IA/ML, Data Engineering, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Documents requis
                  </h3>
                  
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important :</strong> Veuillez fusionner tous vos documents (bac, licence/équivalent, CIN) 
                      en un seul fichier PDF. Taille maximale : 20 MB.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="pdf">Dossier PDF *</Label>
                    <div className="mt-2">
                      <Input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Fichier sélectionné : {selectedFile.name}</span>
                      </div>
                    )}
                    {fileError && (
                      <p className="text-red-500 text-sm mt-1">{fileError}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Soumission en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Soumettre ma candidature
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Documents à inclure dans le PDF :</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Diplôme de baccalauréat</li>
                    <li>• Diplôme de licence ou équivalent</li>
                    <li>• Carte d'identité nationale (CIN)</li>
                    <li>• Relevés de notes</li>
                    <li>• CV (optionnel)</li>
                    <li>• Lettre de motivation (optionnel)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Critères d'admission :</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Baccalauréat scientifique</li>
                    <li>• Licence en informatique ou équivalent</li>
                    <li>• Bon niveau en mathématiques</li>
                    <li>• Maîtrise de l'anglais</li>
                    <li>• Motivation et projet professionnel</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
