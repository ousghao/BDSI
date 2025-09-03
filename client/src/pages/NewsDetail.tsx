import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag,
  Share2,
  ExternalLink,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

const categoryColors = {
  "event": "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "research": "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  "success_story": "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  "announcement": "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
};

const categoryLabels = {
  "event": "Événement",
  "research": "Recherche",
  "success_story": "Succès",
  "announcement": "Annonce",
};

export default function NewsDetail() {
  const [, setLocation] = useLocation();
  const newsId = parseInt(window.location.pathname.split('/').pop() || '0');

  const { data: news, isLoading, error } = useQuery<News>({
    queryKey: [`/api/news/${newsId}`],
    queryFn: async () => {
      const response = await fetch(`/api/news/${newsId}`);
      if (!response.ok) {
        throw new Error('News not found');
      }
      return response.json();
    },
  });

  // Fetch related news for sidebar
  const { data: relatedNews } = useQuery<News[]>({
    queryKey: ['/api/news', { category: news?.category }],
    queryFn: async () => {
      const response = await fetch(`/api/news?category=${news?.category}`);
      if (!response.ok) return [];
      const allNews = await response.json();
      return allNews.filter((item: News) => item.id !== newsId).slice(0, 3);
    },
    enabled: !!news?.category,
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

  if (error || !news) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Actualité non trouvée
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              L'actualité que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => setLocation('/news')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
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

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-4"
              onClick={() => setLocation('/news')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={categoryColors[news.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}
                >
                  {categoryLabels[news.category as keyof typeof categoryLabels] || news.category}
                </Badge>
                {news.isFeatured && (
                  <Badge className="bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300">
                    Mis en avant
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-playfair">
                {news.title}
              </h1>
              
              {news.summary && (
                <p className="text-xl text-blue-100 leading-relaxed mb-6">
                  {news.summary}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(news.publishedAt || news.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {news.imageUrl && (
              <div className="lg:col-span-1">
                <img 
                  src={news.imageUrl} 
                  alt={news.title}
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
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <div className="prose dark:prose-invert max-w-none">
                    {news.content ? (
                      <div 
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                      />
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {news.summary}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              {news.authorId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Auteur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          Auteur
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Master BDSI
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Article Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Publié le:</span>
                    <span className="font-medium">
                      {formatDate(news.publishedAt || news.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">Catégorie:</span>
                    <span className="font-medium">
                      {categoryLabels[news.category as keyof typeof categoryLabels] || news.category}
                    </span>
                  </div>
                  
                  {news.isFeatured && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-accent-600 dark:text-accent-400 font-medium">
                        Article mis en avant
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                          title: news.title,
                          text: news.summary || '',
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

              {/* Related News */}
              {relatedNews && relatedNews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Articles similaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedNews.map((relatedItem) => (
                        <div key={relatedItem.id} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                          <Link href={`/news/${relatedItem.id}`}>
                            <div className="cursor-pointer group">
                              <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {relatedItem.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                {relatedItem.summary}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                {formatDate(relatedItem.publishedAt || relatedItem.createdAt)}
                              </p>
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
