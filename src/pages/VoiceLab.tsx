import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Save, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const scriptSentences = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "She sells seashells by the seashore while the waves crash loudly.",
  "Peter Piper picked a peck of pickled peppers from the garden.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "The early bird catches the worm before the sun rises in the morning.",
  "A journey of a thousand miles begins with a single step forward.",
  "Technology is advancing rapidly in artificial intelligence and machine learning.",
  "Communication bridges gaps between people from different cultures worldwide.",
  "Innovation drives progress and creates opportunities for future generations.",
  "Collaboration and teamwork lead to successful outcomes in any project."
];

export const VoiceLab: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [recordedSamples, setRecordedSamples] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Simulate recording progress
      const interval = setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            stopRecording();
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record your voice.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingProgress(0);
    
    // Add completed sentence to recorded samples
    if (!recordedSamples.includes(currentSentence)) {
      setRecordedSamples(prev => [...prev, currentSentence]);
    }
    
    // Move to next sentence
    if (currentSentence < scriptSentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
    }
    
    // Use setTimeout to avoid state update during render
    setTimeout(() => {
      toast({
        title: "Recording Complete",
        description: `Sentence ${currentSentence + 1} recorded successfully!`,
      });
    }, 0);
  };

  const playbackRecording = (index: number) => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const deleteRecording = (index: number) => {
    setRecordedSamples(prev => prev.filter(i => i !== index));
    toast({
      title: "Recording Deleted",
      description: "Recording has been removed from your voice profile.",
    });
  };

  const saveVoiceProfile = () => {
    if (!voiceName.trim()) {
      toast({
        title: "Voice Name Required",
        description: "Please enter a name for your voice profile.",
        variant: "destructive",
      });
      return;
    }

    if (recordedSamples.length < 5) {
      toast({
        title: "More Recordings Needed",
        description: "Please record at least 5 sentences for better voice quality.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Voice Profile Saved!",
      description: `"${voiceName}" has been added to your voice library.`,
    });
  };

  const completionPercentage = (recordedSamples.length / scriptSentences.length) * 100;

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
            Voice Cloning Lab
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create your custom voice by recording the provided script. 
            Read each sentence clearly and naturally for the best results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recording Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-success" />
                  Recording Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {recordedSamples.length} of {scriptSentences.length} sentences completed
                    </span>
                    <Badge variant={completionPercentage >= 50 ? "default" : "secondary"}>
                      {Math.round(completionPercentage)}%
                    </Badge>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Current Sentence */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Mic className="h-5 w-5 mr-2" />
                    Sentence {currentSentence + 1} of {scriptSentences.length}
                  </span>
                  {recordedSamples.includes(currentSentence) && (
                    <Badge variant="default" className="bg-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Recorded
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Script Text */}
                <div className="p-4 bg-background-secondary rounded-lg border border-border">
                  <p className="text-lg leading-relaxed">
                    "{scriptSentences[currentSentence]}"
                  </p>
                </div>

                {/* Recording Controls */}
                <div className="flex flex-col items-center space-y-4">
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full"
                    >
                      <Progress value={recordingProgress} className="h-3" />
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Recording... {Math.round(recordingProgress)}%
                      </p>
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isRecording && recordingProgress < 100}
                      className={`
                        px-8 py-4 text-lg font-medium
                        ${isRecording 
                          ? 'bg-destructive hover:bg-destructive/90' 
                          : 'bg-gradient-primary hover:bg-primary-dark'
                        } shadow-glow
                      `}
                    >
                      <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isRecording ? (
                          <>
                            <Square className="h-5 w-5" />
                            <span>Stop Recording</span>
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5" />
                            <span>Start Recording</span>
                          </>
                        )}
                      </motion.div>
                    </Button>

                    {recordedSamples.includes(currentSentence) && (
                      <Button
                        variant="ghost"
                        onClick={() => playbackRecording(currentSentence)}
                        disabled={isPlaying}
                        className="p-3"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                    disabled={currentSentence === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSentence(Math.min(scriptSentences.length - 1, currentSentence + 1))}
                    disabled={currentSentence === scriptSentences.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recording Tips:</strong> Speak clearly and naturally, avoid background noise, 
                maintain consistent distance from microphone, and read at a comfortable pace.
              </AlertDescription>
            </Alert>
          </div>

          {/* Voice Profile Setup */}
          <div className="space-y-6">
            {/* Voice Details */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>Voice Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="voice-name">Voice Name</Label>
                  <Input
                    id="voice-name"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="My Custom Voice"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="voice-description">Description (Optional)</Label>
                  <Textarea
                    id="voice-description"
                    value={voiceDescription}
                    onChange={(e) => setVoiceDescription(e.target.value)}
                    placeholder="Describe the voice characteristics..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={saveVoiceProfile}
                  disabled={!voiceName.trim() || recordedSamples.length < 3}
                  className="w-full bg-gradient-primary shadow-glow"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Voice Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recorded Samples */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>Recorded Samples</CardTitle>
              </CardHeader>
              <CardContent>
                {recordedSamples.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recordings yet</p>
                    <p className="text-sm">Start recording to see samples here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recordedSamples.map((sentenceIndex) => (
                      <motion.div
                        key={sentenceIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Sentence {sentenceIndex + 1}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {scriptSentences[sentenceIndex].substring(0, 40)}...
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playbackRecording(sentenceIndex)}
                            className="p-2"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRecording(sentenceIndex)}
                            className="p-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};