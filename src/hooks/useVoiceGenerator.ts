import { useState, useCallback } from 'react';
import { useVoiceStore } from '../store/voiceStore';
import { GeneratedAudio } from '../types';

export const useVoiceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { selectedVoice, audioSettings, addGeneratedAudio } = useVoiceStore();

  const generateSpeech = useCallback(async (text: string): Promise<GeneratedAudio | null> => {
    if (!selectedVoice || !text.trim()) {
      setError('Please select a voice and enter text');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate API call - replace with actual TTS implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock audio blob URL (in real implementation, this would be from your TTS service)
      const mockAudioUrl = createMockAudio(text);
      
      const generatedAudio: GeneratedAudio = {
        id: `audio_${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoice.id,
        settings: { ...audioSettings },
        audioUrl: mockAudioUrl,
        duration: estimateDuration(text),
        createdAt: new Date(),
      };

      addGeneratedAudio(generatedAudio);
      return generatedAudio;
      
    } catch (err) {
      setError('Failed to generate speech. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [selectedVoice, audioSettings, addGeneratedAudio]);

  const generatePreview = useCallback(async (text: string, voiceId: string) => {
    // Generate a short preview without saving to history
    setIsGenerating(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAudioUrl = createMockAudio(text.substring(0, 50));
      return mockAudioUrl;
    } catch (err) {
      setError('Failed to generate preview');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateSpeech,
    generatePreview,
    isGenerating,
    error,
    clearError: () => setError(null),
  };
};

// Mock audio generation (replace with actual TTS implementation)
const createMockAudio = (text: string): string => {
  // Create a simple oscillator-based audio for demo purposes
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const duration = Math.min(text.length * 0.1, 30); // Max 30 seconds
  
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    // Generate speech-like patterns
    const frequency = 100 + Math.sin(i * 0.01) * 50; // Varying frequency
    const amplitude = 0.1 * Math.sin(i * 0.001); // Varying amplitude
    data[i] = amplitude * Math.sin(frequency * i / audioContext.sampleRate * 2 * Math.PI);
  }
  
  // Convert to blob URL
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