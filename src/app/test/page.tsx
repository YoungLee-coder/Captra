'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Home, Upload, Eye, Clock, TestTube, Settings } from 'lucide-react';

interface TestResult {
  success: boolean;
  result?: string;
  error?: string;
  processingTime?: number;
}

interface ModelInfo {
  modelName: string;
  requestFormat: string;
  status: 'verified' | 'pending' | 'failed';
}

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  // 获取模型信息
  useEffect(() => {
    const loadModelInfo = async () => {
      try {
        const response = await fetch('/api/model-info');
        const result = await response.json();
        
        if (result.success) {
          setModelInfo({
            modelName: result.modelName,
            requestFormat: result.requestFormat,
            status: result.status,
          });
        }
      } catch (error) {
        console.error('获取模型信息失败:', error);
      }
    };

    loadModelInfo();
  }, []);

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

          {/* 模型信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                模型信息
              </CardTitle>
              <CardDescription>
                当前验证码识别模型的配置状态
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modelInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">模型名称:</span>
                    <span className="text-gray-800 font-bold">{modelInfo.modelName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">运行状态:</span>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        modelInfo.status === 'verified' ? 'bg-green-500' :
                        modelInfo.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className={`font-medium ${
                        modelInfo.status === 'verified' ? 'text-green-600' :
                        modelInfo.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {modelInfo.status === 'verified' ? '已验证' :
                         modelInfo.status === 'pending' ? '待验证' : '配置错误'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mx-auto mb-2"></div>
                  正在加载...
                </div>
              )}
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
