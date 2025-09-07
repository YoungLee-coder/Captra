'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  TestTube,
  Clock,
  Image as ImageIcon,
  Home,
  Info,
  Server,
  Code2
} from 'lucide-react';


interface ModelConfig {
  apiUrl: string;
  modelName: string;
  requestFormat: string;
  apiKey: string;
}

import type { TestResult, ConfigValidation } from '@/types';

export function AdminDashboard() {
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [validation, setValidation] = useState<ConfigValidation | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      const result = await response.json();
      
      if (result.success) {
        setConfig(result.config);
        setValidation(result.validation);
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/admin/test', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setTestResult(result.testResult);
        
        // 如果测试成功，重新加载配置以获取最新的验证状态
        if (result.testResult.success) {
          loadConfig();
        }
      } else {
        setTestResult({
          success: false,
          error: result.error,
        });
      }
    } catch {
      setTestResult({
        success: false,
        error: '测试请求失败',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.reload();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return <Loading message="加载配置信息..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">后台管理</h1>
            <p className="text-gray-600">Captra验证码识别服务管理面板</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 模型配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                模型配置详情
              </CardTitle>
              <CardDescription>
                当前模型配置信息和状态
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config && (
                <>
                  <div className="space-y-6">
                    {/* API地址 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">API地址</label>
                      </div>
                      <div className="relative">
                        <div className="font-mono text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg break-all text-gray-800">
                          {config.apiUrl}
                        </div>
                      </div>
                    </div>

                    {/* 模型配置网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">模型名称</label>
                        <div className="font-mono text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          {config.modelName}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">请求格式</label>
                        <div className="font-mono text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          {config.requestFormat.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* API密钥 */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">API密钥</label>
                      <div className="font-mono text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg break-all">
                        <span className="text-gray-600">{config.apiKey}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 配置验证状态 */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">配置验证状态</label>
                    {validation?.status === 'verified' ? (
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm text-green-800 font-medium">
                              配置验证通过，服务可正常使用
                            </div>
                            {validation.lastTestTime && (
                              <div className="text-xs text-green-600 mt-1">
                                最后测试: {new Date(validation.lastTestTime).toLocaleString('zh-CN')}
                              </div>
                            )}
                          </div>
                        </div>
                        {validation.lastTestResult && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-2">最后测试结果:</div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">识别结果: <span className="font-mono font-bold">{validation.lastTestResult.recognizedText || '无'}</span></span>
                              {validation.lastTestResult.processingTime && (
                                <span className="text-gray-500">{validation.lastTestResult.processingTime}ms</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : validation?.status === 'pending' ? (
                      <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="h-5 w-5 rounded-full border-2 border-yellow-600 border-t-transparent animate-spin mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-yellow-800 font-medium">
                          待验证 - 请运行模型测试以验证配置
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-red-800 flex-1">
                            <div className="font-medium mb-1">配置验证失败</div>
                            {validation?.errors && validation.errors.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 text-red-700">
                                {validation.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            )}
                            {validation?.lastTestTime && (
                              <div className="text-xs text-red-600 mt-2">
                                最后测试: {new Date(validation.lastTestTime).toLocaleString('zh-CN')}
                              </div>
                            )}
                          </div>
                        </div>
                        {validation?.lastTestResult && validation.lastTestResult.error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="text-xs text-red-600 mb-1">错误详情:</div>
                            <div className="text-sm text-red-800 font-mono">{validation.lastTestResult.error}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 模型测试 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                模型测试
              </CardTitle>
              <CardDescription>
                使用内置验证码图片测试模型识别能力
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTest} 
                disabled={testing || !validation?.isValid}
                className="w-full"
              >
                {testing ? '测试中...' : '开始测试'}
              </Button>

              {testResult && (
                <div className="space-y-4">
                  <Separator />
                  
                  {testResult.success ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        测试成功！识别结果: <strong>{testResult.recognizedText}</strong>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        测试失败: {testResult.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {testResult.processingTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      处理时间: {testResult.processingTime}ms
                    </div>
                  )}

                  {testResult.originalImage && (
                    <div>
                      <div className="flex items-center mb-2">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm text-gray-600">测试图片:</span>
                      </div>
                      <Image 
                        src={testResult.originalImage} 
                        alt="测试验证码" 
                        width={300}
                        height={120}
                        className="max-w-full h-auto border rounded-lg object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-2xl text-gray-800 flex items-center justify-center">
              <Info className="w-6 h-6 mr-3" />
              使用说明
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              配置和环境变量设置指南
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 配置说明 */}
              <div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
                    <Server className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">配置参数说明</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-800 font-semibold">API地址:</span>
                      <p className="text-gray-600 text-sm mt-1">第三方大模型的API端点地址</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-800 font-semibold">模型名称:</span>
                      <p className="text-gray-600 text-sm mt-1">使用的具体模型名称</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-800 font-semibold">请求格式:</span>
                      <p className="text-gray-600 text-sm mt-1">API的请求格式 (OpenAI 或 Anthropic)</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-800 font-semibold">API密钥:</span>
                      <p className="text-gray-600 text-sm mt-1">访问第三方服务的认证密钥</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 环境变量配置 */}
              <div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
                    <Code2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">环境变量配置</h3>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 font-medium mb-2">在 <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">.env.local</code> 文件中配置:</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                    <code className="text-gray-700 font-mono text-sm">ADMIN_PASSWORD</code>
                    <span className="text-gray-500 text-xs ml-2">后台管理密码</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                    <code className="text-gray-700 font-mono text-sm">API_URL</code>
                    <span className="text-gray-500 text-xs ml-2">模型API地址</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                    <code className="text-gray-700 font-mono text-sm">API_KEY</code>
                    <span className="text-gray-500 text-xs ml-2">模型API密钥</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-3 flex-shrink-0"></div>
                    <code className="text-gray-700 font-mono text-sm">MODEL_NAME</code>
                    <span className="text-gray-500 text-xs ml-2">模型名称</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 flex-shrink-0"></div>
                    <code className="text-gray-700 font-mono text-sm">REQUEST_FORMAT</code>
                    <span className="text-gray-500 text-xs ml-2">请求格式</span>
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
                  <p className="text-sm text-gray-700 font-medium mb-1">重要提醒</p>
                  <p className="text-sm text-gray-600">
                    修改环境变量后需要重启服务才能生效。建议在测试功能验证配置正确后再用于生产环境。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
