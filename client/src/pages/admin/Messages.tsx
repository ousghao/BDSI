import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  MessageSquare,
  User,
  Eye,
  CheckCircle,
  Archive,
  Trash2,
  Filter,
  Search,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import type { ContactMessage } from "@shared/schema";

interface ContactMessagesResponse {
  ok: boolean;
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function Messages() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user as any)?.role !== 'admin')) {
      toast({
        title: t('admin.unauthorized'),
        description: t('admin.unauthorizedDescription'),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, (user as any)?.role, toast]);

  // Fetch contact messages
  const { data: messagesData, isLoading: messagesLoading, error } = useQuery<ContactMessagesResponse>({
    queryKey: ['admin-contact-messages', filter, page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/admin/contact-messages?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch messages');
      }
      
      return response.json();
    },
    enabled: isAuthenticated && (user as any)?.role === 'admin',
  });

  // Update message status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      const response = await fetch(`/api/admin/contact-messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du message a été mis à jour avec succès.",
      });
      setSelectedMessage(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du message.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!isAuthenticated || (user as any)?.role !== 'admin') {
    return null;
  }

  const getStatusBadge = (status: string | null) => {
    const statusValue = status || 'new';
    const statusConfig = {
      'new': { label: 'Nouveau', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'read': { label: 'Lu', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
      'replied': { label: 'Répondu', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      'archived': { label: 'Archivé', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    };
    
    return statusConfig[statusValue as keyof typeof statusConfig] || statusConfig.new;
  };

  const getReasonLabel = (reason: string) => {
    const reasons = {
      'admission': 'Candidature et admission',
      'program': 'Information sur le programme',
      'partnership': 'Partenariat entreprise',
      'internship': 'Stage ou projet',
      'research': 'Collaboration recherche',
      'other': 'Autre',
    };
    
    return reasons[reason as keyof typeof reasons] || reason;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Messages de contact
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Rechercher par nom, email, sujet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="filter">Filtrer par statut</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les messages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les messages</SelectItem>
                      <SelectItem value="new">Nouveaux</SelectItem>
                      <SelectItem value="read">Lus</SelectItem>
                      <SelectItem value="replied">Répondus</SelectItem>
                      <SelectItem value="archived">Archivés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          {messagesLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Chargement des messages...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des messages</p>
              </CardContent>
            </Card>
          ) : !messagesData?.data?.length ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Aucun message trouvé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messagesData.data.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusBadge(message.status).className}>
                              {getStatusBadge(message.status).label}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {getReasonLabel(message.reason)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            {message.createdAt ? new Date(message.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Date inconnue'}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{message.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <a href={`mailto:${message.email}`} className="text-blue-600 hover:text-blue-800">
                              {message.email}
                            </a>
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                          {message.organization && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-slate-400" />
                              <span>{message.organization}</span>
                            </div>
                          )}
                        </div>

                        {/* Subject */}
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {message.subject}
                          </h3>
                        </div>

                        {/* Message Preview */}
                        <div className="text-slate-600 dark:text-slate-400">
                          <p className="line-clamp-2">
                            {message.message}
                          </p>
                        </div>

                        {/* Admin Notes */}
                        {message.adminNotes && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Notes admin:</strong> {message.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-32">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        
                        <a 
                          href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                          className="inline-flex"
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Répondre
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {messagesData.pagination.pages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Page {messagesData.pagination.page} sur {messagesData.pagination.pages} 
                        ({messagesData.pagination.total} messages)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Précédent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= messagesData.pagination.pages}
                          onClick={() => setPage(page + 1)}
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Message Detail Modal */}
          {selectedMessage && (
            <AlertDialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
              <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-3">
                    <Badge className={getStatusBadge(selectedMessage.status).className}>
                      {getStatusBadge(selectedMessage.status).label}
                    </Badge>
                    {selectedMessage.subject}
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div>
                          <strong>Nom:</strong> {selectedMessage.name}
                        </div>
                        <div>
                          <strong>Email:</strong> {selectedMessage.email}
                        </div>
                        {selectedMessage.phone && (
                          <div>
                            <strong>Téléphone:</strong> {selectedMessage.phone}
                          </div>
                        )}
                        {selectedMessage.organization && (
                          <div>
                            <strong>Organisation:</strong> {selectedMessage.organization}
                          </div>
                        )}
                        <div>
                          <strong>Motif:</strong> {getReasonLabel(selectedMessage.reason)}
                        </div>
                        <div>
                          <strong>Date:</strong> {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date inconnue'}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <strong>Message:</strong>
                        <div className="mt-2 p-4 bg-white dark:bg-slate-700 border rounded-md">
                          <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <h4 className="font-semibold">Modifier le statut</h4>
                        <div className="flex gap-2 flex-wrap">
                          {['read', 'replied', 'archived'].map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={selectedMessage.status === status ? "default" : "outline"}
                              onClick={() => updateStatusMutation.mutate({ 
                                id: selectedMessage.id, 
                                status 
                              })}
                              disabled={updateStatusMutation.isPending}
                            >
                              {status === 'read' && <CheckCircle className="h-4 w-4 mr-1" />}
                              {status === 'replied' && <Mail className="h-4 w-4 mr-1" />}
                              {status === 'archived' && <Archive className="h-4 w-4 mr-1" />}
                              {getStatusBadge(status).label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Fermer</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Button>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Répondre par email
                      </Button>
                    </a>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Layout>
  );
}
