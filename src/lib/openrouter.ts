/**
 * OpenRouter LLM Service & Model Hub for DataQuestAI
 * Provides real-time inference across top-tier models (Claude 3.5 Sonnet, GPT-4o,
 * DeepSeek R1, Llama 3.3, Gemini 2.0 Flash) and any model available on OpenRouter.
 */

export interface OpenRouterModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  recommendedFor: string;
  badge?: string;
}

export const OPENROUTER_MODELS: OpenRouterModelInfo[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Premier architectural reasoning, deep relational modeling, and Socratic pedagogy.',
    recommendedFor: 'Complex Schemas & 3NF Auditing',
    badge: 'Recommended',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'High-performance general intelligence, query plan explanations, and SQL parsing.',
    recommendedFor: 'SQL DDL/DML & Multi-Table Joins',
    badge: 'Popular',
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Open-weights reasoning model with mathematical chain-of-thought verification.',
    recommendedFor: 'Relational Algebra & Normalization',
    badge: 'Deep Reasoning',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Ultra-fast open architecture engine with deep technical database knowledge.',
    recommendedFor: 'Speed & Open Systems',
    badge: 'Fast',
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Next-gen low latency model with massive context window and lightning responses.',
    recommendedFor: 'Real-time Conversational Tutor',
    badge: 'Ultra Fast',
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Qwen',
    description: 'Specialized coding engine for generating SQL scripts, PlantUML, and Mermaid.',
    recommendedFor: 'Code & DDL Synthesis',
    badge: 'Code Specialist',
  },
];

export const DEFAULT_OPENROUTER_MODEL = 'anthropic/claude-3.5-sonnet';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterCallOptions {
  model?: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  responseFormat?: { type: 'json_object' };
}

export interface OpenRouterCallResult {
  success: boolean;
  content: string;
  modelUsed: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  error?: string;
  isMockFallback?: boolean;
}

/**
 * Execute real live inference through OpenRouter API
 */
export async function callOpenRouter(
  options: OpenRouterCallOptions
): Promise<OpenRouterCallResult> {
  const apiKey =
    options.apiKey ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPEN_ROUTER_API_KEY ||
    '';

  const model = options.model || DEFAULT_OPENROUTER_MODEL;

  if (!apiKey) {
    return {
      success: false,
      content: '',
      modelUsed: model,
      error: 'OPENROUTER_API_KEY is not configured in server environment or client settings.',
      isMockFallback: true,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout for deep reasoning models

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://data-quest-ai-zeta.vercel.app',
        'X-Title': 'DataQuestAI Enterprise Laboratory',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: options.messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 2500,
        response_format: options.responseFormat,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = `OpenRouter API error (HTTP ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        errorMsg = parsed.error?.message || parsed.message || errorMsg;
      } catch {}
      return {
        success: false,
        content: '',
        modelUsed: model,
        error: errorMsg,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      success: true,
      content,
      modelUsed: data.model || model,
      tokensUsed: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      content: '',
      modelUsed: model,
      error: err.name === 'AbortError' ? 'Model request timed out after 45 seconds.' : err.message || 'Network error connecting to OpenRouter.',
    };
  }
}
