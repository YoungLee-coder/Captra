import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/api/modelService';
import type { CaptchaRecognitionRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CaptchaRecognitionRequest = await request.json();
    
    if (!body.image) {
      return NextResponse.json(
        { success: false, error: '缺少图片数据' },
        { status: 400 }
      );
    }

    const modelService = ModelService.getInstance();
    const result = await modelService.recognizeCaptcha(body.image);

    return NextResponse.json(result);
  } catch (error) {
    console.error('验证码识别API错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求，用于CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
