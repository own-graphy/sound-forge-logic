import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useVoiceStore } from '@/store/voiceStore';

export const SpeedSlider: React.FC = () => {
  const { audioSettings, updateAudioSettings } = useVoiceStore();

  const handleSpeedChange = (value: number[]) => {
    updateAudioSettings({ speed: value[0] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Speed</Label>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {audioSettings.speed.toFixed(1)}x
        </span>
      </div>
      
      <div className="relative">
        <Slider
          value={[audioSettings.speed]}
          onValueChange={handleSpeedChange}
          min={0.25}
          max={4.0}
          step={0.05}
          className="w-full"
        />
        
        {/* Visual feedback */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: audioSettings.speed !== 1.0 ? 1 : 0,
            scale: audioSettings.speed !== 1.0 ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded shadow-glow">
            {audioSettings.speed > 1.0 ? 'Faster' : audioSettings.speed < 1.0 ? 'Slower' : 'Normal'}
          </div>
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0.25x</span>
        <span>1.0x</span>
        <span>4.0x</span>
      </div>
    </div>
  );
};