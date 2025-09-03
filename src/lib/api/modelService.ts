import { config } from '@/lib/config/env';
import type { 
  CaptchaRecognitionResponse, 
  OpenAIRequest, 
  AnthropicRequest,
  RequestFormat 
} from '@/types';

const CAPTCHA_PROMPT = `You are a professional CAPTCHA recognition expert. Please look at the image and identify the text content in the CAPTCHA.

CRITICAL RULES:
1. ONLY return the text content from the CAPTCHA - NO explanations, NO additional text, NO formatting
2. Preserve original case (uppercase/lowercase) for letters and numbers
3. If you cannot recognize it, return "UNRECOGNIZABLE"
4. Ensure maximum accuracy

Identify the CAPTCHA content:`;

export class ModelService {
  private static instance: ModelService;
  
  static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  async recognizeCaptcha(imageBase64: string): Promise<CaptchaRecognitionResponse> {
    const startTime = Date.now();
    
    try {
      const result = await this.callModel(imageBase64);
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        result: result.trim(),
        processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('验证码识别失败:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        processingTime,
      };
    }
  }

  private async callModel(imageBase64: string): Promise<string> {
    const { apiUrl, apiKey, modelName, requestFormat } = config;
    
    if (!apiKey) {
      throw new Error('API密钥未配置');
    }

    const requestBody = this.buildRequest(imageBase64, modelName, requestFormat);
    const headers = this.buildHeaders(requestFormat, apiKey);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API调用失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return this.extractResult(data, requestFormat);
  }

  private buildRequest(imageBase64: string, modelName: string, format: RequestFormat): OpenAIRequest | AnthropicRequest {
    // 确保base64格式正确
    const base64Image = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    if (format === 'openai') {
      return {
        model: modelName,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: CAPTCHA_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 100,
        temperature: 0.1,
      };
    } else {
      // Anthropic格式
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      
      return {
        model: modelName,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: CAPTCHA_PROMPT,
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      };
    }
  }

  private buildHeaders(format: RequestFormat, apiKey: string): Record<string, string> {
    const commonHeaders = {
      'Content-Type': 'application/json',
    };

    if (format === 'openai') {
      return {
        ...commonHeaders,
        'Authorization': `Bearer ${apiKey}`,
      };
    } else {
      // Anthropic格式
      return {
        ...commonHeaders,
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      };
    }
  }

  private extractResult(data: unknown, format: RequestFormat): string {
    try {
      if (format === 'openai') {
        const openaiData = data as { choices?: Array<{ message?: { content?: string } }> };
        return openaiData.choices?.[0]?.message?.content || 'UNRECOGNIZABLE';
      } else {
        // Anthropic格式
        const anthropicData = data as { content?: Array<{ text?: string }> };
        return anthropicData.content?.[0]?.text || 'UNRECOGNIZABLE';
      }
    } catch {
      return 'UNRECOGNIZABLE';
    }
  }

  getModelConfig() {
    return {
      apiUrl: config.apiUrl,
      modelName: config.modelName,
      requestFormat: config.requestFormat,
      // 不返回API密钥的完整值，只显示部分
      apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...` : '未配置',
    };
  }
}
