'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  Radio,
  Check,
  Send,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import {
  voiceConversation,
  VoiceConversationState,
  VoiceConversationPhase,
} from '@/lib/voice-conversation-engine';
import { voiceEngine, VOICE_PROFILES, VoiceProfileId } from '@/lib/voice-engine';
import { sound } from '@/lib/audio';

interface VoiceDialogueViewProps {
  currentModel: string;
  onSendToLlm: (prompt: string) => Promise<string | null>;
  onSwitchToTextChat: () => void;
}

export const VoiceDialogueView: React.FC<VoiceDialogueViewProps> = ({
  currentModel,
  onSendToLlm,
  onSwitchToTextChat,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceConversationState>(
    voiceConversation.getState()
  );
  const [isMuted, setIsMuted] = useState(voiceEngine.getState().isMuted);
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfileId>('mentor');
  const [showSettings, setShowSettings] = useState(false);
  const [manualText, setManualText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; time: string }>
  >([]);

  // Register the LLM utterance handler
  useEffect(() => {
    voiceConversation.setUtteranceHandler(async (spokenQuery: string) => {
      // Add user turn to conversation history
      setConversationHistory((prev) => [
        ...prev,
        {
          role: 'user',
          text: spokenQuery,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      const response = await onSendToLlm(spokenQuery);
      if (response) {
        setConversationHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: response,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
      return response;
    });

    const unsubscribe = voiceConversation.subscribe((s) => {
      setVoiceState(s);
    });

    return () => {
      unsubscribe();
      voiceConversation.stopListening();
      voiceEngine.stop();
    };
  }, [onSendToLlm]);

  // Handle Voice Toggle
  const handleToggleListening = () => {
    if (voiceState.phase === 'speaking') {
      voiceConversation.interrupt();
      voiceConversation.startListening();
    } else if (voiceState.phase === 'listening') {
      voiceConversation.stopListening();
    } else {
      voiceConversation.startListening();
    }
  };

  const handleInterrupt = () => {
    voiceConversation.interrupt();
  };

  const handleManualSubmitTurn = () => {
    voiceConversation.handleUserFinishedSpeaking();
  };

  const handleToggleContinuous = () => {
    const next = !voiceState.isContinuousMode;
    voiceConversation.setContinuousMode(next);
    sound.playClick();
  };

  const handleProfileChange = (profile: VoiceProfileId) => {
    setSelectedProfile(profile);
    voiceConversation.setVoiceProfile(profile);
    sound.playClick();
  };

  const handleToggleMute = () => {
    const nextMute = voiceEngine.toggleMute();
    setIsMuted(nextMute);
    sound.playClick();
  };

  // Generate visual spectrum bars based on audio level
  const spectrumBars = 16;
  const level = Math.max(0.08, voiceState.audioLevel);

  return (
    <div className="flex-1 flex flex-col bg-radial from-slate-900 via-slate-950 to-black p-4 sm:p-6 overflow-y-auto select-none relative">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300">
            Conversational Voice Mode
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 truncate max-w-[180px]">
            {currentModel.split('/')[1] || currentModel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleContinuous}
            title="Toggle Continuous Hands-Free Dialogue"
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              voiceState.isContinuousMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Continuous Loop:</span>
            <span>{voiceState.isContinuousMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Voice & Cadence Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onSwitchToTextChat}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Text View
          </button>
        </div>
      </div>

      {/* Voice Settings Drawer */}
      {showSettings && (
        <div className="p-3 mb-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2.5 animate-in slide-in-from-top-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Conversational Voice Personas
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Web Speech & Natural Audio Synthesis
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(VOICE_PROFILES) as VoiceProfileId[]).map((key) => {
              const prof = VOICE_PROFILES[key];
              const isSelected = selectedProfile === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleProfileChange(key)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs truncate flex items-center justify-between">
                    <span>{prof.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 opacity-80 mt-0.5 line-clamp-1">
                    {prof.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {voiceState.errorMessage && (
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>{voiceState.errorMessage}</span>
          <button
            type="button"
            onClick={() => voiceConversation.startListening()}
            className="text-[11px] underline font-bold hover:text-white"
          >
            Retry Mic
          </button>
        </div>
      )}

      {/* Central Interactive Voice Orb Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
        <div className="relative flex items-center justify-center">
          {/* Multi-layered Pulsing Glow Rings */}
          <div
            className={`absolute rounded-full transition-all duration-300 blur-2xl pointer-events-none ${
              voiceState.phase === 'listening'
                ? 'w-64 h-64 bg-emerald-500/25 animate-pulse'
                : voiceState.phase === 'speaking'
                ? 'w-72 h-72 bg-gradient-to-tr from-purple-600/35 via-pink-600/25 to-indigo-600/35 animate-spin'
                : voiceState.phase === 'processing'
                ? 'w-60 h-60 bg-indigo-500/30 animate-ping'
                : 'w-48 h-48 bg-purple-900/15'
            }`}
            style={{
              transform: `scale(${1 + level * 0.45})`,
            }}
          />

          <div
            className={`absolute rounded-full transition-all duration-200 blur-md pointer-events-none ${
              voiceState.phase === 'listening'
                ? 'w-48 h-48 bg-emerald-400/20'
                : voiceState.phase === 'speaking'
                ? 'w-52 h-52 bg-pink-500/20'
                : 'w-40 h-40 bg-purple-500/10'
            }`}
            style={{
              transform: `scale(${1 + level * 0.3})`,
            }}
          />

          {/* Central Interactive Voice Orb Button */}
          <button
            type="button"
            onClick={handleToggleListening}
            className={`relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer border ${
              voiceState.phase === 'listening'
                ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 border-emerald-400 text-white shadow-emerald-500/30 scale-105'
                : voiceState.phase === 'speaking'
                ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 border-purple-300 text-white shadow-purple-500/40'
                : voiceState.phase === 'processing'
                ? 'bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 border-indigo-400 text-white shadow-indigo-500/30'
                : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-slate-700 text-slate-300 hover:border-purple-400 hover:text-white shadow-purple-900/20'
            }`}
            style={{
              transform: `scale(${1 + (voiceState.phase === 'speaking' || voiceState.phase === 'listening' ? level * 0.15 : 0)})`,
            }}
          >
            {voiceState.phase === 'listening' ? (
              <>
                <Mic className="w-10 h-10 mb-1 animate-bounce" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Listening</span>
              </>
            ) : voiceState.phase === 'speaking' ? (
              <>
                <Volume2 className="w-10 h-10 mb-1 animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Speaking</span>
                <span className="text-[9px] opacity-75 mt-0.5">Tap to interrupt</span>
              </>
            ) : voiceState.phase === 'processing' ? (
              <>
                <RefreshCw className="w-10 h-10 mb-1 animate-spin text-purple-300" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Thinking</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-1" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Frequency Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-10 mt-6 sm:mt-8">
          {Array.from({ length: spectrumBars }).map((_, i) => {
            const barHeight =
              voiceState.phase === 'listening' || voiceState.phase === 'speaking'
                ? Math.max(4, Math.sin((i / spectrumBars) * Math.PI) * level * 36 + Math.random() * 6)
                : 4;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-75 ${
                  voiceState.phase === 'listening'
                    ? 'bg-emerald-400'
                    : voiceState.phase === 'speaking'
                    ? 'bg-gradient-to-t from-purple-500 to-pink-400'
                    : 'bg-slate-800'
                }`}
                style={{ height: `${barHeight}px` }}
              />
            );
          })}
        </div>

        {/* State Banner / Instructional Cue */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            {voiceState.phase === 'listening' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-medium">
                  Listening to your voice... Speak naturally. Silence auto-advances.
                </span>
              </>
            )}
            {voiceState.phase === 'processing' && (
              <>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-indigo-300 font-medium">
                  Synthesizing database architecture response via OpenRouter...
                </span>
              </>
            )}
            {voiceState.phase === 'speaking' && (
              <>
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-pink-300 font-medium">
                  Speaking response... Say something or click to interrupt.
                </span>
              </>
            )}
            {voiceState.phase === 'idle' && (
              <span className="text-slate-400 font-medium">
                Tap the center orb or say your database question to begin.
              </span>
            )}
          </div>
        </div>

        {/* Real-time Spoken Transcript or Interim Speech */}
        <div className="mt-4 w-full max-w-xl min-h-[50px] p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
          {voiceState.transcript || voiceState.interimTranscript ? (
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              <span className="font-bold text-white">{voiceState.transcript}</span>{' '}
              <span className="text-slate-400 italic">{voiceState.interimTranscript}</span>
            </p>
          ) : voiceState.lastAssistantResponse ? (
            <p className="text-xs text-purple-200 leading-relaxed font-sans line-clamp-3">
              {voiceState.lastAssistantResponse}
            </p>
          ) : (
            <p className="text-xs text-slate-600 italic">
              Spoken conversation will transcribe here in real time...
            </p>
          )}
        </div>

        {/* Action Controls for Turn Management */}
        <div className="flex items-center gap-3 mt-4">
          {voiceState.phase === 'listening' && (
            <button
              type="button"
              onClick={handleManualSubmitTurn}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Done Speaking</span>
            </button>
          )}

          {voiceState.phase === 'speaking' && (
            <button
              type="button"
              onClick={handleInterrupt}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Interrupt / Stop</span>
            </button>
          )}

          {voiceState.phase === 'idle' && (
            <button
              type="button"
              onClick={() => voiceConversation.startListening()}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Speaking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
