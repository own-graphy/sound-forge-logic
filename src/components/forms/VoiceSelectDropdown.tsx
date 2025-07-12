import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Play, User, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useVoiceStore } from '@/store/voiceStore';
import { useVoiceGenerator } from '@/hooks/useVoiceGenerator';
import { Voice } from '@/types';

export const VoiceSelectDropdown: React.FC = () => {
  const { voices, selectedVoice, setSelectedVoice } = useVoiceStore();
  const { generatePreview, isGenerating } = useVoiceGenerator();

  const handleVoiceChange = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  const handlePreviewVoice = async (voice: Voice) => {
    const previewText = "Hello, this is a preview of my voice.";
    const audioUrl = await generatePreview(previewText, voice.id);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getVoiceIcon = (voice: Voice) => {
    if (voice.gender === 'female') return '👩';
    if (voice.gender === 'male') return '👨';
    return '🤖';
  };

  const getAccentFlag = (accent: string) => {
    switch (accent) {
      case 'American': return '🇺🇸';
      case 'British': return '🇬🇧';
      case 'Australian': return '🇦🇺';
      case 'Canadian': return '🇨🇦';
      default: return '🌍';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground">
          Voice Selection
        </Label>
        <Badge variant="secondary" className="text-xs">
          {voices.length} voices available
        </Badge>
      </div>

      {/* Current Selection Preview */}
      {selectedVoice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-card rounded-lg border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {getVoiceIcon(selectedVoice)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{selectedVoice.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{getAccentFlag(selectedVoice.accent || '')} {selectedVoice.accent}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedVoice.gender}
                  </Badge>
                </div>
                {selectedVoice.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedVoice.description}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePreviewVoice(selectedVoice)}
              disabled={isGenerating}
              className="p-2"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Voice Selector */}
      <Select value={selectedVoice?.id} onValueChange={handleVoiceChange}>
        <SelectTrigger className="w-full bg-card border-border hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Select a voice">
            {selectedVoice && (
              <div className="flex items-center space-x-2">
                <span>{getVoiceIcon(selectedVoice)}</span>
                <span>{selectedVoice.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedVoice.accent}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="bg-popover border-border">
          {/* Group by gender */}
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Female Voices
            </div>
            {voices.filter(voice => voice.gender === 'female').map((voice) => (
              <SelectItem key={voice.id} value={voice.id} className="mb-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span>{getVoiceIcon(voice)}</span>
                    <span>{voice.name}</span>
                    <span className="text-xs">{getAccentFlag(voice.accent || '')}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewVoice(voice);
                    }}
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                {voice.description && (
                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                    {voice.description}
                  </p>
                )}
              </SelectItem>
            ))}
          </div>
          
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
              <User className="h-3 w-3 mr-1" />
              Male Voices
            </div>
            {voices.filter(voice => voice.gender === 'male').map((voice) => (
              <SelectItem key={voice.id} value={voice.id} className="mb-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span>{getVoiceIcon(voice)}</span>
                    <span>{voice.name}</span>
                    <span className="text-xs">{getAccentFlag(voice.accent || '')}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewVoice(voice);
                    }}
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                {voice.description && (
                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                    {voice.description}
                  </p>
                )}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </motion.div>
  );
};