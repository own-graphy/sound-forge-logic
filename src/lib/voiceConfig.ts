export interface VoiceConfig {
  basePitch: number;
  pitchRange: number;
  speechRateWPM: number;
  syllablesPerSecond: number;
  timbreLowpass: number;
  formants: [number, number, number];
  loudness: number;
  hnr: number;
  resonance: 'chest' | 'head' | 'mixed';
  jitter: number;
  shimmer: number;
  prosodyPitchFluctuation: number;
  dynamicRange: [number, number];
  gender: 'male' | 'female' | 'neutral';
  type: string;
}

export const DefaultVoice: VoiceConfig = {
  basePitch: 165,
  pitchRange: 20,
  speechRateWPM: 150,
  syllablesPerSecond: 4.75,
  timbreLowpass: 3500,
  formants: [550, 1700, 2600],
  loudness: 72,
  hnr: 20,
  resonance: 'chest',
  jitter: 0.006,
  shimmer: 0.035,
  prosodyPitchFluctuation: 25,
  dynamicRange: [60, 80],
  gender: 'female',
  type: 'low-alto',
};

export const VoiceProfiles: Record<string, VoiceConfig> = {
  'female-alto': {
    ...DefaultVoice,
    basePitch: 165,
    formants: [550, 1700, 2600],
    gender: 'female',
    type: 'alto',
  },
  'female-soprano': {
    ...DefaultVoice,
    basePitch: 220,
    formants: [650, 1850, 2900],
    gender: 'female',
    type: 'soprano',
  },
  'male-bass': {
    ...DefaultVoice,
    basePitch: 110,
    formants: [450, 1200, 2400],
    gender: 'male',
    type: 'bass',
  },
  'male-tenor': {
    ...DefaultVoice,
    basePitch: 140,
    formants: [500, 1400, 2500],
    gender: 'male',
    type: 'tenor',
  },
};