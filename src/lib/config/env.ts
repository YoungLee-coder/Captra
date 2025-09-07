import { RequestFormat } from '@/types';
import { checkVerificationStatus } from './validationState';

const parseAdditionalParams = (params: string): Record<string, unknown> => {
  if (!params || params.trim() === '') {
    return {};
  }
  
  try {
    // 支持 JSON 格式的附加参数
    return JSON.parse(params) as Record<string, unknown>;
  } catch (error) {
    console.warn('附加参数解析失败，请检查 ADDITIONAL_PARAMS 格式:', error);
    return {};
  }
};

export const config = {
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  apiUrl: process.env.API_URL || 'https://api.openai.com/v1/chat/completions',
  apiKey: process.env.API_KEY || '',
  modelName: process.env.MODEL_NAME || 'gpt-4o-mini',
  requestFormat: (process.env.REQUEST_FORMAT as RequestFormat) || 'openai',
  additionalParams: parseAdditionalParams(process.env.ADDITIONAL_PARAMS || ''), // 附加参数，支持JSON格式
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'default-secret',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
} as const;

export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.apiKey) {
    errors.push('API_KEY is required');
  }
  
  if (!config.adminPassword) {
    errors.push('ADMIN_PASSWORD is required');
  }
  
  if (!['openai', 'anthropic'].includes(config.requestFormat)) {
    errors.push('REQUEST_FORMAT must be either "openai" or "anthropic"');
  }
  
  // 如果基础配置有错误，返回failed状态
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      status: 'failed' as const,
    };
  }
  
  // 基础配置正确，检查验证状态
  const verificationStatus = checkVerificationStatus();
  
  return {
    isValid: true,
    errors,
    status: verificationStatus,
  };
};
