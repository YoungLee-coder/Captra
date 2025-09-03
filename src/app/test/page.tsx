'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Home, Upload, Eye, Clock, TestTube, FileImage, CheckCircle2, Info } from 'lucide-react';

interface TestResult {
  success: boolean;
  result?: string;
  error?: string;
  processingTime?: number;
}

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
      }
      
      // 检查文件大小 (限制5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB！');
        return;
      }

      setSelectedFile(file);
      
      // 创建预览URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setTestResult(null); // 清除之前的结果
    }
  };

  const handleUploadTest = async () => {
    if (!selectedFile) {
      alert('请先选择图片！');
      return;
    }

    setIsUploading(true);
    setTestResult(null);

    try {
      // 将图片转换为base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // 移除data:image/...;base64,前缀，只保留base64数据
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // 调用测试API
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
        }),
      });

      const result = await response.json();
      setTestResult(result);

    } catch (error) {
      console.error('上传测试失败:', error);
      setTestResult({
        success: false,
        error: '上传测试失败，请重试',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetTest = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTestResult(null);
    // 清理预览URL以释放内存
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-0">
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
          
          {/* 居中的标题和描述 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">在线测试</h1>
            <p className="text-lg text-gray-600">
              上传验证码图片，体验AI识别服务
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* 图片上传区 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  上传验证码图片
                </CardTitle>
                <CardDescription>
                  支持 PNG、JPG、JPEG 格式，最大 5MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 文件选择 */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-medium
                             file:bg-gray-50 file:text-gray-700
                             hover:file:bg-gray-100
                             border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* 图片预览 */}
                {previewUrl && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">预览:</p>
                    <Image
                      src={previewUrl}
                      alt="验证码预览"
                      width={200}
                      height={160}
                      className="max-w-full max-h-40 mx-auto border border-gray-300 rounded object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      文件: {selectedFile?.name} ({(selectedFile?.size || 0 / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleUploadTest}
                    disabled={!selectedFile || isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white mr-2"></div>
                        识别中...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        开始识别
                      </>
                    )}
                  </Button>
                  
                  {selectedFile && (
                    <Button
                      variant="outline"
                      onClick={resetTest}
                      disabled={isUploading}
                    >
                      重置
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 识别结果区 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  识别结果
                </CardTitle>
                <CardDescription>
                  AI模型识别的验证码内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!testResult ? (
                  <div className="text-center text-gray-500 py-8">
                    请上传图片并开始识别...
                  </div>
                ) : testResult.success ? (
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">
                        <strong>识别成功！</strong>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">识别结果:</p>
                      <p className="text-2xl font-mono font-bold text-gray-800 break-all">
                        {testResult.result}
                      </p>
                    </div>
                    
                    {testResult.processingTime && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        处理时间: {testResult.processingTime}ms
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      <strong>识别失败:</strong> {testResult.error || '未知错误'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 使用说明 */}
          <Card className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-2xl text-gray-800 flex items-center justify-center">
                <Info className="w-6 h-6 mr-3" />
                使用说明
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                了解如何获得最佳的验证码识别效果
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* 支持格式 */}
                <div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
                      <FileImage className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">支持的图片格式</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">PNG 格式</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">JPG/JPEG 格式</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">文件大小不超过 5MB</span>
                    </div>
                  </div>
                </div>
                
                {/* 最佳效果 */}
                <div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
                      <CheckCircle2 className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">识别效果最佳的图片</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">图片清晰，文字易读</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">验证码字符较大</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">背景与文字对比度高</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 底部提示 */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium mb-1">温馨提示</p>
                    <p className="text-sm text-gray-600">
                      为了获得最佳识别效果，建议上传清晰、对比度高的验证码图片。模型支持英文、数字和简单符号的识别。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p>© 2025 Captra. 基于AI大模型的验证码识别服务</p>
          </div>
        </div>
      </div>
    </div>
  );
}
