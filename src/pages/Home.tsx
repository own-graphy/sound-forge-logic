import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, History, Download } from 'lucide-react';
import { TextInputArea } from '@/components/forms/TextInputArea';
import { VoiceSelectDropdown } from '@/components/forms/VoiceSelectDropdown';
import { PitchSlider } from '@/components/controls/PitchSlider';
import { SpeedSlider } from '@/components/controls/SpeedSlider';
import { VolumeSlider } from '@/components/controls/VolumeSlider';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useVoiceStore } from '@/store/voiceStore';
import { useVoiceGenerator } from '@/hooks/useVoiceGenerator';
import { useToast } from '@/hooks/use-toast';

export const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const { 
    generatedAudios, 
    currentAudio, 
    setCurrentAudio,
    clearHistory 
  } = useVoiceStore();
  const { generateSpeech, isGenerating, error } = useVoiceGenerator();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    const audio = await generateSpeech(inputText);
    if (audio) {
      setCurrentAudio(audio);
      toast({
        title: "Speech Generated!",
        description: "Your audio is ready to play.",
      });
    } else if (error) {
      toast({
        title: "Generation Failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const downloadAll = () => {
    generatedAudios.forEach((audio, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = audio.audioUrl;
        link.download = `voiceforge-batch-${index + 1}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative">
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              Transform Text to Voice
            </motion.h1>
            <motion.div
              className="absolute -top-4 -right-4 text-accent"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create natural-sounding speech from text with our advanced voice synthesis technology.
            Choose from multiple voices and customize every aspect of the audio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardContent className="p-6">
                <TextInputArea
                  value={inputText}
                  onChange={setInputText}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>

            {/* Voice & Audio Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border shadow-lg">
                <CardContent className="p-6">
                  <VoiceSelectDropdown />
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Audio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PitchSlider />
                  <SpeedSlider />
                  <VolumeSlider />
                </CardContent>
              </Card>
            </div>

            {/* Current Audio Player */}
            {currentAudio && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-card border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Generated Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AudioPlayer audio={currentAudio} autoPlay />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    History
                  </CardTitle>
                  {generatedAudios.length > 0 && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadAll}
                        className="p-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="p-2 text-destructive hover:text-destructive"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {generatedAudios.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <History className="h-8 w-8" />
                    </div>
                    <p>No generated audio yet</p>
                    <p className="text-sm mt-1">Create your first voice to see it here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3 p-4">
                      {generatedAudios.map((audio, index) => (
                        <motion.div
                          key={audio.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            currentAudio?.id === audio.id
                              ? 'bg-primary/10 border-primary shadow-glow'
                              : 'bg-background-secondary border-border hover:border-primary/50'
                          }`}
                          onClick={() => setCurrentAudio(audio)}
                        >
                          <div className="space-y-2">
                            <p className="text-sm font-medium truncate">
                              {audio.text.length > 40 
                                ? `${audio.text.substring(0, 40)}...` 
                                : audio.text
                              }
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{audio.voiceId}</span>
                              <span>{new Date(audio.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};