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
  
  // Actions
  setVoices: (voices: Voice[]) => void;
  setSelectedVoice: (voice: Voice) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  addGeneratedAudio: (audio: GeneratedAudio) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentAudio: (audio: GeneratedAudio | null) => void;
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
  {
    id: 'voice-1',
    name: 'Sarah',
    gender: 'female',
    language: 'en-US',
    accent: 'American',
    description: 'Professional, clear female voice'
  },
  {
    id: 'voice-2',
    name: 'James',
    gender: 'male',
    language: 'en-US',
    accent: 'American',
    description: 'Deep, authoritative male voice'
  },
  {
    id: 'voice-3',
    name: 'Emma',
    gender: 'female',
    language: 'en-GB',
    accent: 'British',
    description: 'Elegant British female voice'
  },
  {
    id: 'voice-4',
    name: 'Oliver',
    gender: 'male',
    language: 'en-GB',
    accent: 'British',
    description: 'Sophisticated British male voice'
  },
];

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  voices: defaultVoices,
  selectedVoice: defaultVoices[0],
  audioSettings: defaultAudioSettings,
  generatedAudios: [],
  isGenerating: false,
  currentAudio: null,

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
  
  clearHistory: () => set({ generatedAudios: [] }),
}));