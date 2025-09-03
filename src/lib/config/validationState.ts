// 使用全局变量存储验证状态，确保在所有API路由之间共享
declare global {
  var __capturaVerified: boolean | undefined;
}

// 初始化全局验证状态
if (typeof globalThis.__capturaVerified === 'undefined') {
  globalThis.__capturaVerified = false;
}

export function markAsVerified() {
  globalThis.__capturaVerified = true;
}

export function checkVerificationStatus(): 'verified' | 'pending' {
  return globalThis.__capturaVerified ? 'verified' : 'pending';
}

export function resetVerificationStatus() {
  globalThis.__capturaVerified = false;
}
