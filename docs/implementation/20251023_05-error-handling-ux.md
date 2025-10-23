# エラーハンドリング & UX改善ガイド

**作成日**: 2025年10月23日
**Phase**: 5 - エラーハンドリング & UX改善
**所要時間**: 3時間

---

## 目次

1. [Phase概要](#1-phase概要)
2. [前提条件](#2-前提条件)
3. [包括的エラーハンドリング実装](#3-包括的エラーハンドリング実装)
4. [ローディング状態の最適化](#4-ローディング状態の最適化)
5. [トーストメッセージシステム](#5-トーストメッセージシステム)
6. [バリデーション強化](#6-バリデーション強化)
7. [マイクロインタラクション](#7-マイクロインタラクション)
8. [アクセシビリティ対応](#8-アクセシビリティ対応)
9. [完了チェックリスト](#9-完了チェックリスト)

---

## 1. Phase概要

### 1.1 目的

ユーザー体験を向上させ、エラーが発生した場合でも適切なフィードバックを提供することで、アプリケーションの使いやすさと信頼性を高めます。

### 1.2 達成目標

- [ ] 全てのエラーケースに適切なハンドリングを実装
- [ ] ローディング状態の視覚的フィードバックを改善
- [ ] ユーザーフレンドリーなエラーメッセージを実装
- [ ] バリデーションロジックを強化
- [ ] マイクロインタラクションで操作性を向上

### 1.3 成果物

- エラーハンドリング実装コード
- トーストメッセージコンポーネント
- ローディングインジケーター
- バリデーションスキーマ
- アクセシビリティ対応済みUI

---

## 2. 前提条件

### 2.1 完了していること

- [ ] Phase 4（データベース統合）が完了している
- [ ] 基本的なUI/UX機能が動作している
- [ ] AI統合が完了している

### 2.2 必要なパッケージ

```bash
# バリデーション用
npm install zod

# トーストメッセージ用（オプション）
npm install react-hot-toast

# アニメーション用
npm install framer-motion
```

---

## 3. 包括的エラーハンドリング実装

### 3.1 エラー型定義

```typescript
// src/types/errors.ts
export type ErrorCode =
  | 'INVALID_URL'
  | 'FETCH_FAILED'
  | 'PARSING_FAILED'
  | 'AI_API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'DATABASE_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  retryable?: boolean;
}

export class CustomError extends Error {
  code: ErrorCode;
  details?: string;
  retryable: boolean;

  constructor(code: ErrorCode, message: string, details?: string, retryable = false) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}
```

### 3.2 エラーメッセージ定義

```typescript
// src/lib/constants/errorMessages.ts
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_URL: '無効なURLです。正しいURL形式で入力してください。',
  FETCH_FAILED: '記事の取得に失敗しました。URLを確認してください。',
  PARSING_FAILED: '記事の解析に失敗しました。別の記事をお試しください。',
  AI_API_ERROR: 'AI処理でエラーが発生しました。しばらく待ってから再試行してください。',
  RATE_LIMIT_EXCEEDED: 'リクエスト制限に達しました。しばらく待ってから再試行してください。',
  INTERNAL_ERROR: 'サーバーエラーが発生しました。時間をおいて再試行してください。',
  NETWORK_ERROR: 'ネットワーク接続を確認してください。',
  DATABASE_ERROR: 'データの保存に失敗しました。再試行してください。',
};

export function getErrorMessage(code: ErrorCode, customMessage?: string): string {
  return customMessage || ERROR_MESSAGES[code];
}
```

### 3.3 エラーハンドリングユーティリティ

```typescript
// src/lib/utils/errorHandler.ts
import { CustomError } from '@/types/errors';
import type { ErrorCode } from '@/types/errors';

export function handleApiError(error: unknown): CustomError {
  // ネットワークエラー
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new CustomError(
      'NETWORK_ERROR',
      'ネットワーク接続を確認してください。',
      undefined,
      true
    );
  }

  // カスタムエラー
  if (error instanceof CustomError) {
    return error;
  }

  // レスポンスエラー
  if (error instanceof Response) {
    if (error.status === 429) {
      return new CustomError(
        'RATE_LIMIT_EXCEEDED',
        'リクエスト制限に達しました。',
        undefined,
        true
      );
    }
    if (error.status >= 500) {
      return new CustomError(
        'INTERNAL_ERROR',
        'サーバーエラーが発生しました。',
        `Status: ${error.status}`,
        true
      );
    }
  }

  // その他のエラー
  return new CustomError(
    'INTERNAL_ERROR',
    'エラーが発生しました。',
    error instanceof Error ? error.message : String(error),
    false
  );
}

export function isRetryableError(error: CustomError): boolean {
  return error.retryable || false;
}
```

### 3.4 エラーバウンダリコンポーネント

```typescript
// src/components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">エラーが発生しました</h2>
            </div>
            <p className="text-gray-600 mb-4">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {this.state.error && (
              <details className="mb-4 text-sm text-gray-500">
                <summary className="cursor-pointer font-medium">
                  エラー詳細
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3.5 API Routeでのエラーハンドリングパターン

```typescript
// src/app/api/summarize/route.ts (エラーハンドリング部分のみ)
import { NextResponse } from 'next/server';
import { CustomError } from '@/types/errors';
import { handleApiError } from '@/lib/utils/errorHandler';

export async function POST(request: Request) {
  try {
    // メイン処理...

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const appError = handleApiError(error);

    console.error('API Error:', {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
          retryable: appError.retryable,
        },
      },
      { status: appError.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 500 }
    );
  }
}
```

---

## 4. ローディング状態の最適化

### 4.1 スケルトンローディングコンポーネント

```typescript
// src/components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200
        rounded
        ${className}
      `}
    />
  );
}

// 要約結果のスケルトン
export function SummaryResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* 記事情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* 要約 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* 感想コメント */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 4.2 スピナーコンポーネント

```typescript
// src/components/ui/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="
        h-full w-full
        border-gray-200
        border-t-blue-600
        rounded-full
        animate-spin
      " />
    </div>
  );
}

// インラインスピナー（ボタン内など）
export function InlineSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
```

### 4.3 プログレスバーコンポーネント

```typescript
// src/components/ui/ProgressBar.tsx
interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

### 4.4 ローディング状態を持つフォーム

```typescript
// src/components/UrlInputForm.tsx (ローディング状態追加版)
'use client';

import { useState } from 'react';
import { InlineSpinner } from '@/components/ui/Spinner';

export function UrlInputForm({ onSubmit }: { onSubmit: (url: string) => Promise<void> }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="記事のURLを入力..."
          disabled={isLoading}
          className="
            flex-1 px-4 py-3
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors
          "
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="
            px-6 py-3
            bg-blue-600 hover:bg-blue-700
            text-white font-medium rounded-lg
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors
            flex items-center gap-2
          "
        >
          {isLoading ? (
            <>
              <InlineSpinner />
              <span>処理中...</span>
            </>
          ) : (
            '要約する'
          )}
        </button>
      </div>
    </form>
  );
}
```

---

## 5. トーストメッセージシステム

### 5.1 トーストコンポーネント

```typescript
// src/components/ui/Toast.tsx
'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div
      className={`
        ${bgColor} ${borderColor}
        border rounded-lg shadow-lg p-4
        max-w-md w-full
        animate-in slide-in-from-top-5 fade-in
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`${textColor} font-medium mb-1`}>{title}</p>
          )}
          <p className={`${textColor} text-sm`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 5.2 トースト管理Context

```typescript
// src/contexts/ToastContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: Omit<ToastMessage, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...message, id }]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

### 5.3 トーストの使用例

```typescript
// src/app/page.tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export default function HomePage() {
  const { showSuccess, showError } = useToast();

  const handleSummarize = async (url: string) => {
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize');
      }

      showSuccess('要約が完了しました!', '成功');
    } catch (error) {
      showError('要約の生成に失敗しました。', 'エラー');
    }
  };

  return (
    // ...
  );
}
```

---

## 6. バリデーション強化

### 6.1 URLバリデーションスキーマ

```typescript
// src/lib/validation/schemas.ts
import { z } from 'zod';

// URL検証スキーマ
export const urlSchema = z.string()
  .url('有効なURLを入力してください')
  .min(1, 'URLを入力してください')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    'HTTP/HTTPSプロトコルのURLを入力してください'
  );

