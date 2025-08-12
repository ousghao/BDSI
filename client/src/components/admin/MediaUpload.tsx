import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Trash2,
  Check
} from "lucide-react";

interface MediaUploadProps {
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  tags: string[];
  caption: string;
}

export function MediaUpload({ onClose, onUpload }: MediaUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return false;
      }
      
      // Check file type
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg',
        'application/pdf', 'text/plain', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return validTypes.includes(file.type);
    });

    const filesWithPreview: FileWithPreview[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      tags: [],
      caption: ''
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileData = (index: number, field: 'tags' | 'caption', value: string | string[]) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (field === 'tags' && typeof value === 'string') {
        newFiles[index].tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (field === 'caption' && typeof value === 'string') {
        newFiles[index].caption = value;
      }
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);

      // Call the upload handler
      onUpload(files.map(f => f.file));

      // Cleanup object URLs
      files.forEach(f => {
        if (f.preview) {
          URL.revokeObjectURL(f.preview);
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (type.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Télécharger des fichiers</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-upload">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' 
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-testid="upload-area"
          >
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Déposez vos fichiers ici ou cliquez pour sélectionner
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Supports: Images (JPG, PNG, GIF, WebP, SVG), Vidéos (MP4, WebM, OGG), Documents (PDF, DOC, TXT)
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Taille maximum: 10 MB par fichier
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button asChild data-testid="select-files">
              <label htmlFor="file-input" className="cursor-pointer">
                Sélectionner des fichiers
              </label>
            </Button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Fichiers à télécharger ({files.length})
              </h3>
              
              <div className="space-y-4" data-testid="file-list">
                {files.map((fileData, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      {/* File preview/icon */}
                      <div className="flex-shrink-0">
                        {fileData.preview ? (
                          <img 
                            src={fileData.preview} 
                            alt={fileData.file.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                            {getFileIcon(fileData.file.type)}
                          </div>
                        )}
                      </div>

                      {/* File details */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white truncate">
                            {fileData.file.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatFileSize(fileData.file.size)} • {fileData.file.type}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor={`caption-${index}`} className="text-xs">Légende</Label>
                          <Input
                            id={`caption-${index}`}
                            placeholder="Description du fichier"
                            value={fileData.caption}
                            onChange={(e) => updateFileData(index, 'caption', e.target.value)}
                            className="text-sm"
                            data-testid={`caption-${index}`}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`tags-${index}`} className="text-xs">Tags (séparés par des virgules)</Label>
                          <Input
                            id={`tags-${index}`}
                            placeholder="projet, étudiants, laboratoire"
                            value={fileData.tags.join(', ')}
                            onChange={(e) => updateFileData(index, 'tags', e.target.value)}
                            className="text-sm"
                            data-testid={`tags-${index}`}
                          />
                          {fileData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {fileData.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`remove-file-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Téléchargement en cours...</span>
                    <span className="text-sm text-slate-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-4 mt-8">
                <Button variant="outline" onClick={onClose} disabled={isUploading} data-testid="cancel-upload">
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className="bg-primary-600 hover:bg-primary-700"
                  data-testid="upload-files"
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Télécharger {files.length} fichier{files.length > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
