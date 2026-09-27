/**
 * Conversational Voice Dialogue Engine
 * Full-duplex voice loop orchestrating:
 * 1. Speech-to-Text (STT) via Web Speech API with silence & voice activity detection
 * 2. Real-time microphone audio spectrum analysis for organic wave animation
 * 3. Auditory cues (start listening, stop/submit, turn ready, interrupt)
 * 4. Text-to-Speech (TTS) via conversational voiceEngine
 * 5. Automatic turn-taking & hands-free conversational loop (like Gemini Live or Dora)
 * 6. Instant barge-in / speech interruption
 */

import { voiceEngine } from './voice-engine.ts';
import type { VoiceProfileId } from './voice-engine.ts';
import { sound } from './audio.ts';

export type VoiceConversationPhase = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceConversationState {
  phase: VoiceConversationPhase;
  transcript: string;
  interimTranscript: string;
  lastAssistantResponse: string;
  audioLevel: number; // 0 to 1
  isContinuousMode: boolean;
  isMicAvailable: boolean;
  isSpeechRecognitionSupported: boolean;
  errorMessage: string | null;
  activeProfile: VoiceProfileId;
}

export type VoiceConversationListener = (state: VoiceConversationState) => void;

class ConversationalVoiceLoop {
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private silenceTimer: any = null;
  private isListeningActive = false;
  private listeners: Set<VoiceConversationListener> = new Set();
  private onUserUtteranceCallback: ((text: string) => Promise<string | null>) | null = null;

