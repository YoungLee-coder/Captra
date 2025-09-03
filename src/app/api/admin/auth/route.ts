import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config/env';
import type { AdminAuthRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AdminAuthRequest = await request.json();
    
    if (!body.password) {
      return NextResponse.json(
        { success: false, error: '密码不能为空' },
        { status: 400 }
      );
    }

    const isValid = body.password === config.adminPassword;
    
    if (isValid) {
      // 创建会话token（简单实现）
      const token = Buffer.from(`${Date.now()}-${config.adminPassword}`).toString('base64');
      
      const response = NextResponse.json({ success: true });
      
      // 设置HttpOnly cookie
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24小时
      });
      
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('后台认证错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // 登出功能 - 清除cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}
