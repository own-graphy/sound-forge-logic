import { VoiceProfile } from './voiceProfiles';

export interface CoquiVoiceSettings {
  pitch: number;
  speed: number;
  volume: number;
}

export class CoquiTTSEngine {
  private apiUrl: string;
  private isReady: boolean = false;

  constructor() {
    // Use local Coqui TTS server or fallback to hosted service
    this.apiUrl = 'http://localhost:5002'; // Default Coqui TTS server port
    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    try {
      // Check if Coqui TTS server is available
      const response = await fetch(`${this.apiUrl}/api/tts`, {
        method: 'HEAD',
      });
      this.isReady = response.ok;
    } catch (error) {
      console.warn('Coqui TTS server not available, using fallback synthesis');
      this.isReady = false;
    }
  }

  async synthesizeText(
    text: string,
    voiceProfile: VoiceProfile,
    settings: CoquiVoiceSettings
  ): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      if (this.isReady) {
        return await this.synthesizeWithCoqui(text, voiceProfile, settings);
      } else {
        return await this.synthesizeWithFallback(text, voiceProfile, settings);
      }
    } catch (error) {
      console.error('TTS synthesis failed:', error);
      throw new Error('Failed to generate speech');
    }
  }

  private async synthesizeWithCoqui(
    text: string,
    voiceProfile: VoiceProfile,
    settings: CoquiVoiceSettings
  ): Promise<string> {
    const requestBody = {
      text: text.trim(),
      speaker_id: this.mapVoiceToSpeaker(voiceProfile),
      language_id: voiceProfile.language === 'hindi' ? 'hi' : 'en',
      speed: settings.speed,
      pitch: settings.pitch / 100, // Normalize to 0-2 range
      volume: settings.volume / 100,
    };

    const response = await fetch(`${this.apiUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Coqui TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }

  private async synthesizeWithFallback(
    text: string,
    voiceProfile: VoiceProfile,
    settings: CoquiVoiceSettings
  ): Promise<string> {
    // Fallback to Web Speech API with enhanced processing
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice
      const voices = speechSynthesis.getVoices();
      const targetVoice = this.findBestVoice(voices, voiceProfile);
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      // Apply settings
      utterance.rate = Math.max(0.1, Math.min(10, settings.speed));
      utterance.pitch = Math.max(0, Math.min(2, (settings.pitch + 100) / 100));
      utterance.volume = Math.max(0, Math.min(1, settings.volume / 100));

      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve(audioUrl);
      };

      utterance.onstart = () => {
        mediaRecorder.start();
      };

      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 100);
      };

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Start synthesis
      speechSynthesis.speak(utterance);
    });
  }

  private mapVoiceToSpeaker(voiceProfile: VoiceProfile): string {
    // Map voice profiles to Coqui TTS speaker IDs
    const speakerMap: Record<string, string> = {
      'sarah-en': 'p225',
      'michael-en': 'p226',
      'emma-en': 'p227',
      'priya-hi': 'hindi_female_1',
      'arjun-hi': 'hindi_male_1',
      'raj-hi': 'hindi_male_2',
    };

    return speakerMap[voiceProfile.id] || 'p225';
  }

  private findBestVoice(voices: SpeechSynthesisVoice[], voiceProfile: VoiceProfile): SpeechSynthesisVoice | null {
    const language = voiceProfile.language === 'hindi' ? 'hi' : 'en';
    const gender = voiceProfile.gender;

    // First, try to find a voice that matches language and gender
    let matchingVoice = voices.find(voice => 
      voice.lang.startsWith(language) && 
      (gender === 'female' ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') : 
       voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'))
    );

    // If no gender match, find by language
    if (!matchingVoice) {
      matchingVoice = voices.find(voice => voice.lang.startsWith(language));
    }

    // If no language match, use default
    if (!matchingVoice && voices.length > 0) {
      matchingVoice = voices[0];
    }

    return matchingVoice || null;
  }

  async getAvailableVoices(): Promise<string[]> {
    if (this.isReady) {
      try {
        const response = await fetch(`${this.apiUrl}/api/voices`);
        if (response.ok) {
          const voices = await response.json();
          return voices.map((v: any) => v.id);
        }
      } catch (error) {
        console.warn('Failed to fetch Coqui voices:', error);
      }
    }

    // Fallback to Web Speech API voices
    return speechSynthesis.getVoices().map(voice => voice.name);
  }

  isEngineReady(): boolean {
    return this.isReady || 'speechSynthesis' in window;
  }
}