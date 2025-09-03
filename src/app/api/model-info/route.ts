import { NextResponse } from 'next/server';
import { config, validateConfig } from '@/lib/config/env';

export async function GET() {
  try {
    const configValidation = validateConfig();
    
    // 只返回公开的、非敏感的模型信息
    return NextResponse.json({
      success: true,
      modelName: config.modelName,
      requestFormat: config.requestFormat,
      status: configValidation.status,
    });
  } catch (error) {
    console.error('获取模型信息错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
