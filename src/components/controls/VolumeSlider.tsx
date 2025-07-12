import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useVoiceStore } from '@/store/voiceStore';

export const VolumeSlider: React.FC = () => {
  const { audioSettings, updateAudioSettings } = useVoiceStore();

  const handleVolumeChange = (value: number[]) => {
    updateAudioSettings({ volume: value[0] });
  };

  const toggleMute = () => {
    updateAudioSettings({ volume: audioSettings.volume === 0 ? 80 : 0 });
  };

  const getVolumeIcon = () => {
    if (audioSettings.volume === 0) return VolumeX;
    if (audioSettings.volume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Volume</Label>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {audioSettings.volume}%
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="p-2 h-auto"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <VolumeIcon className="h-4 w-4" />
          </motion.div>
        </Button>
        
        <div className="flex-1 relative">
          <Slider
            value={[audioSettings.volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          
          {/* Volume level indicator */}
          <motion.div
            className="absolute -top-8 pointer-events-none"
            style={{ left: `${audioSettings.volume}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: audioSettings.volume !== 80 ? 1 : 0,
              scale: audioSettings.volume !== 80 ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-success text-white text-xs px-2 py-1 rounded shadow-glow transform -translate-x-1/2">
              {audioSettings.volume}%
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Mute</span>
        <span>Loud</span>
      </div>
    </div>
  );
};