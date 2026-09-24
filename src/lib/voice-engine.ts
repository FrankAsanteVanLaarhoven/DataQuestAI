/**
 * Conversational Voice Engine
 * Zero-dependency, client-side conversational speech synthesis.
 * Provides natural sentence chunking, voice profiles, cadence control,
 * audio visualization telemetry, and instant speech interruptibility.
 */

export type VoiceProfileId = 'mentor' | 'lecturer' | 'coach' | 'calm';

export interface VoiceProfile {
  id: VoiceProfileId;
  label: string;
  description: string;
  rate: number;
  pitch: number;
  genderPreference?: 'female' | 'male';
}

export interface VoiceEngineState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  currentWord: string;
  audioLevel: number;
  profile: VoiceProfileId;
  rate: number;
  pitch: number;
  volume: number;
  isMuted: boolean;
}

export const VOICE_PROFILES: Record<VoiceProfileId, VoiceProfile> = {
  mentor: {
    id: 'mentor',
    label: 'Conversational Mentor',
    description: 'Warm, thoughtful, and accessible pacing for guided conceptual learning.',
    rate: 0.95,
    pitch: 1.0,
    genderPreference: 'female',
  },
  lecturer: {
    id: 'lecturer',
    label: 'Academic Lecturer',
    description: 'Crisp, articulate cadence suited for formal computer science definitions.',
    rate: 1.02,
    pitch: 0.95,
    genderPreference: 'male',
  },
  coach: {
    id: 'coach',
    label: 'Dynamic Coach',
    description: 'Energetic, motivational voice for interactive exercises and missions.',
    rate: 1.1,
    pitch: 1.05,
  },
  calm: {
    id: 'calm',
    label: 'Calm Guide',
    description: 'Gentle, relaxed cadence for stress-free schema exploration.',
    rate: 0.88,
    pitch: 0.92,
  },
};

type StateListener = (state: VoiceEngineState) => void;

class ConversationalVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<StateListener> = new Set();
  private animationFrameId: number | null = null;

  private state: VoiceEngineState = {
    isSpeaking: false,
    isPaused: false,
    currentText: '',
    currentWord: '',
    audioLevel: 0,
    profile: 'mentor',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    isMuted: false,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('Error notifying voice state listener:', err);
      }
    });
  }

  public getState(): VoiceEngineState {
    return { ...this.state };
  }

  public setProfile(profileId: VoiceProfileId) {
    const profile = VOICE_PROFILES[profileId];
    if (!profile) return;
    this.state.profile = profileId;
    this.state.rate = profile.rate;
    this.state.pitch = profile.pitch;
    this.notify();
  }

  public setRate(rate: number) {
    this.state.rate = Math.max(0.5, Math.min(2.0, rate));
    this.notify();
  }

  public setPitch(pitch: number) {
    this.state.pitch = Math.max(0.5, Math.min(1.5, pitch));
    this.notify();
  }

  public setVolume(volume: number) {
    this.state.volume = Math.max(0, Math.min(1.0, volume));
    this.notify();
  }

  public setMuted(muted: boolean) {
    this.state.isMuted = muted;
    if (muted && this.state.isSpeaking) {
      this.stop();
    }
    this.notify();
  }

  /**
   * Cleans text to produce natural spoken speech:
   * Strips markdown symbols, code delimiters, and expands common acronyms for clearer phonetic playback.
   */
  public prepareConversationalText(raw: string): string {
    if (!raw) return '';

    return raw
      .replace(/```[\s\S]*?```/g, 'code snippet omitted')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[•\-\*]\s+/g, '. ')
      .replace(/↓|→/g, ' leads to ')
      .replace(/\bPK\b/g, 'Primary Key')
      .replace(/\bFK\b/g, 'Foreign Key')
      .replace(/\bERD\b/g, 'Entity Relationship Diagram')
      .replace(/\b3NF\b/g, 'Third Normal Form')
      .replace(/\bSQL\b/g, 'S-Q-L')
      .replace(/\bQPS\b/g, 'queries per second')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split conversational text into natural sentence chunks to minimize latency
   * and create organic breathing pauses between clauses.
   */
  public chunkSentences(text: string): string[] {
    const prepared = this.prepareConversationalText(text);
    if (!prepared) return [];

    // Match punctuation boundaries
    const rawChunks = prepared.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [prepared];
    return rawChunks
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  }

  private selectVoice(): SpeechSynthesisVoice | null {
    const available = this.getAvailableVoices();
    if (available.length === 0) return null;

    const profile = VOICE_PROFILES[this.state.profile];
    const englishVoices = available.filter((v) => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : available;

    // Prefer high-quality or natural browser voices
    const naturalVoice = pool.find((v) =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('siri') ||
      v.name.toLowerCase().includes('google') ||
      v.name.toLowerCase().includes('premium')
    );

    if (naturalVoice) return naturalVoice;
    return pool[0] || null;
  }

  /**
   * Synthesize and speak conversational speech with queuing and interruption support.
   */
  public speak(text: string, options?: { onComplete?: () => void; profile?: VoiceProfileId }) {
    if (this.state.isMuted) return;

    if (options?.profile) {
      this.setProfile(options.profile);
    }

    if (typeof window === 'undefined' || !this.synth) {
      console.warn('Conversational Voice Engine: SpeechSynthesis not available in this environment.');
      options?.onComplete?.();
      return;
    }

    // Stop any existing speech for instant responsiveness
    this.stop();

    const sentences = this.chunkSentences(text);
    if (sentences.length === 0) return;

    this.state.isSpeaking = true;
    this.state.isPaused = false;
    this.state.currentText = text;
    this.state.currentWord = '';
    this.notify();
    this.startLevelAnimation();

    let currentIndex = 0;

    const speakNextSentence = () => {
      if (!this.state.isSpeaking || currentIndex >= sentences.length) {
        this.finishSpeaking();
        options?.onComplete?.();
        return;
      }

      const sentence = sentences[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(sentence);
      const voice = this.selectVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = this.state.rate;
      utterance.pitch = this.state.pitch;
      utterance.volume = this.state.volume;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const word = sentence.substring(event.charIndex, event.charIndex + (event.charLength || 6));
          this.state.currentWord = word.trim();
          this.notify();
        }
      };

      utterance.onend = () => {
        if (currentIndex < sentences.length && this.state.isSpeaking) {
          // Micro-pause between sentences for natural conversational cadence
          setTimeout(speakNextSentence, 120);
        } else {
          this.finishSpeaking();
          options?.onComplete?.();
        }
      };

      utterance.onerror = (e) => {
        // 'interrupted' is normal when user cancels or triggers new speech
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Voice Engine utterance error:', e.error);
        }
        this.finishSpeaking();
      };

      this.currentUtterance = utterance;
      this.synth?.speak(utterance);
    };

    speakNextSentence();
  }

  private finishSpeaking() {
    this.state.isSpeaking = false;
    this.state.isPaused = false;
    this.state.currentWord = '';
    this.state.audioLevel = 0;
    this.currentUtterance = null;
    this.stopLevelAnimation();
    this.notify();
  }

  private startLevelAnimation() {
    this.stopLevelAnimation();
    const updateLevel = () => {
      if (!this.state.isSpeaking || this.state.isPaused) {
        this.state.audioLevel = 0;
        this.notify();
        return;
      }
      // Generate natural undulating speech waveform signal (0.2 to 0.95)
      this.state.audioLevel = 0.25 + Math.random() * 0.7;
      this.notify();
      this.animationFrameId = setTimeout(updateLevel, 100) as unknown as number;
    };
    updateLevel();
  }

  private stopLevelAnimation() {
    if (this.animationFrameId !== null) {
      clearTimeout(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public pause() {
    if (!this.synth || !this.state.isSpeaking) return;
    this.synth.pause();
    this.state.isPaused = true;
    this.notify();
  }

  public resume() {
    if (!this.synth || !this.state.isPaused) return;
    this.synth.resume();
    this.state.isPaused = false;
    this.notify();
  }

  public stop() {
    if (!this.synth) return;
    try {
      this.synth.cancel();
    } catch {
      // Ignore cancellation failures
    }
    this.finishSpeaking();
  }

  public toggleMute(): boolean {
    const next = !this.state.isMuted;
    this.setMuted(next);
    return next;
  }
}

export const voiceEngine = new ConversationalVoiceEngine();
