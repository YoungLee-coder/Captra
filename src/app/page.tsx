'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Code, TestTube, Github, Send, Database, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentDomain, setCurrentDomain] = useState('your-domain');

  useEffect(() => {
    // 在客户端获取当前域名
    if (typeof window !== 'undefined') {
      setCurrentDomain(window.location.origin);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Title Section */}
        <div className="text-center mb-8 mt-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Captra
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于AI大模型的验证码识别API服务
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center items-center mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className="px-6 py-3">
                  <Settings className="w-4 h-4 mr-2" />
                  后台管理
                </Button>
              </Link>
              <Link href="/test">
                <Button variant="default" className="px-6 py-3">
                  <TestTube className="w-4 h-4 mr-2" />
                  在线测试
                </Button>
              </Link>
              <a 
                href="https://github.com/YoungLee-coder/Captra" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="px-6 py-3">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub 源码
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* API文档 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                API 调用文档
              </CardTitle>
              <CardDescription>
                简单易用的RESTful API接口
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API端点信息 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Send className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">API 端点</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">接口地址</span>
                    <code className="bg-white px-3 py-1 rounded-md text-blue-800 font-mono text-sm border">/api/recognize</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">请求方法</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md font-bold text-sm">POST</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">内容类型</span>
                    <code className="bg-white px-3 py-1 rounded-md text-gray-800 font-mono text-sm border">application/json</code>
                  </div>
                </div>
              </div>

              {/* 请求格式 */}
              <div>
                <div className="flex items-center mb-3">
                  <Database className="w-5 h-5 mr-2 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">请求格式</h3>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "image": "base64编码的图片数据"
}`}
                  </pre>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>image:</strong> 验证码图片的base64编码字符串（必填）
                </p>
              </div>

              {/* 响应格式 */}
              <div>
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">响应格式</h3>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`// 成功响应
{
  "success": true,
  "result": "ABC123",
  "processingTime": 1200
}

// 失败响应
{
  "success": false,
  "error": "错误描述",
  "processingTime": 800
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 代码示例 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                代码示例
              </CardTitle>
              <CardDescription>
                多种编程语言的快速调用示例
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* JavaScript/TypeScript示例 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">JavaScript / TypeScript</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">推荐</span>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <pre className="text-sm">
{`// 上传并识别验证码
const recognizeCaptcha = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  // 转换为base64
  const base64 = await fileToBase64(imageFile);
  
  const response = await fetch('${currentDomain}/api/recognize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 })
  });
  
  const result = await response.json();
  return result.success ? result.result : null;
};`}
                  </pre>
                </div>
              </div>

              {/* Python示例 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Python</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <pre className="text-sm">
{`import requests
import base64

def recognize_captcha(image_path):
    # 读取并编码图片
    with open(image_path, 'rb') as f:
        image_b64 = base64.b64encode(f.read()).decode()
    
    # 调用API
    response = requests.post(
        '${currentDomain}/api/recognize',
        json={'image': image_b64}
    )
    
    result = response.json()
    return result.get('result') if result.get('success') else None`}
                  </pre>
                </div>
              </div>

              {/* cURL示例 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">cURL</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
                  <pre className="text-sm">
{`curl -X POST ${currentDomain}/api/recognize \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ..."
  }'`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>© 2025 Captra. </p>
        </div>
      </div>
    </div>
  );
}