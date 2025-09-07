import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ValidationState {
  isVerified: boolean;
  lastTestTime: number;
  lastTestResult?: {
    success: boolean;
    recognizedText?: string;
    processingTime?: number;
    error?: string;
  };
}

// 全局内存存储（适用于无服务器环境）
declare global {
  var __captraValidationState: ValidationState | undefined;
}

// 验证状态文件路径
const VALIDATION_STATE_FILE = join(process.cwd(), '.validation-state.json');

// 默认验证状态
const DEFAULT_STATE: ValidationState = {
  isVerified: false,
  lastTestTime: 0,
};

// 检查是否为无服务器环境（如Netlify、Vercel）
function isServerlessEnvironment(): boolean {
  return !!(
    process.env.NETLIFY || 
    process.env.VERCEL || 
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.FUNCTION_NAME
  );
}

// 读取验证状态
function readValidationState(): ValidationState {
  // 优先从内存读取（适用于无服务器环境）
  if (globalThis.__captraValidationState) {
    return globalThis.__captraValidationState;
  }

  // 如果是无服务器环境，直接返回默认状态
  if (isServerlessEnvironment()) {
    return DEFAULT_STATE;
  }

  // 尝试从文件读取（适用于传统服务器环境）
  try {
    if (existsSync(VALIDATION_STATE_FILE)) {
      const data = readFileSync(VALIDATION_STATE_FILE, 'utf-8');
      const state = JSON.parse(data) as ValidationState;
      // 同时缓存到内存
      globalThis.__captraValidationState = state;
      return state;
    }
  } catch (error) {
    console.warn('读取验证状态文件失败，使用内存存储:', error);
  }
  
  return DEFAULT_STATE;
}

// 写入验证状态
function writeValidationState(state: ValidationState): void {
  // 始终写入内存（适用于所有环境）
  globalThis.__captraValidationState = state;

  // 如果不是无服务器环境，尝试写入文件
  if (!isServerlessEnvironment()) {
    try {
      writeFileSync(VALIDATION_STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
      console.warn('写入验证状态文件失败，仅使用内存存储:', error);
    }
  }
}

// 标记为已验证（测试成功时调用）
export function markAsVerified(testResult: {
  success: boolean;
  recognizedText?: string;
  processingTime?: number;
  error?: string;
}): void {
  const state: ValidationState = {
    isVerified: testResult.success,
    lastTestTime: Date.now(),
    lastTestResult: testResult,
  };
  writeValidationState(state);
}

// 检查验证状态
export function checkVerificationStatus(): 'verified' | 'pending' | 'failed' {
  const state = readValidationState();
  
  // 如果没有进行过测试，返回 pending
  if (state.lastTestTime === 0) {
    return 'pending';
  }
  
  // 如果最后一次测试失败，返回 failed
  if (state.lastTestResult && !state.lastTestResult.success) {
    return 'failed';
  }
  
  // 如果最后一次测试成功，返回 verified
  return state.isVerified ? 'verified' : 'pending';
}

// 获取最后一次测试结果
export function getLastTestResult() {
  const state = readValidationState();
  return {
    lastTestTime: state.lastTestTime,
    lastTestResult: state.lastTestResult,
  };
}

// 重置验证状态（可选，用于清除状态）
export function resetVerificationStatus(): void {
  writeValidationState(DEFAULT_STATE);
}
