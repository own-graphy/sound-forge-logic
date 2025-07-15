import { create } from 'zustand';
import { Voice, AudioSettings, GeneratedAudio } from '../types';
import { voiceProfiles } from '../lib/voiceProfiles';

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

const defaultVoices: Voice[] = voiceProfiles.map(profile => ({
  id: profile.id,
  name: profile.name,
  gender: profile.gender,
  language: profile.language === 'hindi' ? 'hi-IN' : 'en-US',
  accent: profile.language === 'hindi' ? 'Indian' : 'American',
  description: `${profile.gender === 'female' ? 'Female' : 'Male'} ${profile.language} voice`
}));

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