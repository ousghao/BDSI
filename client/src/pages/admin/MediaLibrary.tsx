import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Search, 
  Filter,
  Image,
  FileText,
  Video,
  Download,
  Trash2,
  Eye,
  Copy,
  Grid,
  List
} from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
}

// Mock data for demonstration - in real app this would come from API
const mockMediaFiles: MediaFile[] = [
  {
    id: "1",
    name: "students-lab.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    size: 245760,
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    uploadedBy: "Admin",
    tags: ["étudiants", "laboratoire", "collaboration"]
  },
  {
    id: "2",
    name: "neural-network.jpg",
    type: "image", 
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    size: 189440,
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    uploadedBy: "Admin",
    tags: ["ia", "réseau neuronal", "technologie"]
  },
  {
    id: "3",
    name: "data-dashboard.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    size: 312320,
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    uploadedBy: "Admin",
    tags: ["dashboard", "données", "visualisation"]
  }
];

export default function MediaLibrary() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
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
  }, [isAuthenticated, isLoading, user?.role, toast]);

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

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: t('media.copied'),
      description: t('media.copiedDescription'),
    });
  };

  const handleDelete = (id: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: t('media.deleted'),
      description: t('media.deletedDescription'),
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="media-title">
                Médiathèque
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Gérez vos images, vidéos et documents
              </p>
            </div>
            <Button 
              onClick={() => setShowUpload(true)}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="upload-button"
            >
              <Upload className="mr-2 h-4 w-4" />
              Télécharger des fichiers
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card data-testid="stat-total">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {mediaFiles.length}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Total fichiers</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-images">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {mediaFiles.filter(f => f.type === 'image').length}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Images</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-videos">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mediaFiles.filter(f => f.type === 'video').length}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Vidéos</p>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-documents">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent-500">
                  {mediaFiles.filter(f => f.type === 'document').length}
                </div>
                <p className="text-slate-600 dark:text-slate-400">Documents</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Filtres:</span>
                  </div>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48" data-testid="type-filter">
                      <SelectValue placeholder="Type de fichier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Vidéos</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher des fichiers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                      data-testid="search-input"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      data-testid="grid-view"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      data-testid="list-view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="media-grid">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden group" data-testid={`media-item-${file.id}`}>
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(file.type)}
                        <span className="ml-2 text-sm">{file.name}</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCopyUrl(file.url)}
                        data-testid={`copy-url-${file.id}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        data-testid={`download-${file.id}`}
                      >
                        <a href={file.url} download={file.name}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-${file.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate text-sm">{file.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {file.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{file.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card data-testid="media-list">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800" data-testid={`media-list-item-${file.id}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                          {file.type === 'image' ? (
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            getTypeIcon(file.type)
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.uploadedAt).toLocaleDateString('fr-FR')}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {file.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyUrl(file.url)}
                          data-testid={`copy-url-list-${file.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          data-testid={`download-list-${file.id}`}
                        >
                          <a href={file.url} download={file.name}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`delete-list-${file.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-16" data-testid="no-files">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Aucun fichier trouvé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery || selectedType !== "all" 
                  ? "Essayez de modifier vos critères de recherche."
                  : "Commencez par télécharger vos premiers fichiers."
                }
              </p>
              {!searchQuery && selectedType === "all" && (
                <Button 
                  onClick={() => setShowUpload(true)}
                  data-testid="upload-first-file"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Télécharger des fichiers
                </Button>
              )}
            </div>
          )}

          {/* Upload Modal */}
          {showUpload && (
            <MediaUpload 
              onClose={() => setShowUpload(false)}
              onUpload={(files) => {
                // In a real app, this would upload to the server
                const newFiles = files.map((file, index) => ({
                  id: `new-${Date.now()}-${index}`,
                  name: file.name,
                  type: file.type.startsWith('image/') ? 'image' as const : 
                        file.type.startsWith('video/') ? 'video' as const : 'document' as const,
                  url: URL.createObjectURL(file),
                  size: file.size,
                  uploadedAt: new Date().toISOString(),
                  uploadedBy: user?.firstName || 'Admin',
                  tags: []
                }));
                setMediaFiles(prev => [...newFiles, ...prev]);
                setShowUpload(false);
                toast({
                  title: "Fichiers téléchargés",
                  description: `${files.length} fichier(s) ont été téléchargés avec succès.`,
                });
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
