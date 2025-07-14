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

// Available bit rates for audio export
export const BitRates = {
  low: 64000,    // 64 kbps
  medium: 128000, // 128 kbps
  high: 192000,  // 192 kbps
  ultra: 320000  // 320 kbps
};

export const VoiceProfiles: Record<string, VoiceConfig> = {
  // English Voices
  'sarah-en': {
    ...DefaultVoice,
    basePitch: 185,
    formants: [580, 1750, 2650],
    gender: 'female',
    type: 'English Female - Sarah',
    loudness: 78,
    jitter: 0.004,
    shimmer: 0.025,
  },
  'emma-en': {
    ...DefaultVoice,
    basePitch: 210,
    formants: [620, 1880, 2800],
    gender: 'female',
    type: 'English Female - Emma',
    loudness: 75,
    jitter: 0.005,
    shimmer: 0.030,
  },
  'david-en': {
    ...DefaultVoice,
    basePitch: 120,
    formants: [480, 1350, 2450],
    gender: 'male',
    type: 'English Male - David',
    loudness: 80,
    jitter: 0.008,
    shimmer: 0.040,
  },
  'michael-en': {
    ...DefaultVoice,
    basePitch: 135,
    formants: [520, 1450, 2550],
    gender: 'male',
    type: 'English Male - Michael',
    loudness: 82,
    jitter: 0.006,
    shimmer: 0.035,
  },
  
  // Hindi Voices
  'priya-hi': {
    ...DefaultVoice,
    basePitch: 195,
    formants: [600, 1800, 2700],
    gender: 'female',
    type: 'Hindi Female - Priya',
    loudness: 76,
    jitter: 0.005,
    shimmer: 0.028,
    syllablesPerSecond: 4.2, // Slightly slower for Hindi
  },
  'kavya-hi': {
    ...DefaultVoice,
    basePitch: 175,
    formants: [560, 1720, 2620],
    gender: 'female',
    type: 'Hindi Female - Kavya',
    loudness: 74,
    jitter: 0.004,
    shimmer: 0.032,
    syllablesPerSecond: 4.0,
  },
  'arjun-hi': {
    ...DefaultVoice,
    basePitch: 115,
    formants: [460, 1300, 2400],
    gender: 'male',
    type: 'Hindi Male - Arjun',
    loudness: 78,
    jitter: 0.007,
    shimmer: 0.038,
    syllablesPerSecond: 4.3,
  },
  'rohit-hi': {
    ...DefaultVoice,
    basePitch: 130,
    formants: [500, 1400, 2480],
    gender: 'male',
    type: 'Hindi Male - Rohit',
    loudness: 81,
    jitter: 0.009,
    shimmer: 0.042,
    syllablesPerSecond: 4.1,
  },
};