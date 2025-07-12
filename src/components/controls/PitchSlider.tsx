import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useVoiceStore } from '@/store/voiceStore';

export const PitchSlider: React.FC = () => {
  const { audioSettings, updateAudioSettings } = useVoiceStore();

  const handlePitchChange = (value: number[]) => {
    updateAudioSettings({ pitch: value[0] });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">Pitch</Label>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {audioSettings.pitch > 0 ? '+' : ''}{audioSettings.pitch}
        </span>
      </div>
      
      <div className="relative">
        <Slider
          value={[audioSettings.pitch]}
          onValueChange={handlePitchChange}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
        
        {/* Visual feedback */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: audioSettings.pitch !== 0 ? 1 : 0,
            scale: audioSettings.pitch !== 0 ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-glow">
            {audioSettings.pitch > 0 ? 'Higher' : audioSettings.pitch < 0 ? 'Lower' : 'Normal'}
          </div>
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Lower</span>
        <span>Normal</span>
        <span>Higher</span>
      </div>
    </div>
  );
};