  private state: VoiceConversationState = {
    phase: 'idle',
    transcript: '',
    interimTranscript: '',
    lastAssistantResponse: '',
    audioLevel: 0,
    isContinuousMode: true,
    isMicAvailable: false,
    isSpeechRecognitionSupported: false,
    errorMessage: null,
    activeProfile: 'mentor',
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.state.isSpeechRecognitionSupported = Boolean(SpeechRecognition);

      // Subscribe to voiceEngine speech events to mirror audio levels during assistant playback
      voiceEngine.subscribe((veState) => {
        if (this.state.phase === 'speaking') {
          this.state.audioLevel = veState.audioLevel;
          this.notify();
        }
      });
    }
  }

  public subscribe(listener: VoiceConversationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((l) => {
      try {
        l(s);
      } catch (e) {
        console.error('Error notifying voice loop listener:', e);
      }
    });
  }

  public getState(): VoiceConversationState {
    return { ...this.state };
  }

  public setContinuousMode(enabled: boolean) {
    this.state.isContinuousMode = enabled;
    this.notify();
  }

  public setVoiceProfile(profile: VoiceProfileId) {
    this.state.activeProfile = profile;
    voiceEngine.setProfile(profile);
    this.notify();
  }

  public setUtteranceHandler(handler: (text: string) => Promise<string | null>) {
    this.onUserUtteranceCallback = handler;
  }

  /**
   * Initializes microphone audio context for visual spectrum metering.
   */
  private async initMicAudioMetering(): Promise<boolean> {
    if (this.analyser && this.micStream) return true;
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.5;
      source.connect(this.analyser);

      this.state.isMicAvailable = true;
      this.state.errorMessage = null;
      this.notify();
      return true;
    } catch (err: any) {
      console.warn('Microphone permission or audio metering error:', err);
      this.state.isMicAvailable = false;
      this.state.errorMessage =
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser settings.'
          : 'Unable to access microphone for voice conversation.';
      this.notify();
      return false;
    }
  }

  private startMicMetering() {
    this.stopMicMetering();
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const checkLevel = () => {
      if (this.state.phase !== 'listening') {
        return;
      }
      this.analyser?.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      // Normalize to 0 - 1
      const normalized = Math.min(1, Math.max(0, avg / 128));
      this.state.audioLevel = normalized;
      this.notify();
      this.animFrameId = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  private stopMicMetering() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Start listening for user speech with automatic speech boundary detection.
   */
  public async startListening() {
    if (typeof window === 'undefined') return;

    // Barge-in: if assistant is speaking, stop immediately
    if (this.state.phase === 'speaking') {
      this.interrupt();
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.state.errorMessage = 'Speech Recognition is not supported by your browser. You can type or use Chrome / Edge.';
      this.notify();
      return;
    }

    // Set up mic metering
    await this.initMicAudioMetering();

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {}
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListeningActive = true;
        this.state.phase = 'listening';
        this.state.transcript = '';
        this.state.interimTranscript = '';
        this.state.errorMessage = null;
        this.notify();
        sound.playListenStart();
        this.startMicMetering();
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        if (final) {
          this.state.transcript = (this.state.transcript ? this.state.transcript + ' ' : '') + final.trim();
        }
        this.state.interimTranscript = interim.trim();
        this.notify();

        // Voice Activity Silence Detection:
        // Reset timer whenever user utters something
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }

        const currentFull = (this.state.transcript + ' ' + this.state.interimTranscript).trim();
        if (currentFull.length > 2) {
          // If the user has spoken, wait 1.3 seconds of silence to finalize turn
          this.silenceTimer = setTimeout(() => {
            this.handleUserFinishedSpeaking();
          }, 1300);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal silence, keep listening if still in listening phase
          return;
        }
        if (event.error === 'aborted') {
          return;
        }
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed') {
          this.state.errorMessage = 'Microphone permission was not granted.';
          this.stopListening();
        }
      };

      this.recognition.onend = () => {
        if (this.isListeningActive && this.state.phase === 'listening') {
          // Re-arm if recognition stopped unexpectedly while still listening
          try {
            this.recognition.start();
          } catch {}
        }
      };

      this.recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      this.state.errorMessage = err.message || 'Failed to start speech recognition';
      this.notify();
    }
  }

  /**
   * Stop listening without submitting.
   */
  public stopListening() {
    this.isListeningActive = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.stopMicMetering();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }

    if (this.state.phase === 'listening') {
      this.state.phase = 'idle';
      this.state.audioLevel = 0;
      this.notify();
    }
  }

  /**
   * Called when silence is detected or user manually clicks "Send / Finished Speaking".
   */
  public async handleUserFinishedSpeaking() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const finalQuery = (this.state.transcript + ' ' + this.state.interimTranscript).trim();
    if (!finalQuery) {
      return;
    }

    // Stop listening and play confirmation cue
    this.stopListening();
    sound.playListenStop();

    this.state.phase = 'processing';
    this.state.transcript = finalQuery;
    this.state.interimTranscript = '';
    this.state.audioLevel = 0;
    this.notify();

    if (this.onUserUtteranceCallback) {
      try {
        const assistantResponse = await this.onUserUtteranceCallback(finalQuery);
        if (assistantResponse) {
          this.speakAssistantResponse(assistantResponse);
        } else {
          this.finishTurn();
        }
      } catch (err: any) {
        console.error('Error handling user voice query:', err);
        sound.playError();
        this.state.errorMessage = err.message || 'Error processing response';
        this.finishTurn();
      }
    } else {
      this.finishTurn();
    }
  }

  /**
   * Speaks the assistant's response with natural cadence, word boundaries,
   * and upon completion auto-triggers turn-ready chime and continuous listening.
   */
  public speakAssistantResponse(text: string) {
    this.state.phase = 'speaking';
    this.state.lastAssistantResponse = text;
    this.notify();

    voiceEngine.speak(text, {
      profile: this.state.activeProfile,
      onComplete: () => {
        this.state.audioLevel = 0;
        sound.playTurnReady();

        if (this.state.isContinuousMode) {
          // Hands-free natural loop: pause briefly then arm mic for user's next question!
          setTimeout(() => {
            this.startListening();
          }, 350);
        } else {
          this.state.phase = 'idle';
          this.notify();
        }
      },
    });
  }

  /**
   * Interrupt the assistant immediately (Barge-in).
   * Stops TTS instantly and immediately arms listening mode.
   */
  public interrupt() {
    sound.playInterrupt();
    voiceEngine.stop();
    this.state.audioLevel = 0;
    if (this.state.phase === 'speaking') {
      this.state.phase = 'idle';
      this.notify();
    }
  }

  private finishTurn() {
    this.state.phase = 'idle';
    this.state.audioLevel = 0;
    this.notify();
  }

  /**
   * Clean up all hardware streams and recognition instances.
   */
  public dispose() {
    this.stopListening();
    voiceEngine.stop();
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.listeners.clear();
  }
}

export const voiceConversation = new ConversationalVoiceLoop();
