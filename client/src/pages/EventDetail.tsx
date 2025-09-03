import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink, 
  FileText,
  Tag,
  Share2,
  Download
} from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

const eventTypeColors = {
  "seminar": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "defense": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  "workshop": "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  "meetup": "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

const eventTypeLabels = {
  "seminar": "Séminaire",
  "defense": "Soutenance",
  "workshop": "Atelier",
  "meetup": "Rencontre",
};

export default function EventDetail() {
  const [, setLocation] = useLocation();
  const eventId = parseInt(window.location.pathname.split('/').pop() || '0');

  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Event not found');
      }
      return response.json();
    },
  });

  // Fetch related events for sidebar
  const { data: relatedEvents } = useQuery<Event[]>({
    queryKey: ['/api/events', { type: event?.type }],
    queryFn: async () => {
      const response = await fetch(`/api/events?type=${event?.type}`);
      if (!response.ok) return [];
      const allEvents = await response.json();
      return allEvents.filter((item: Event) => item.id !== eventId).slice(0, 3);
    },
    enabled: !!event?.type,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Événement non trouvé
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              L'événement que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => setLocation('/events')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux événements
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const speakers = event.speakers ? JSON.parse(event.speakers) : [];

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-4"
              onClick={() => setLocation('/events')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux événements
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={eventTypeColors[event.type as keyof typeof eventTypeColors] || "bg-gray-100 text-gray-700"}
                >
                  {eventTypeLabels[event.type as keyof typeof eventTypeLabels] || event.type}
                </Badge>
                <Badge 
                  variant={isUpcoming ? "default" : "secondary"}
                  className={isUpcoming ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : ""}
                >
                  {isUpcoming ? "À venir" : "Terminé"}
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
                {event.title}
              </h1>
              
              {event.description && (
                <p className="text-xl text-blue-100 leading-relaxed mb-6">
                  {event.description}
                </p>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Début: {formatDateTime(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Fin: {formatDateTime(event.endDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {event.imageUrl && (
              <div className="lg:col-span-1">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {event.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Speakers */}
              {speakers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Intervenants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {speakers.map((speaker: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {speaker}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Registration */}
              {event.registrationUrl && isUpcoming && (
                <Card>
                  <CardHeader>
                    <CardTitle>Inscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Pour participer à cet événement, veuillez vous inscrire via le lien ci-dessous.
                    </p>
                    <Button asChild>
                      <a 
                        href={event.registrationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        S'inscrire à l'événement
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Début:</span>
                    <span className="font-medium">{formatDateTime(event.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Fin:</span>
                    <span className="font-medium">{formatDateTime(event.endDate)}</span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">Lieu:</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Type:</span>
                    <span className="font-medium">
                      {eventTypeLabels[event.type as keyof typeof eventTypeLabels] || event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isUpcoming 
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      {isUpcoming ? "À venir" : "Terminé"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              {event.documentsUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={event.documentsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger les documents
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Partager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.share?.({
                          title: event.title,
                          text: event.description || '',
                          url: window.location.href,
                        }).catch(() => {
                          navigator.clipboard.writeText(window.location.href);
                        });
                      }}
                    >
                      Partager
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                    >
                      Copier le lien
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Events */}
              {relatedEvents && relatedEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Événements similaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedEvents.map((relatedEvent) => (
                        <div key={relatedEvent.id} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                          <Link href={`/events/${relatedEvent.id}`}>
                            <div className="cursor-pointer group">
                              <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {relatedEvent.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                {relatedEvent.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-3 w-3 text-slate-500" />
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  {formatDate(relatedEvent.startDate)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
