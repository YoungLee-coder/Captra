import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings, Code, TestTube, Github } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Title Section */}
        <div className="text-center mb-12 mt-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Captra
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            基于AI大模型的验证码识别API服务
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* API文档 */}
          <Card>
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
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">基本信息</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>接口地址:</strong> <code>/api/recognize</code></p>
                  <p><strong>请求方法:</strong> <code>POST</code></p>
                  <p><strong>内容类型:</strong> <code>application/json</code></p>
                </div>
              </div>

              <Separator />

              {/* 请求参数 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">请求参数</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm">
{`{
  "image": "base64编码的图片数据",
  "format": "base64" // 可选，默认为base64
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* 响应格式 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">响应格式</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm">
{`{
  "success": true,
  "result": "识别出的验证码文本",
  "processingTime": 1500 // 处理时间(毫秒)
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 代码示例 */}
          <Card>
            <CardHeader>
              <CardTitle>代码示例</CardTitle>
              <CardDescription>
                多种编程语言的调用示例
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* JavaScript示例 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">JavaScript</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`const response = await fetch('/api/recognize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQ...'
  })
});

const result = await response.json();
console.log(result.result); // 验证码结果`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Python示例 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Python</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`import requests
import base64

# 读取图片并转换为base64
with open('captcha.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode()

response = requests.post('your-domain/api/recognize', 
    json={'image': image_base64})
    
result = response.json()
print(result['result'])  # 验证码结果`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* cURL示例 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">cURL</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`curl -X POST your-domain/api/recognize \\
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



        {/* Action Buttons */}
        <div className="flex justify-center items-center mt-16 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin">
              <Button variant="outline" className="px-6 py-3">
                <Settings className="w-4 h-4 mr-2" />
                进入后台管理
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

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>© 2025 Captra. </p>
        </div>
      </div>
    </div>
  );
}