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

    // Configure oscillator based on phoneme type
    const phonemeConfig = this.getPhonemeConfig(phoneme, config);
    
    oscillator.type = phonemeConfig.type;
    oscillator.frequency.setValueAtTime(phonemeConfig.frequency, startTime);
    
    // Add natural pitch variation (jitter)
    const jitterAmount = config.jitter * config.basePitch;
    oscillator.frequency.linearRampToValueAtTime(
      phonemeConfig.frequency + (Math.random() - 0.5) * jitterAmount,
      startTime + duration
    );

    // Configure formant filters (F1, F2, F3)
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(config.formants[0], startTime);
    filter1.Q.setValueAtTime(4, startTime);

    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(config.formants[1], startTime);
    filter2.Q.setValueAtTime(4, startTime);

    filter3.type = 'bandpass';
    filter3.frequency.setValueAtTime(config.formants[2], startTime);
    filter3.Q.setValueAtTime(4, startTime);

    // Configure envelope (ADSR)
    const attackTime = 0.02; // 20ms attack
    const decayTime = 0.05;  // 50ms decay
    const sustainLevel = 0.7;
    const releaseTime = 0.1; // 100ms release

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(phonemeConfig.amplitude, startTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(phonemeConfig.amplitude * sustainLevel, startTime + attackTime + decayTime);
    gainNode.gain.setValueAtTime(phonemeConfig.amplitude * sustainLevel, startTime + duration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    // Connect the audio graph
    oscillator.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(gainNode);
    gainNode.connect(this.masterGain);

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
    // Phoneme-specific configurations
    const vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'];
    const fricatives = ['F', 'V', 'TH', 'DH', 'S', 'Z', 'SH', 'ZH', 'HH'];
    const stops = ['P', 'B', 'T', 'D', 'K', 'G'];
    const nasals = ['M', 'N', 'NG'];
    const liquids = ['L', 'R'];
    const glides = ['W', 'Y'];

    let frequency = config.basePitch;
    let amplitude = config.loudness / 100;
    let type: OscillatorType = 'sine';

    if (vowels.includes(phoneme)) {
      // Vowels: harmonic structure with formants
      type = 'sawtooth';
      amplitude *= 1.0;
      
      // Adjust formants based on specific vowel
      switch (phoneme) {
        case 'IY': // "see"
          frequency *= 1.1;
          break;
        case 'AA': // "father"
          frequency *= 0.9;
          break;
        case 'UW': // "too"
          frequency *= 0.8;
          break;
        case 'EH': // "bed"
          frequency *= 1.05;
          break;
      }
    } else if (fricatives.includes(phoneme)) {
      // Fricatives: noise-like
      type = 'square';
      amplitude *= 0.6;
      frequency *= 2; // Higher frequency content
    } else if (stops.includes(phoneme)) {
      // Stops: short burst
      type = 'square';
      amplitude *= 0.8;
      frequency *= 1.5;
    } else if (nasals.includes(phoneme)) {
      // Nasals: lower formants
      type = 'triangle';
      amplitude *= 0.9;
      frequency *= 0.7;
    } else if (liquids.includes(phoneme)) {
      // Liquids: smooth transitions
      type = 'sine';
      amplitude *= 0.8;
    } else if (glides.includes(phoneme)) {
      // Glides: smooth formant transitions
      type = 'sine';
      amplitude *= 0.7;
    } else {
      // Default
      type = 'sine';
      amplitude *= 0.5;
    }

    return {
      frequency,
      amplitude,
      type
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

  // Export to WAV for download
  async generateAudioBuffer(phonemes: string[], config: VoiceConfig): Promise<AudioBuffer> {
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