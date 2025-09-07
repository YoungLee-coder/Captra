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

// 验证状态文件路径
const VALIDATION_STATE_FILE = join(process.cwd(), '.validation-state.json');

// 默认验证状态
const DEFAULT_STATE: ValidationState = {
  isVerified: false,
  lastTestTime: 0,
};

// 读取验证状态
function readValidationState(): ValidationState {
  try {
    if (existsSync(VALIDATION_STATE_FILE)) {
      const data = readFileSync(VALIDATION_STATE_FILE, 'utf-8');
      return JSON.parse(data) as ValidationState;
    }
  } catch (error) {
    console.warn('读取验证状态文件失败:', error);
  }
  return DEFAULT_STATE;
}

// 写入验证状态
function writeValidationState(state: ValidationState): void {
  try {
    writeFileSync(VALIDATION_STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('写入验证状态文件失败:', error);
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
