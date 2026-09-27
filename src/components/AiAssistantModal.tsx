'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Copy,
  Check,
  Cpu,
  Key,
  Database,
  Code,
  FileCode,
  AlertCircle,
  Volume2,
  RefreshCw,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import {
  OPENROUTER_MODELS,
  DEFAULT_OPENROUTER_MODEL,
  OpenRouterModelInfo,
} from '@/lib/openrouter';
import { useAppStore } from '@/lib/store';
import { voiceEngine } from '@/lib/voice-engine';
import { sound } from '@/lib/audio';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'schema' | 'sql';
  canvasContext?: {
    entities?: any[];
    relationships?: any[];
  };
  onApplySchema?: (schema: any) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'chat',
  canvasContext,
  onApplySchema,
}) => {
  const { executeCrud, awardXp } = useAppStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'schema' | 'sql'>(initialMode);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_OPENROUTER_MODEL);
  const [customModelInput, setCustomModelInput] = useState<string>('');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [apiKeyOverride, setApiKeyOverride] = useState<string>('');
  const [showKeySettings, setShowKeySettings] = useState<boolean>(false);
  const [hasServerKey, setHasServerKey] = useState<boolean>(true);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Greetings, Architect! I am your AI Database Systems Tutor powered by OpenRouter. Ask me anything about relational modeling, B-Tree index optimization, 3NF normalization, or distributed system topologies.',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Schema Synthesizer State
  const [schemaPrompt, setSchemaPrompt] = useState('');
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<any | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  // Text-to-SQL State
  const [sqlPrompt, setSqlPrompt] = useState('');
  const [isSqlLoading, setIsSqlLoading] = useState(false);
  const [generatedSqlResult, setGeneratedSqlResult] = useState<string | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Check OpenRouter server status on mount
  useEffect(() => {
    fetch('/api/ai')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasServerKey !== undefined) {
          setHasServerKey(data.hasServerKey);
        }
      })
      .catch(() => {});

    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('dataquest_openrouter_key') : null;
    if (savedKey) setApiKeyOverride(savedKey);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const currentEffectiveModel = isCustomModel && customModelInput.trim() ? customModelInput.trim() : selectedModel;

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      if (apiKeyOverride.trim()) {
        localStorage.setItem('dataquest_openrouter_key', apiKeyOverride.trim());
      } else {
        localStorage.removeItem('dataquest_openrouter_key');
      }
    }
    setShowKeySettings(false);
    sound.playClick();
  };

  // 1. Submit Chat
  const handleSendChat = async (textToSend?: string) => {
    const finalPrompt = textToSend || chatInput;
    if (!finalPrompt.trim() || isChatLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      role: 'user',
      content: finalPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: finalPrompt,
          model: currentEffectiveModel,
          apiKey: apiKeyOverride.trim() || undefined,
          context: {
            canvasEntitiesCount: canvasContext?.entities?.length || 0,
          },
        }),
      });

      const data = await res.json();
      if (data.content) {
        sound.playLevelUp();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            modelUsed: data.modelUsed,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        awardXp(10, 'Consulted Live LLM Architecture Copilot');
      } else if (data.fallbackContent) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.fallbackContent,
            modelUsed: 'Fallback Engine',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'No response from model');
      }
    } catch (err: any) {
      sound.playError();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error communicating with model: ${err.message}. Please check API key or select another model.`,
          timestamp: 'Error',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 2. Synthesize Schema
  const handleGenerateSchema = async () => {
    if (!schemaPrompt.trim() || isSchemaLoading) return;

    sound.playClick();
    setIsSchemaLoading(true);
    setSchemaError(null);
    setGeneratedSchema(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_schema',
          prompt: schemaPrompt,
          model: currentEffectiveModel,
          apiKey: apiKeyOverride.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.schema) {
        sound.playLevelUp();
        setGeneratedSchema(data.schema);
        awardXp(30, 'Synthesized Relational Architecture via LLM');
      } else {
        throw new Error(data.error || 'Failed to synthesize schema');
      }
    } catch (err: any) {
      sound.playError();
      setSchemaError(err.message || 'Failed to synthesize schema');
    } finally {
      setIsSchemaLoading(false);
    }
  };

  // 3. Text-to-SQL
  const handleGenerateSql = async () => {
    if (!sqlPrompt.trim() || isSqlLoading) return;

    sound.playClick();
    setIsSqlLoading(true);
    setGeneratedSqlResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'text_to_sql',
          prompt: sqlPrompt,
          model: currentEffectiveModel,
          apiKey: apiKeyOverride.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.content) {
        sound.playLevelUp();
        setGeneratedSqlResult(data.content);
        awardXp(15, 'Generated ANSI SQL from Natural Language');
      } else {
        throw new Error(data.error || 'Failed to generate SQL');
      }
    } catch (err: any) {
      sound.playError();
      setGeneratedSqlResult(`-- Error: ${err.message}`);
    } finally {
      setIsSqlLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    sound.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">OpenRouter AI Architecture Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {hasServerKey ? 'Live Models Connected' : 'BYOK Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-model intelligence across Claude 3.5 Sonnet, GPT-4o, DeepSeek R1, Llama 3.3, and any OpenRouter model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKeySettings(!showKeySettings)}
              title="OpenRouter Settings & Custom Key"
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                showKeySettings || apiKeyOverride
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px] text-slate-400">Active Model:</span>

            {!isCustomModel ? (
              <select
                value={selectedModel}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomModel(true);
                  } else {
                    setSelectedModel(e.target.value);
                  }
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-purple-300 font-mono outline-hidden cursor-pointer"
              >
                {OPENROUTER_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) {m.badge ? `• ${m.badge}` : ''}
                  </option>
                ))}
                <option value="custom">✏️ Enter Custom Model Identifier...</option>
              </select>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  placeholder="e.g. anthropic/claude-3-haiku"
                  className="bg-slate-900 border border-purple-500/50 rounded-xl px-2.5 py-1 text-xs text-white font-mono outline-hidden w-64"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomModel(false)}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] hover:text-white"
                >
                  Presets
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-0.5 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'chat' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Socratic Tutor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'schema' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Schema Synthesizer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'sql' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Text-to-SQL
            </button>
          </div>
        </div>

        {/* Optional Custom API Key Drawer */}
        {showKeySettings && (
          <div className="p-4 bg-purple-950/20 border-b border-purple-900/40 text-xs space-y-2 animate-in slide-in-from-top-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                OpenRouter Key Settings (BYOK)
              </span>
              <span className="text-[10px] text-slate-400">
                {hasServerKey ? '✓ Server environment key active' : 'Client key recommended'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If your Vercel deployment already has <code>OPENROUTER_API_KEY</code>, you are all set! Alternatively, you can paste a personal OpenRouter API key below. It is stored safely in your browser only.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKeyOverride}
                onChange={(e) => setApiKeyOverride(e.target.value)}
                placeholder="sk-or-v1-..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono outline-hidden focus:border-purple-400"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Socratic Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-[350px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1 px-1">
                    {m.role === 'assistant' ? (
                      <>
                        <Bot className="w-3 h-3 text-purple-400" />
                        <span className="font-bold text-purple-300">DataQuest AI Architect</span>
                        {m.modelUsed && <span className="opacity-70">({m.modelUsed.split('/')[1] || m.modelUsed})</span>}
                      </>
                    ) : (
                      <span>You</span>
                    )}
                    <span>• {m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-sans'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(m.content, idx)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => voiceEngine.speak(m.content)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Socratic Prompts */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-500 shrink-0 font-mono text-[10px]">Suggested:</span>
              {[
                'Explain 3NF Normalization with an example',
                'Why is an Index Seek faster than a Table Scan?',
                'Design a multi-tenant payment ledger',
                'How do foreign keys maintain referential integrity?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendChat(q)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 text-[10px] shrink-0 transition-all cursor-pointer truncate max-w-[220px]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask any database question (schema design, SQL joins, query tuning)..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-hidden font-medium"
              />
              <button
                type="button"
                disabled={isChatLoading || !chatInput.trim()}
                onClick={() => handleSendChat()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                {isChatLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Schema Synthesizer */}
        {activeTab === 'schema' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Natural Language Schema Synthesizer</h4>
              <p className="text-xs text-slate-400">
                Describe a real-world scenario or business requirements. The model will design a complete 3NF relational schema with primary keys, foreign keys, and relationships ready to load onto your interactive canvas.
              </p>
            </div>

            <div className="flex gap-2">
              <textarea
                value={schemaPrompt}
                onChange={(e) => setSchemaPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Design a high-concurrency ride sharing architecture with drivers, riders, rides, payments, and driver ratings..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-hidden font-medium leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSchemaLoading || !schemaPrompt.trim()}
                onClick={handleGenerateSchema}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                {isSchemaLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Schema...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize Architecture</span>
                  </>
                )}
              </button>
            </div>

            {schemaError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{schemaError}</span>
              </div>
            )}

            {generatedSchema && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h5 className="text-sm font-bold text-white">{generatedSchema.title}</h5>
                    <p className="text-[11px] text-purple-400 font-mono">{generatedSchema.domain} • {generatedSchema.entities?.length || 0} Tables</p>
                  </div>
                  {onApplySchema && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplySchema(generatedSchema);
                        onClose();
                        sound.playLevelUp();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Deploy to Live Canvas</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 italic">{generatedSchema.summary}</p>

                {/* Entities List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {generatedSchema.entities?.map((ent: any) => (
                    <div key={ent.id || ent.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs">{ent.name}</span>
                        <span className="text-[9px] font-mono text-purple-400">{ent.attributes?.length || 0} cols</span>
                      </div>
                      <div className="space-y-0.5 max-h-28 overflow-y-auto pt-1">
                        {ent.attributes?.map((attr: any) => (
                          <div key={attr.name} className="text-[10px] font-mono flex items-center justify-between text-slate-400">
                            <span className={attr.isPrimaryKey ? 'text-amber-400 font-bold' : attr.isForeignKey ? 'text-purple-300' : ''}>
                              {attr.isPrimaryKey ? '🔑 ' : attr.isForeignKey ? '🔗 ' : ''}{attr.name}
                            </span>
                            <span className="text-[9px] opacity-70">{attr.dataType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Text-to-SQL */}
        {activeTab === 'sql' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Natural Language to ANSI SQL</h4>
              <p className="text-xs text-slate-400">
                Type what data you want to retrieve or mutate. The model outputs optimized SQL along with physical query execution analysis.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sqlPrompt}
                onChange={(e) => setSqlPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateSql()}
                placeholder="e.g. Find customers who placed orders over $100 and have completed accounts..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-hidden font-medium"
              />
              <button
                type="button"
                disabled={isSqlLoading || !sqlPrompt.trim()}
                onClick={handleGenerateSql}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer shrink-0"
              >
                {isSqlLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate SQL</span>
              </button>
            </div>

            {generatedSqlResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-purple-400" />
                    Generated Query &amp; Execution Plan
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedSqlResult, 999)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 999 ? 'Copied' : 'Copy Query'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedSqlResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
