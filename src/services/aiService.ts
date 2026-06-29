export interface AIGenerateParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AIGenerateResponse {
  text: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class AIFrontendError extends Error {
  public provider?: string;
  public isRetryable: boolean;

  constructor(message: string, options?: { provider?: string; isRetryable?: boolean }) {
    super(message);
    this.name = 'AIFrontendError';
    this.provider = options?.provider;
    this.isRetryable = options?.isRetryable ?? false;
  }
}

export async function generateText(params: AIGenerateParams): Promise<AIGenerateResponse> {
  try {
    const { signal, ...bodyParams } = params;
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
      signal,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new AIFrontendError(`Server returned status ${response.status}`);
      }
      throw new AIFrontendError(errorData.error || 'Unknown AI error', {
        provider: errorData.provider,
        isRetryable: errorData.isRetryable,
      });
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error; // Let the component handle abortion specifically
    }
    if (error instanceof AIFrontendError) {
      throw error;
    }
    throw new AIFrontendError(error.message || 'Network error occurred', { isRetryable: true });
  }
}
