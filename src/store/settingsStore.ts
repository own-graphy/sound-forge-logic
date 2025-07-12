import { create } from 'zustand';
import { AppSettings } from '../types';

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultLanguage: 'en-US',
  outputFormat: 'mp3',
  autoPlay: true,
  showWaveform: true,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
  
  resetSettings: () => set({ settings: defaultSettings }),
}));