import { useState, useCallback } from 'react';
import { useVoiceStore } from '../store/voiceStore';
import { GeneratedAudio } from '../types';
import { textToPhonemes } from '../lib/textToPhonemes';
import { SynthEngine } from '../lib/synthEngine';
import { VoiceProfiles, DefaultVoice } from '../lib/voiceConfig';

export const useVoiceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synthEngine] = useState(() => new SynthEngine());
  
  const { selectedVoice, audioSettings, addGeneratedAudio } = useVoiceStore();

  const generateSpeech = useCallback(async (text: string): Promise<GeneratedAudio | null> => {
    if (!selectedVoice || !text.trim()) {
      setError('Please select a voice and enter text');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Convert text to phonemes
      const phonemes = textToPhonemes(text.trim());
      
      // Get voice configuration
      const voiceConfig = VoiceProfiles[selectedVoice.id] || DefaultVoice;
      
      // Apply user settings to voice config
      const modifiedConfig = {
        ...voiceConfig,
        basePitch: voiceConfig.basePitch * (audioSettings.pitch / 1.0),
        speechRateWPM: voiceConfig.speechRateWPM * audioSettings.speed,
        syllablesPerSecond: voiceConfig.syllablesPerSecond * audioSettings.speed,
        loudness: voiceConfig.loudness * (audioSettings.volume / 1.0),
      };

      // Generate audio buffer
      const audioBuffer = await synthEngine.generateAudioBuffer(phonemes, modifiedConfig);
      
      // Convert to blob URL
      const audioUrl = await audioBufferToUrl(audioBuffer);
      
      const generatedAudio: GeneratedAudio = {
        id: `audio_${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoice.id,
        settings: { ...audioSettings },
        audioUrl,
        duration: audioBuffer.duration,
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
  }, [selectedVoice, audioSettings, addGeneratedAudio, synthEngine]);

  const generatePreview = useCallback(async (text: string, voiceId: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate short preview (first 50 characters)
      const previewText = text.substring(0, 50);
      const phonemes = textToPhonemes(previewText);
      
      const voiceConfig = VoiceProfiles[voiceId] || DefaultVoice;
      const modifiedConfig = {
        ...voiceConfig,
        syllablesPerSecond: voiceConfig.syllablesPerSecond * 1.2, // Slightly faster for preview
      };

      // Play directly without creating audio buffer
      await synthEngine.generateSequence(phonemes, modifiedConfig);
      
      return 'preview-played'; // Indicate success
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Failed to generate preview');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [synthEngine]);

  return {
    generateSpeech,
    generatePreview,
    isGenerating,
    error,
    clearError: () => setError(null),
  };
};

// Convert AudioBuffer to blob URL
const audioBufferToUrl = async (buffer: AudioBuffer): Promise<string> => {
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

const estimateDuration = (text: string): number => {
  // Rough estimation: average reading speed is ~150 words per minute
  const wordCount = text.split(/\s+/).length;
  return (wordCount / 150) * 60; // Convert to seconds
};

// Simple WAV encoding (for demo purposes)
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  const samples = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return arrayBuffer;
};