// 要約リクエストスキーマ
export const summarizeRequestSchema = z.object({
  url: urlSchema,
  options: z.object({
    summaryLength: z.number().min(1).max(10).optional(),
    commentCount: z.number().min(1).max(5).optional(),
    tone: z.enum(['casual', 'formal', 'neutral']).optional(),
  }).optional(),
});

export type SummarizeRequest = z.infer<typeof summarizeRequestSchema>;
```

### 6.2 フォームバリデーションHook

```typescript
// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: unknown): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  return { validate, errors, clearErrors, getError };
}
```

### 6.3 バリデーション付きフォーム

```typescript
// src/components/UrlInputForm.tsx (バリデーション追加版)
'use client';

import { useState } from 'react';
import { urlSchema } from '@/lib/validation/schemas';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useToast } from '@/contexts/ToastContext';

export function UrlInputForm({ onSubmit }: { onSubmit: (url: string) => Promise<void> }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { validate, getError, clearErrors } = useFormValidation(urlSchema);
  const { showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validate(url)) {
      showError(getError('') || 'URLの形式が正しくありません', 'バリデーションエラー');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(url);
    } finally {
      setIsLoading(false);
    }
  };

  const error = getError('');

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              clearErrors();
            }}
            placeholder="記事のURLを入力..."
            disabled={isLoading}
            className={`
              flex-1 px-4 py-3
              border rounded-lg
              focus:outline-none focus:ring-2
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-colors
              ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
              }
            `}
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className="
              px-6 py-3
              bg-blue-600 hover:bg-blue-700
              text-white font-medium rounded-lg
              disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {isLoading ? '処理中...' : '要約する'}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  );
}
```

---

## 7. マイクロインタラクション

### 7.1 ボタンホバーアニメーション

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const variantStyles = {
    primary: `
      bg-blue-600 hover:bg-blue-700
      text-white shadow-sm
      hover:shadow-md
      active:scale-95
    `,
    secondary: `
      bg-gray-200 hover:bg-gray-300
      text-gray-800
      hover:shadow-sm
      active:scale-95
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      text-gray-700
      active:scale-95
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <InlineSpinner />
          処理中...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

