export interface CaptchaRecognitionRequest {
  image: string; // base64编码的图片
  format?: 'base64' | 'url';
}

export interface CaptchaRecognitionResponse {
  success: boolean;
  result?: string;
  error?: string;
  processingTime?: number;
}

export interface ModelConfig {
  apiUrl: string;
  apiKey: string;
  modelName: string;
  requestFormat: 'openai' | 'anthropic';
}

export interface AdminAuthRequest {
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  error?: string;
}

export interface ConfigValidation {
  isValid: boolean;
  errors: string[];
  status: 'pending' | 'failed' | 'verified'; // pending: 待验证, failed: 配置错误, verified: 已验证通过
}

export interface TestResult {
  success: boolean;
  recognizedText?: string;
  originalImage?: string;
  processingTime?: number;
  error?: string;
}

export type RequestFormat = 'openai' | 'anthropic';

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  thinking?: string; // 思考模式参数
}

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image';
    text?: string;
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
  }>;
}

export interface AnthropicRequest {
  model: string;
  max_tokens: number;
  messages: AnthropicMessage[];
  thinking?: string; // 思考模式参数
}
