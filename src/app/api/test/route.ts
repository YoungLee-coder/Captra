import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/api/modelService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: '图片数据不能为空' },
        { status: 400 }
      );
    }

    // 验证base64格式
    if (typeof image !== 'string') {
      return NextResponse.json(
        { success: false, error: '图片数据格式错误' },
        { status: 400 }
      );
    }

    // 简单的base64格式验证
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(image)) {
      return NextResponse.json(
        { success: false, error: '图片base64编码格式无效' },
        { status: 400 }
      );
    }

    const modelService = ModelService.getInstance();
    const result = await modelService.recognizeCaptcha(image);
    
    return NextResponse.json({
      success: result.success,
      result: result.result,
      error: result.error,
      processingTime: result.processingTime,
    });

  } catch (error) {
    console.error('在线测试错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
