import { useState, useCallback } from 'react';
import { useVoiceStore } from '../store/voiceStore';
import { GeneratedAudio } from '../types';
import { VoiceSynthesizer, voiceProfiles } from '../lib/voiceSynthesizer';

export const useVoiceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synthesizer] = useState(() => new VoiceSynthesizer());
  
  const { selectedVoice, audioSettings, addGeneratedAudio } = useVoiceStore();

  const generateSpeech = useCallback(async (text: string): Promise<GeneratedAudio | null> => {
    if (!selectedVoice || !text.trim()) {
      setError('Please select a voice and enter text');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Find the voice profile
      const voiceProfile = voiceProfiles.find(v => v.id === selectedVoice.id) || voiceProfiles[0];
      
      // Generate speech using the voice synthesizer
      const audioUrl = await synthesizer.synthesizeText(text.trim(), voiceProfile, {
        pitch: audioSettings.pitch,
        speed: audioSettings.speed,
        volume: audioSettings.volume,
      });
      
      const generatedAudio: GeneratedAudio = {
        id: `audio_${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoice.id,
        settings: { ...audioSettings },
        audioUrl,
        duration: estimateDuration(text),
        createdAt: new Date(),
      };

      addGeneratedAudio(generatedAudio);
      return generatedAudio;
      
    } catch (err) {
      console.error('Speech generation error:', err);
      setError('Failed to generate speech. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [selectedVoice, audioSettings, addGeneratedAudio, synthesizer]);

  const generatePreview = useCallback(async (text: string, voiceId: string) => {
    // Generate a short preview without saving to history
    setIsGenerating(true);
    setError(null);

    try {
      const voiceProfile = voiceProfiles.find(v => v.id === voiceId) || voiceProfiles[0];
      const previewText = text.substring(0, 50);
      
      const audioUrl = await synthesizer.synthesizeText(previewText, voiceProfile, {
        pitch: audioSettings.pitch,
        speed: audioSettings.speed,
        volume: audioSettings.volume,
      });
      
      return audioUrl;
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Failed to generate preview');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [synthesizer, audioSettings]);

  return {
    generateSpeech,
    generatePreview,
    isGenerating,
    error,
    clearError: () => setError(null),
  };
};

const estimateDuration = (text: string): number => {
  // Rough estimation: average reading speed is ~150 words per minute
  const wordCount = text.split(/\s+/).length;
  return (wordCount / 150) * 60; // Convert to seconds
};