export interface VoiceProfile {
  id: string;
  name: string;
  language: 'hindi' | 'english';
  gender: 'male' | 'female';
  pitch: number;
  formantShift: number;
  speed: number;
  breathiness: number;
  roughness: number;
  description?: string;
}

export const voiceProfiles: VoiceProfile[] = [
  {
    id: 'sarah-en',
    name: 'Sarah (English)',
    language: 'english',
    gender: 'female',
    pitch: 180,
    formantShift: 1.1,
    speed: 1.0,
    breathiness: 0.1,
    roughness: 0.05,
    description: 'Clear, professional female English voice'
  },
  {
    id: 'michael-en',
    name: 'Michael (English)',
    language: 'english',
    gender: 'male',
    pitch: 120,
    formantShift: 0.9,
    speed: 1.0,
    breathiness: 0.05,
    roughness: 0.08,
    description: 'Deep, confident male English voice'
  },
  {
    id: 'emma-en',
    name: 'Emma (English)',
    language: 'english',
    gender: 'female',
    pitch: 200,
    formantShift: 1.2,
    speed: 1.1,
    breathiness: 0.12,
    roughness: 0.03,
    description: 'Bright, energetic female English voice'
  },
  {
    id: 'priya-hi',
    name: 'प्रिया (Hindi)',
    language: 'hindi',
    gender: 'female',
    pitch: 190,
    formantShift: 1.15,
    speed: 0.95,
    breathiness: 0.08,
    roughness: 0.04,
    description: 'Melodious female Hindi voice'
  },
  {
    id: 'arjun-hi',
    name: 'अर्जुन (Hindi)',
    language: 'hindi',
    gender: 'male',
    pitch: 110,
    formantShift: 0.85,
    speed: 1.0,
    breathiness: 0.06,
    roughness: 0.09,
    description: 'Strong, authoritative male Hindi voice'
  },
  {
    id: 'raj-hi',
    name: 'राज (Hindi)',
    language: 'hindi',
    gender: 'male',
    pitch: 100,
    formantShift: 0.8,
    speed: 0.9,
    breathiness: 0.04,
    roughness: 0.1,
    description: 'Deep, traditional male Hindi voice'
  },
];