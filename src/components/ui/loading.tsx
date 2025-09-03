'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = '加载中...', className }: LoadingProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center",
      className
    )}>
      <div className="text-center">
        {/* 简单优雅的加载动画 */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-6"></div>
        
        {/* 加载文字 */}
        <p className="text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}
