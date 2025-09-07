import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/api/modelService';
import { config, validateConfig } from '@/lib/config/env';
import { getLastTestResult } from '@/lib/config/validationState';

// 验证管理员权限的中间件函数
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    return false;
  }
  
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    return decoded.includes(config.adminPassword);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: '未授权访问' },
      { status: 401 }
    );
  }

  try {
    const modelService = ModelService.getInstance();
    const modelConfig = modelService.getModelConfig();
    const configValidation = validateConfig();
    const lastTestResult = getLastTestResult();
    
    return NextResponse.json({
      success: true,
      config: modelConfig,
      validation: {
        ...configValidation,
        lastTestTime: lastTestResult.lastTestTime,
        lastTestResult: lastTestResult.lastTestResult,
      },
    });
  } catch (error) {
    console.error('获取配置错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