### 7.2 コピーボタンアニメーション

```typescript
// src/components/CopyButton.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'コピー' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-3 py-2
        rounded-md text-sm font-medium
        transition-all duration-200
        ${copied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      `}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>コピーしました!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
```

### 7.3 カードホバーエフェクト

```typescript
// src/components/CommentCard.tsx
'use client';

interface CommentCardProps {
  comment: {
    id: number;
    text: string;
    tone: string;
  };
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div
      className="
        border border-gray-200 rounded-lg p-4
        transition-all duration-200
        hover:border-blue-300 hover:shadow-md
        hover:-translate-y-1
        cursor-pointer
      "
    >
      <p className="text-gray-800 mb-3">{comment.text}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase">{comment.tone}</span>
        <CopyButton text={comment.text} label="コピー" />
      </div>
    </div>
  );
}
```

---

## 8. アクセシビリティ対応

### 8.1 ARIA属性の追加

```typescript
// src/components/UrlInputForm.tsx (アクセシビリティ対応版)
export function UrlInputForm({ onSubmit }: { onSubmit: (url: string) => Promise<void> }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputId = 'url-input';
  const errorId = 'url-error';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="sr-only">
          記事のURL
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="記事のURLを入力..."
            disabled={isLoading}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className="..."
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            aria-busy={isLoading}
            aria-label={isLoading ? '処理中' : '要約を生成'}
            className="..."
          >
            {isLoading ? '処理中...' : '要約する'}
          </button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
```

### 8.2 キーボードナビゲーション

```typescript
// src/components/CommentList.tsx
'use client';

import { useRef, useEffect } from 'react';

export function CommentList({ comments }: { comments: Comment[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!listRef.current) return;

      const focusableElements = listRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement as HTMLElement
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
        nextElement?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevElement = focusableElements[currentIndex - 1] as HTMLElement;
        prevElement?.focus();
      }
    };

    listRef.current?.addEventListener('keydown', handleKeyDown);
    return () => {
      listRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={listRef}
      role="list"
      aria-label="感想コメント一覧"
      className="space-y-3"
    >
      {comments.map((comment) => (
        <div key={comment.id} role="listitem">
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  );
}
```

---

## 9. 完了チェックリスト

### 9.1 エラーハンドリング

- [ ] カスタムエラー型を定義
- [ ] エラーメッセージ定数を作成
- [ ] エラーハンドリングユーティリティを実装
- [ ] ErrorBoundaryコンポーネントを実装
- [ ] APIルートでエラーハンドリングを実装

### 9.2 ローディング状態

- [ ] Skeletonコンポーネントを実装
- [ ] Spinnerコンポーネントを実装
- [ ] ProgressBarコンポーネントを実装
- [ ] フォームにローディング状態を追加

### 9.3 トーストメッセージ

- [ ] Toastコンポーネントを実装
- [ ] ToastContextを実装
- [ ] useToastフックを実装
- [ ] アプリケーション全体でToastProviderを設定

### 9.4 バリデーション

- [ ] Zodバリデーションスキーマを作成
- [ ] useFormValidationフックを実装
- [ ] フォームにバリデーションを追加
- [ ] エラーメッセージを表示

### 9.5 マイクロインタラクション

- [ ] Buttonコンポーネントにアニメーションを追加
- [ ] CopyButtonを実装
- [ ] カードホバーエフェクトを追加

### 9.6 アクセシビリティ

- [ ] ARIA属性を追加
- [ ] キーボードナビゲーションを実装
- [ ] スクリーンリーダー対応を確認

### 9.7 動作確認

- [ ] 各種エラーケースでエラーメッセージが正しく表示される
- [ ] ローディング状態が正しく表示される
- [ ] トーストメッセージが正しく表示される
- [ ] バリデーションが正しく動作する
- [ ] アニメーションがスムーズに動作する
- [ ] キーボードで全ての操作が可能

---

## まとめ

Phase 5では、エラーハンドリング、ローディング状態、トーストメッセージ、バリデーション、マイクロインタラクション、アクセシビリティ対応を実装しました。これにより、ユーザー体験が大幅に向上し、より洗練されたアプリケーションになります。

### 次のステップ

次は **Phase 6: パフォーマンス最適化** に進みます。

```bash
# 次のドキュメント
docs/implementation/20251023_06-performance-optimization.md
```

---

**作成者**: Claude
**最終更新**: 2025年10月23日
