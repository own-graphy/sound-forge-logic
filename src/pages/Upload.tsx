import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Play,
  FileAudio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  phoneme?: string;
  duration?: number;
}

export const Upload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [phonemeLabel, setPhonemeLabel] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload audio files only (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }

      const fileId = `file_${Date.now()}_${Math.random()}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploadedFiles(prev2 => prev2.map(f2 => 
                  f2.id === fileId 
                    ? { ...f2, status: 'completed', duration: Math.random() * 120 + 30 }
                    : f2
                ));
              }, 500);
              return { ...f, progress: 100, status: 'processing' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const playFile = (file: UploadedFile) => {
    const audio = new Audio(file.url);
    audio.play();
  };

  const assignPhoneme = (fileId: string) => {
    if (!phonemeLabel.trim()) {
      toast({
        title: "Phoneme Required",
        description: "Please enter a phoneme label for this audio file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, phoneme: phonemeLabel } : f
    ));
    setPhonemeLabel('');
    
    toast({
      title: "Phoneme Assigned",
      description: `Audio file labeled with phoneme: ${phonemeLabel}`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Upload Voice Samples
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload individual audio files and label them with phonemes to create detailed voice mappings 
            for advanced voice synthesis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Zone */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardContent className="p-6">
                <motion.div
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
                    ${isDragOver 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                      <UploadIcon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {isDragOver ? 'Drop files here' : 'Upload Audio Files'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop audio files or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="audio/*"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <File className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: MP3, WAV, OGG, M4A (Max 50MB per file)
                    </p>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-gradient-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileAudio className="h-5 w-5 mr-2" />
                      Uploaded Files ({uploadedFiles.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFiles([])}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-background-secondary rounded-lg border border-border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(file.status)}
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(file.size)}</span>
                                {file.duration && (
                                  <span>• {Math.round(file.duration)}s</span>
                                )}
                                {file.phoneme && (
                                  <Badge variant="outline" className="text-xs">
                                    /{file.phoneme}/
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {file.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => playFile(file)}
                                className="p-2"
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="p-2 text-destructive hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <div className="space-y-2">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {file.status === 'uploading' ? 'Uploading...' : 'Processing...'} {Math.round(file.progress)}%
                            </p>
                          </div>
                        )}

                        {/* Phoneme Assignment */}
                        {file.status === 'completed' && !file.phoneme && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="Enter phoneme (e.g., /a/, /b/, /ch/)"
                                value={phonemeLabel}
                                onChange={(e) => setPhonemeLabel(e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => assignPhoneme(file.id)}
                                size="sm"
                                disabled={!phonemeLabel.trim()}
                              >
                                Assign
                              </Button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Instructions & Tips */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">File Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Audio files only (MP3, WAV, OGG, M4A)</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Clear audio quality recommended</li>
                    <li>• Mono or stereo channels supported</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Phoneme Labeling:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use IPA notation when possible</li>
                    <li>• Common examples: /a/, /e/, /i/, /o/, /u/</li>
                    <li>• Consonants: /p/, /b/, /t/, /d/, /k/, /g/</li>
                    <li>• Each file should contain one phoneme</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>Voice Profile Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profile-description">Description</Label>
                  <Textarea
                    id="profile-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this voice profile..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-primary shadow-glow"
                  disabled={uploadedFiles.filter(f => f.status === 'completed' && f.phoneme).length < 5}
                >
                  Create Voice Profile
                </Button>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    You need at least 5 labeled phoneme samples to create a voice profile.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};