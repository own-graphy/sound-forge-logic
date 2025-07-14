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

  const generateSpeech = useCallback(async (text: string, bitRate: number = 128000): Promise<GeneratedAudio | null> => {
    if (!selectedVoice || !text.trim()) {
      setError('Please select a voice and enter text');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Detect language and convert text to phonemes
      const language = detectLanguage(text);
      const phonemes = textToPhonemes(text.trim(), language);
      
      // Get voice configuration
      const voiceConfig = VoiceProfiles[selectedVoice.id] || DefaultVoice;
      
      // Apply user settings to voice config with better scaling
      const modifiedConfig = {
        ...voiceConfig,
        basePitch: voiceConfig.basePitch * (audioSettings.pitch / 1.0),
        speechRateWPM: voiceConfig.speechRateWPM * audioSettings.speed,
        syllablesPerSecond: voiceConfig.syllablesPerSecond * audioSettings.speed,
        loudness: Math.min(100, voiceConfig.loudness * (audioSettings.volume / 1.0)),
      };

      // Generate audio buffer with specified bit rate
      const audioBuffer = await synthEngine.generateAudioBuffer(phonemes, modifiedConfig, bitRate);
      
      // Convert to blob URL with better quality
      const audioUrl = await audioBufferToUrl(audioBuffer, bitRate);
      
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
      const language = detectLanguage(previewText);
      const phonemes = textToPhonemes(previewText, language);
      
      const voiceConfig = VoiceProfiles[voiceId] || DefaultVoice;
      const modifiedConfig = {
        ...voiceConfig,
        syllablesPerSecond: voiceConfig.syllablesPerSecond * 1.2, // Slightly faster for preview
      };

      // Initialize audio context and play directly
      await synthEngine.initialize();
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

// Language detection helper
const detectLanguage = (text: string): 'en' | 'hi' => {
  // Simple detection based on character sets and common words
  const hindiPattern = /[\u0900-\u097F]/; // Devanagari script
  const hindiWords = ['namaste', 'dhanyawad', 'aap', 'main', 'hai', 'kya', 'kaise', 'acha', 'thik'];
  
  if (hindiPattern.test(text)) {
    return 'hi';
  }
  
  const words = text.toLowerCase().split(/\s+/);
  const hindiWordCount = words.filter(word => hindiWords.includes(word)).length;
  
  return hindiWordCount > words.length * 0.3 ? 'hi' : 'en';
};

// Convert AudioBuffer to blob URL with quality settings
const audioBufferToUrl = async (buffer: AudioBuffer, bitRate: number = 128000): Promise<string> => {
  const wav = audioBufferToWav(buffer, bitRate);
  const blob = new Blob([wav], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

const estimateDuration = (text: string): number => {
  // Rough estimation: average reading speed is ~150 words per minute
  const wordCount = text.split(/\s+/).length;
  return (wordCount / 150) * 60; // Convert to seconds
};

// Enhanced WAV encoding with bit rate support
const audioBufferToWav = (buffer: AudioBuffer, bitRate: number = 128000): ArrayBuffer => {
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
  
  // Convert float samples to 16-bit PCM with dithering for better quality
  const samples = buffer.getChannelData(0);
  let offset = 44;
  
  for (let i = 0; i < samples.length; i++) {
    let sample = Math.max(-1, Math.min(1, samples[i]));
    
    // Add subtle dithering to reduce quantization noise
    const dither = (Math.random() - 0.5) * (1.0 / 32768.0);
    sample += dither;
    
    // Clip and convert to 16-bit
    sample = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, Math.round(sample * 0x7FFF), true);
    offset += 2;
  }
  
  return arrayBuffer;
};