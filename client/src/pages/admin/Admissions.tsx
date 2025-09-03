import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Admission {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dob: string;
  address: string;
  priorDegree: string;
  gpaOrScore?: string;
  programTrack?: string;
  pdfUrl: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  notesAdmin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdmissionsResponse {
  ok: boolean;
  data: {
    admissions: Admission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusIcons = {
  submitted: Clock,
  under_review: AlertCircle,
  accepted: CheckCircle,
  rejected: XCircle,
};

const statusLabels = {
  submitted: 'Soumis',
  under_review: 'En cours d\'examen',
  accepted: 'Accepté',
  rejected: 'Rejeté',
};

export default function AdminAdmissions() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
     // State
   const [filters, setFilters] = useState({
     status: 'all',
     programTrack: '',
     search: '',
     startDate: '',
     endDate: '',
   });
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState('');

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

     // Build query string
   const buildQueryString = () => {
     const params = new URLSearchParams();
     params.append('page', currentPage.toString());
     params.append('limit', '20');
     
     if (filters.status && filters.status !== 'all') params.append('status', filters.status);
     if (filters.programTrack) params.append('programTrack', filters.programTrack);
     if (filters.search) params.append('search', filters.search);
     if (filters.startDate) params.append('startDate', filters.startDate);
     if (filters.endDate) params.append('endDate', filters.endDate);
     
     return params.toString();
   };

  // Fetch admissions
  const { data: admissionsData, isLoading: isLoadingAdmissions } = useQuery<AdmissionsResponse>({
    queryKey: ['/api/admissions/admin', buildQueryString()],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Update admission mutation
  const updateAdmissionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admissions/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admissions/admin'] });
      toast({
        title: "Succès",
        description: "Candidature mise à jour avec succès",
      });
      setIsDetailOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la candidature",
        variant: "destructive",
      });
    },
  });

  // Download PDF mutation
  const downloadPdfMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admissions/admin/${id}/pdf`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        window.open(data.data.downloadUrl, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du PDF",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (admission: Admission) => {
    setSelectedAdmission(admission);
    setNotes(admission.notesAdmin || '');
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedAdmission) return;
    
    updateAdmissionMutation.mutate({
      id: selectedAdmission.id,
      data: { status, notesAdmin: notes },
    });
  };

  const handleDownloadPdf = (id: number) => {
    downloadPdfMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Gestion des candidatures
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Consultez et gérez les candidatures au Master BDSI
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Nom, email, CIN..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

                             <div>
                 <Label htmlFor="status">Statut</Label>
                 <Select
                   value={filters.status}
                   onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Tous les statuts" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">Tous les statuts</SelectItem>
                     <SelectItem value="submitted">Soumis</SelectItem>
                     <SelectItem value="under_review">En cours d'examen</SelectItem>
                     <SelectItem value="accepted">Accepté</SelectItem>
                     <SelectItem value="rejected">Rejeté</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

              <div>
                <Label htmlFor="programTrack">Spécialisation</Label>
                <Input
                  id="programTrack"
                  placeholder="IA/ML, Data Engineering..."
                  value={filters.programTrack}
                  onChange={(e) => setFilters(prev => ({ ...prev, programTrack: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="startDate">Date début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Date fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures</CardTitle>
            <CardDescription>
              {admissionsData?.data.pagination.total || 0} candidature(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAdmissions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CIN</TableHead>
                      <TableHead>Diplôme</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admissionsData?.data.admissions.map((admission) => {
                      const StatusIcon = statusIcons[admission.status];
                      return (
                        <TableRow key={admission.id}>
                          <TableCell className="font-medium">{admission.fullName}</TableCell>
                          <TableCell>{admission.email}</TableCell>
                          <TableCell>{admission.nationalId}</TableCell>
                          <TableCell>{admission.priorDegree}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[admission.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[admission.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(admission.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(admission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPdf(admission.id)}
                                disabled={downloadPdfMutation.isPending}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {admissionsData?.data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Page {currentPage} sur {admissionsData.data.pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(admissionsData.data.pagination.totalPages, prev + 1))}
                        disabled={currentPage === admissionsData.data.pagination.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de la candidature</DialogTitle>
              <DialogDescription>
                Consultez et modifiez les informations de la candidature
              </DialogDescription>
            </DialogHeader>

            {selectedAdmission && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Informations</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Nom complet
                        </Label>
                        <p className="text-lg font-semibold">{selectedAdmission.fullName}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Email
                        </Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <a 
                            href={`mailto:${selectedAdmission.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedAdmission.email}
                          </a>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Téléphone
                        </Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <a 
                            href={`tel:${selectedAdmission.phone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedAdmission.phone}
                          </a>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          CIN/Passeport
                        </Label>
                        <p>{selectedAdmission.nationalId}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Date de naissance
                        </Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <p>{formatDateOnly(selectedAdmission.dob)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Adresse
                        </Label>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                          <p className="text-sm">{selectedAdmission.address}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Diplôme obtenu
                        </Label>
                        <p>{selectedAdmission.priorDegree}</p>
                      </div>

                      {selectedAdmission.gpaOrScore && (
                        <div>
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Moyenne/Score
                          </Label>
                          <p>{selectedAdmission.gpaOrScore}</p>
                        </div>
                      )}

                      {selectedAdmission.programTrack && (
                        <div>
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Spécialisation souhaitée
                          </Label>
                          <p>{selectedAdmission.programTrack}</p>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Statut actuel
                        </Label>
                        <Badge className={statusColors[selectedAdmission.status]}>
                          {statusLabels[selectedAdmission.status]}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Date de soumission
                        </Label>
                        <p>{formatDate(selectedAdmission.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Dossier PDF
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPdf(selectedAdmission.id)}
                        disabled={downloadPdfMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le PDF
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Changer le statut</Label>
                      <div className="flex gap-2 mt-2">
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <Button
                            key={status}
                            variant={selectedAdmission.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpdateStatus(status)}
                            disabled={updateAdmissionMutation.isPending}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes administratives
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ajoutez des notes sur cette candidature..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(selectedAdmission.status)}
                        disabled={updateAdmissionMutation.isPending}
                      >
                        {updateAdmissionMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mise à jour...
                          </>
                        ) : (
                          'Sauvegarder'
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
