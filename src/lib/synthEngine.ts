import { VoiceConfig } from './voiceConfig';

export interface PhonemeAudioNode {
  oscillator: OscillatorNode;
  gainNode: GainNode;
  filter1: BiquadFilterNode;
  filter2: BiquadFilterNode;
  filter3: BiquadFilterNode;
}

export class SynthEngine {
  private context: AudioContext;
  private masterGain: GainNode;
  
  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
  }

  async initialize() {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  synthesizePhoneme(phoneme: string, config: VoiceConfig, startTime: number, duration: number): PhonemeAudioNode | null {
    if (phoneme === '_PAUSE_') {
      return null; // Silent pause
    }

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    const filter1 = this.context.createBiquadFilter();
    const filter2 = this.context.createBiquadFilter();
    const filter3 = this.context.createBiquadFilter();
    
    // Add reverb for more natural sound
    const convolver = this.context.createConvolver();
    const reverbGain = this.context.createGain();
    reverbGain.gain.setValueAtTime(0.15, startTime); // Subtle reverb

    // Configure oscillator based on phoneme type
    const phonemeConfig = this.getPhonemeConfig(phoneme, config);
    
    oscillator.type = phonemeConfig.type;
    oscillator.frequency.setValueAtTime(phonemeConfig.frequency, startTime);
    
    // Add natural pitch variation (jitter) with smoother transitions
    const jitterAmount = config.jitter * config.basePitch;
    const pitchVariation = (Math.random() - 0.5) * jitterAmount;
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(50, phonemeConfig.frequency + pitchVariation),
      startTime + duration
    );

    // Configure formant filters with better Q values for realism
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(config.formants[0] * phonemeConfig.formantMultiplier, startTime);
    filter1.Q.setValueAtTime(6, startTime); // Higher Q for clearer formants

    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(config.formants[1] * phonemeConfig.formantMultiplier, startTime);
    filter2.Q.setValueAtTime(8, startTime);

    filter3.type = 'bandpass';
    filter3.frequency.setValueAtTime(config.formants[2] * phonemeConfig.formantMultiplier, startTime);
    filter3.Q.setValueAtTime(4, startTime);

    // Improved envelope with more natural attack/release
    const attackTime = phonemeConfig.isVoiced ? 0.015 : 0.005; // Faster attack for consonants
    const decayTime = 0.03;
    const sustainLevel = 0.8;
    const releaseTime = phonemeConfig.isVoiced ? 0.08 : 0.04; // Shorter release for consonants

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.exponentialRampToValueAtTime(phonemeConfig.amplitude * 0.01, startTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(phonemeConfig.amplitude, startTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(phonemeConfig.amplitude * sustainLevel, startTime + attackTime + decayTime);
    gainNode.gain.setValueAtTime(phonemeConfig.amplitude * sustainLevel, startTime + duration - releaseTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Enhanced audio graph with subtle reverb
    oscillator.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(gainNode);
    
    // Main signal
    gainNode.connect(this.masterGain);
    
    // Reverb path for natural sound
    gainNode.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Schedule playback
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    return {
      oscillator,
      gainNode,
      filter1,
      filter2,
      filter3
    };
  }

  private getPhonemeConfig(phoneme: string, config: VoiceConfig) {
    // Enhanced phoneme categorization
    const vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'];
    const fricatives = ['F', 'V', 'TH', 'DH', 'S', 'Z', 'SH', 'ZH', 'HH'];
    const stops = ['P', 'B', 'T', 'D', 'K', 'G'];
    const nasals = ['M', 'N', 'NG'];
    const liquids = ['L', 'R'];
    const glides = ['W', 'Y'];
    const affricates = ['CH', 'JH'];

    let frequency = config.basePitch;
    let amplitude = (config.loudness / 100) * 0.6; // Reduced overall amplitude for clarity
    let type: OscillatorType = 'sine';
    let formantMultiplier = 1.0;
    let isVoiced = true;

    if (vowels.includes(phoneme)) {
      // Vowels: rich harmonic structure
      type = 'sawtooth';
      amplitude *= 1.2;
      isVoiced = true;
      
      // Vowel-specific frequency and formant adjustments
      switch (phoneme) {
        case 'IY': // "see" - high front vowel
          frequency *= 1.15;
          formantMultiplier = 1.1;
          break;
        case 'IH': // "bit" - mid front vowel
          frequency *= 1.08;
          formantMultiplier = 1.05;
          break;
        case 'EH': // "bed" - mid front vowel
          frequency *= 1.05;
          formantMultiplier = 1.0;
          break;
        case 'AE': // "cat" - low front vowel
          frequency *= 1.02;
          formantMultiplier = 0.95;
          break;
        case 'AA': // "father" - low back vowel
          frequency *= 0.85;
          formantMultiplier = 0.9;
          break;
        case 'AO': // "thought" - mid back vowel
          frequency *= 0.9;
          formantMultiplier = 0.92;
          break;
        case 'UH': // "book" - high back vowel
          frequency *= 0.8;
          formantMultiplier = 0.85;
          break;
        case 'UW': // "too" - high back vowel
          frequency *= 0.75;
          formantMultiplier = 0.8;
          break;
        case 'ER': // "bird" - r-colored vowel
          frequency *= 0.95;
          formantMultiplier = 0.88;
          break;
        case 'AH': // "but" - central vowel
          frequency *= 0.98;
          formantMultiplier = 0.95;
          break;
      }
    } else if (fricatives.includes(phoneme)) {
      // Fricatives: noise-like with high frequency content
      type = 'square';
      amplitude *= 0.7;
      frequency *= 3;
      formantMultiplier = 1.5;
      isVoiced = ['V', 'DH', 'Z', 'ZH'].includes(phoneme);
      
      if (phoneme === 'S' || phoneme === 'Z') {
        frequency *= 1.5; // Even higher for sibilants
      }
    } else if (stops.includes(phoneme)) {
      // Stops: brief burst with sharp attack
      type = 'square';
      amplitude *= 1.0;
      frequency *= 2;
      formantMultiplier = 1.2;
      isVoiced = ['B', 'D', 'G'].includes(phoneme);
    } else if (affricates.includes(phoneme)) {
      // Affricates: combination of stop + fricative
      type = 'square';
      amplitude *= 0.8;
      frequency *= 2.5;
      formantMultiplier = 1.3;
      isVoiced = phoneme === 'JH';
    } else if (nasals.includes(phoneme)) {
      // Nasals: lower formants, muffled quality
      type = 'triangle';
      amplitude *= 1.1;
      frequency *= 0.7;
      formantMultiplier = 0.8;
      isVoiced = true;
    } else if (liquids.includes(phoneme)) {
      // Liquids: smooth, vowel-like
      type = 'sine';
      amplitude *= 0.9;
      frequency *= 0.85;
      formantMultiplier = 0.9;
      isVoiced = true;
    } else if (glides.includes(phoneme)) {
      // Glides: smooth formant transitions
      type = 'sine';
      amplitude *= 0.8;
      frequency *= 0.9;
      formantMultiplier = 0.95;
      isVoiced = true;
    } else {
      // Default for unknown phonemes
      type = 'sine';
      amplitude *= 0.6;
      formantMultiplier = 1.0;
      isVoiced = false;
    }

    return {
      frequency: Math.max(50, frequency), // Ensure minimum frequency
      amplitude: Math.min(1.0, amplitude), // Cap amplitude
      type,
      formantMultiplier,
      isVoiced
    };
  }

  setMasterVolume(volume: number) {
    this.masterGain.gain.setValueAtTime(volume, this.context.currentTime);
  }

  async generateSequence(phonemes: string[], config: VoiceConfig): Promise<void> {
    await this.initialize();

    const phonemeDuration = 1 / config.syllablesPerSecond; // Base duration
    const pauseDuration = phonemeDuration * 0.3; // Shorter pause
    
    let currentTime = this.context.currentTime + 0.1; // Small delay to start

    for (const phoneme of phonemes) {
      if (phoneme === '_PAUSE_') {
        currentTime += pauseDuration;
      } else {
        this.synthesizePhoneme(phoneme, config, currentTime, phonemeDuration);
        currentTime += phonemeDuration;
      }
    }
  }

  // Export to WAV for download with configurable bit rate
  async generateAudioBuffer(phonemes: string[], config: VoiceConfig, bitRate: number = 128000): Promise<AudioBuffer> {
    const phonemeDuration = 1 / config.syllablesPerSecond;
    const pauseDuration = phonemeDuration * 0.3;
    
    let totalDuration = 0;
    for (const phoneme of phonemes) {
      totalDuration += phoneme === '_PAUSE_' ? pauseDuration : phonemeDuration;
    }

    const offlineContext = new OfflineAudioContext(
      1, // mono
      totalDuration * this.context.sampleRate,
      this.context.sampleRate
    );

    const masterGain = offlineContext.createGain();
    masterGain.connect(offlineContext.destination);

    let currentTime = 0;
    for (const phoneme of phonemes) {
      if (phoneme === '_PAUSE_') {
        currentTime += pauseDuration;
      } else {
        // Create nodes in offline context
        const oscillator = offlineContext.createOscillator();
        const gainNode = offlineContext.createGain();
        const filter1 = offlineContext.createBiquadFilter();
        const filter2 = offlineContext.createBiquadFilter();
        const filter3 = offlineContext.createBiquadFilter();

        const phonemeConfig = this.getPhonemeConfig(phoneme, config);
        
        oscillator.type = phonemeConfig.type;
        oscillator.frequency.setValueAtTime(phonemeConfig.frequency, currentTime);

        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(config.formants[0], currentTime);
        filter1.Q.setValueAtTime(4, currentTime);

        filter2.type = 'bandpass';
        filter2.frequency.setValueAtTime(config.formants[1], currentTime);
        filter2.Q.setValueAtTime(4, currentTime);

        filter3.type = 'bandpass';
        filter3.frequency.setValueAtTime(config.formants[2], currentTime);
        filter3.Q.setValueAtTime(4, currentTime);

        const attackTime = 0.02;
        const releaseTime = 0.1;
        
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(phonemeConfig.amplitude, currentTime + attackTime);
        gainNode.gain.setValueAtTime(phonemeConfig.amplitude * 0.7, currentTime + phonemeDuration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + phonemeDuration);

        oscillator.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(filter3);
        filter3.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + phonemeDuration);

        currentTime += phonemeDuration;
      }
    }

    return await offlineContext.startRendering();
  }

  close() {
    if (this.context.state !== 'closed') {
      this.context.close();
    }
  }
}