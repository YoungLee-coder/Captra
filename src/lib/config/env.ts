import { RequestFormat } from '@/types';
import { checkVerificationStatus } from './validationState';

const parseAdditionalParams = (params: string): Record<string, unknown> => {
  // 处理 undefined、null 或空字符串的情况
  if (!params || typeof params !== 'string' || params.trim() === '') {
    return {};
  }
  
  try {
    // 清理参数字符串，移除可能的引号和空白字符
    let cleanParams = params.trim();
    
    // 移除可能的外层引号
    if ((cleanParams.startsWith('"') && cleanParams.endsWith('"')) || 
        (cleanParams.startsWith("'") && cleanParams.endsWith("'"))) {
      cleanParams = cleanParams.slice(1, -1);
    }
    
    // 如果清理后为空，返回空对象
    if (!cleanParams || cleanParams === '{}') {
      return {};
    }
    
    // 检查是否看起来像JSON
    if (!cleanParams.startsWith('{') || !cleanParams.endsWith('}')) {
      console.warn('ADDITIONAL_PARAMS 不是有效的JSON格式，忽略该参数');
      return {};
    }
    
    // 支持 JSON 格式的附加参数
    const parsed = JSON.parse(cleanParams);
    
    // 确保解析结果是对象
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.warn('ADDITIONAL_PARAMS 必须是JSON对象格式');
      return {};
    }
    
    return parsed as Record<string, unknown>;
  } catch (error) {
    console.warn('附加参数解析失败，将使用默认配置');
    console.warn('原始参数值:', JSON.stringify(params));
    console.warn('错误信息:', error instanceof Error ? error.message : String(error));
    console.warn('建议格式: {"key": "value"} 或留空');
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
