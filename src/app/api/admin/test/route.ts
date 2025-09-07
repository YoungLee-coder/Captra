import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/api/modelService';
import { config } from '@/lib/config/env';
import { markAsVerified } from '@/lib/config/validationState';
import path from 'path';
import fs from 'fs';

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

// 获取用户提供的测试验证码图片
function getTestCaptchaImage() {
  try {
    // 构建图片文件路径
    const imagePath = path.join(process.cwd(), 'public', 'test-images', 'test-captcha.png');
    
    // 检查文件是否存在
    if (!fs.existsSync(imagePath)) {
      throw new Error('测试图片文件不存在: test-captcha.png');
    }
    
    // 读取图片文件并转换为base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    return base64Image;
  } catch (error) {
    console.error('读取测试图片失败:', error);
    // 如果读取失败，返回一个默认的测试图片
    return 'PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj7lvJXluLjlpIHotKU8L3RleHQ+PC9zdmc+';
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: '未授权访问' },
      { status: 401 }
    );
  }

  try {
    const modelService = ModelService.getInstance();
    const testImage = getTestCaptchaImage();
    
    const result = await modelService.recognizeCaptcha(testImage);
    
    // 构建测试结果
    const testResult = {
      success: result.success,
      recognizedText: result.result,
      processingTime: result.processingTime,
      error: result.error,
    };
    
    // 更新验证状态（无论成功还是失败都记录）
    markAsVerified(testResult);
    
    return NextResponse.json({
      success: true,
      testResult: {
        ...testResult,
        originalImage: `data:image/png;base64,${testImage}`,
      },
    });
  } catch (error) {
    console.error('测试模型错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
