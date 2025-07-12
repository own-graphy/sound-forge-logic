export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
  accent?: string;
  isCustom?: boolean;
  previewUrl?: string;
  description?: string;
}

export interface AudioSettings {
  pitch: number; // -100 to 100
  speed: number; // 0.25 to 4.0
  volume: number; // 0 to 100
  stability: number; // 0 to 100
  clarity: number; // 0 to 100
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voiceId: string;
  settings: AudioSettings;
  audioUrl: string;
  duration: number;
  createdAt: Date;
}

export interface VoiceCloneData {
  id: string;
  name: string;
  description?: string;
  phonemeMap: Record<string, AudioClip>;
  samples: AudioSample[];
  createdAt: Date;
}

export interface AudioClip {
  start: number;
  end: number;
  audioFile: string;
  phoneme: string;
}

export interface AudioSample {
  id: string;
  filename: string;
  duration: number;
  quality: 'low' | 'medium' | 'high';
  uploadedAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultLanguage: string;
  outputFormat: 'mp3' | 'wav';
  autoPlay: boolean;
  showWaveform: boolean;
}