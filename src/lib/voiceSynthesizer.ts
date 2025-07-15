// Advanced voice synthesis engine using phoneme-based generation

import { PhonemeData, textToPhonemes } from './phonemeLibrary';

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
  },
];

export class VoiceSynthesizer {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.compressor = this.audioContext.createDynamicsCompressor();
    
    // Set up audio processing chain
    this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
    this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
    this.masterGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);
  }

  async synthesizeText(text: string, voiceProfile: VoiceProfile, settings: {
    pitch: number;
    speed: number;
    volume: number;
  }): Promise<string> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const phonemes = textToPhonemes(text);
    const totalDuration = phonemes.reduce((sum, p) => sum + (p.data.duration * (1 / settings.speed)), 0) / 1000;
    
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      1,
      Math.ceil(this.audioContext.sampleRate * totalDuration),
      this.audioContext.sampleRate
    );

    let currentTime = 0;

    for (const { phoneme, data } of phonemes) {
      if (phoneme === 'PAUSE') {
        currentTime += (data.duration / 1000) * (1 / settings.speed);
        continue;
      }

      const duration = (data.duration / 1000) * (1 / settings.speed);
      await this.synthesizePhoneme(offlineContext, data, voiceProfile, settings, currentTime, duration);
      currentTime += duration;
    }

    const audioBuffer = await offlineContext.startRendering();
    return this.audioBufferToUrl(audioBuffer);
  }

  private async synthesizePhoneme(
    context: OfflineAudioContext,
    phonemeData: PhonemeData,
    voiceProfile: VoiceProfile,
    settings: { pitch: number; speed: number; volume: number },
    startTime: number,
    duration: number
  ): Promise<void> {
    if (!phonemeData.voicing && phonemeData.frequency === 0) return;

    const fundamentalFreq = phonemeData.frequency * (settings.pitch / 100) * (voiceProfile.pitch / 150);
    
    if (phonemeData.voicing) {
      // Voiced sound - use harmonic synthesis
      await this.createVoicedSound(context, phonemeData, voiceProfile, fundamentalFreq, startTime, duration, settings.volume);
    } else {
      // Unvoiced sound - use noise synthesis
      await this.createUnvoicedSound(context, phonemeData, voiceProfile, startTime, duration, settings.volume);
    }
  }

  private async createVoicedSound(
    context: OfflineAudioContext,
    phonemeData: PhonemeData,
    voiceProfile: VoiceProfile,
    fundamentalFreq: number,
    startTime: number,
    duration: number,
    volume: number
  ): Promise<void> {
    // Create multiple harmonics for richer sound
    const harmonics = [1, 2, 3, 4, 5, 6, 7, 8];
    const harmonicAmplitudes = [1.0, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05];

    for (let i = 0; i < harmonics.length; i++) {
      const harmonic = harmonics[i];
      const amplitude = harmonicAmplitudes[i] * phonemeData.amplitude * (volume / 100);
      
      // Create oscillator for this harmonic
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamentalFreq * harmonic, startTime);
      
      // Add slight pitch variation for naturalness
      const pitchVariation = 1 + (Math.random() - 0.5) * 0.02;
      osc.frequency.exponentialRampToValueAtTime(
        fundamentalFreq * harmonic * pitchVariation,
        startTime + duration
      );

      // Create formant filters
      const formantGain = context.createGain();
      formantGain.gain.setValueAtTime(amplitude, startTime);

      // Apply formant filtering
      const formantFilters = this.createFormantFilters(context, phonemeData.formants, voiceProfile.formantShift);
      
      // Create envelope
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(0, startTime);
      envelope.gain.linearRampToValueAtTime(1, startTime + duration * 0.1); // Attack
      envelope.gain.setValueAtTime(1, startTime + duration * 0.8); // Sustain
      envelope.gain.linearRampToValueAtTime(0, startTime + duration); // Release

      // Connect audio graph
      osc.connect(formantFilters[0]);
      formantFilters[0].connect(formantFilters[1]);
      formantFilters[1].connect(formantFilters[2]);
      formantFilters[2].connect(formantGain);
      formantGain.connect(envelope);
      envelope.connect(context.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }
  }

  private async createUnvoicedSound(
    context: OfflineAudioContext,
    phonemeData: PhonemeData,
    voiceProfile: VoiceProfile,
    startTime: number,
    duration: number,
    volume: number
  ): Promise<void> {
    // Create noise source
    const bufferSize = Math.floor(context.sampleRate * duration);
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * phonemeData.amplitude * (volume / 100);
    }

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Filter the noise to match the phoneme characteristics
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(phonemeData.frequency, startTime);
    filter.Q.setValueAtTime(5, startTime);

    // Apply envelope
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(1, startTime + duration * 0.05);
    envelope.gain.setValueAtTime(1, startTime + duration * 0.9);
    envelope.gain.linearRampToValueAtTime(0, startTime + duration);

    noiseSource.connect(filter);
    filter.connect(envelope);
    envelope.connect(context.destination);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  }

  private createFormantFilters(
    context: OfflineAudioContext,
    formants: [number, number, number],
    formantShift: number
  ): BiquadFilterNode[] {
    return formants.map((freq, index) => {
      const filter = context.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(freq * formantShift, context.currentTime);
      filter.Q.setValueAtTime(3 + index, context.currentTime);
      filter.gain.setValueAtTime(6 - index * 2, context.currentTime);
      return filter;
    });
  }

  private audioBufferToUrl(buffer: AudioBuffer): string {
    const wav = this.audioBufferToWav(buffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
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
  }
}