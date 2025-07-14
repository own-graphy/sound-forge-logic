import { create } from 'zustand';
import { Voice, AudioSettings, GeneratedAudio } from '../types';

interface VoiceStore {
  // State
  voices: Voice[];
  selectedVoice: Voice | null;
  audioSettings: AudioSettings;
  generatedAudios: GeneratedAudio[];
  isGenerating: boolean;
  currentAudio: GeneratedAudio | null;
  selectedBitRate: number;
  
  // Actions
  setVoices: (voices: Voice[]) => void;
  setSelectedVoice: (voice: Voice) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  addGeneratedAudio: (audio: GeneratedAudio) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentAudio: (audio: GeneratedAudio | null) => void;
  setSelectedBitRate: (bitRate: number) => void;
  clearHistory: () => void;
}

const defaultAudioSettings: AudioSettings = {
  pitch: 0,
  speed: 1.0,
  volume: 80,
  stability: 75,
  clarity: 85,
};

const defaultVoices: Voice[] = [
  // English Voices
  {
    id: 'sarah-en',
    name: 'Sarah',
    gender: 'female',
    language: 'en-US',
    accent: 'American',
    description: 'Professional, clear female voice'
  },
  {
    id: 'emma-en',
    name: 'Emma',
    gender: 'female',
    language: 'en-US',
    accent: 'American',
    description: 'Warm, friendly female voice'
  },
  {
    id: 'david-en',
    name: 'David',
    gender: 'male',
    language: 'en-US',
    accent: 'American',
    description: 'Deep, authoritative male voice'
  },
  {
    id: 'michael-en',
    name: 'Michael',
    gender: 'male',
    language: 'en-US',
    accent: 'American',
    description: 'Natural, conversational male voice'
  },
  
  // Hindi Voices
  {
    id: 'priya-hi',
    name: 'Priya',
    gender: 'female',
    language: 'hi-IN',
    accent: 'Indian',
    description: 'Clear, melodious Hindi female voice'
  },
  {
    id: 'kavya-hi',
    name: 'Kavya',
    gender: 'female',
    language: 'hi-IN',
    accent: 'Indian',
    description: 'Soft, expressive Hindi female voice'
  },
  {
    id: 'arjun-hi',
    name: 'Arjun',
    gender: 'male',
    language: 'hi-IN',
    accent: 'Indian',
    description: 'Strong, confident Hindi male voice'
  },
  {
    id: 'rohit-hi',
    name: 'Rohit',
    gender: 'male',
    language: 'hi-IN',
    accent: 'Indian',
    description: 'Smooth, professional Hindi male voice'
  },
];

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  voices: defaultVoices,
  selectedVoice: defaultVoices[0],
  audioSettings: defaultAudioSettings,
  generatedAudios: [],
  isGenerating: false,
  currentAudio: null,
  selectedBitRate: 128000, // Default to medium quality

  setVoices: (voices) => set({ voices }),
  
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  
  updateAudioSettings: (settings) => 
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings }
    })),
  
  addGeneratedAudio: (audio) =>
    set((state) => ({
      generatedAudios: [audio, ...state.generatedAudios]
    })),
  
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  
  setSelectedBitRate: (bitRate) => set({ selectedBitRate: bitRate }),
  
  clearHistory: () => set({ generatedAudios: [] }),
}));