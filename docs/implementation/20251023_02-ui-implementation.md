# Phase 2: UI実装 - 詳細実装ガイド

**Phase**: 2/4
**推定時間**: 3-4時間
**前提条件**: Phase 1（プロジェクトセットアップ）完了
**次のPhase**: Phase 3 - AI統合

---

## 目次

1. [概要](#概要)
2. [共通UIコンポーネント実装](#共通uiコンポーネント実装)
3. [ホームページUI実装](#ホームページui実装)
4. [レスポンシブデザイン対応](#レスポンシブデザイン対応)
5. [アクセシビリティ対応](#アクセシビリティ対応)
6. [動作確認](#動作確認)
7. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 2では、AIパパっと要約 & 感想ジェネレーターのユーザーインターフェースを実装します。モバイルファーストのアプローチで、直感的で使いやすいUIを構築します。

### このPhaseで実現すること

- 共通UIコンポーネントの作成（Button、Input、Card等）
- ホームページのレイアウト実装
- URL入力フォームの実装
- 要約・感想表示エリアの実装
- レスポンシブデザイン対応
- ローディング状態の実装
- アクセシビリティ対応

---

## 共通UIコンポーネント実装

### ステップ 1: Button コンポーネント

`src/components/ui/button.tsx`を作成:

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500',
    outline:
      'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>処理中...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

---

### ステップ 2: Input コンポーネント

`src/components/ui/input.tsx`を作成:

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 border rounded-lg transition-colors',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

### ステップ 3: Card コンポーネント

`src/components/ui/card.tsx`を作成:

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-white rounded-lg p-6',
    bordered: 'bg-white rounded-lg border border-gray-200 p-6',
    elevated: 'bg-white rounded-lg shadow-lg p-6',
  };

  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-gray-700', className)} {...props}>
      {children}
    </div>
  );
}
```

---

### ステップ 4: Spinner コンポーネント

`src/components/ui/spinner.tsx`を作成:

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={cn(
        'inline-block rounded-full animate-spin border-blue-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="読み込み中"
    >
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
```

---

### ステップ 5: UIコンポーネントのエクスポート

`src/components/ui/index.ts`を作成:

```typescript
export { Button } from './button';
export type { ButtonProps } from './button';

export { Input } from './input';
export type { InputProps } from './input';

export { Card, CardHeader, CardTitle, CardContent } from './card';
export type { CardProps } from './card';

export { Spinner } from './spinner';
export type { SpinnerProps } from './spinner';
```

---

## ホームページUI実装

### ステップ 6: グローバルスタイル更新

`src/app/globals.css`を更新:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-gray-50 text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

---

### ステップ 7: ルートレイアウト更新

`src/app/layout.tsx`を更新:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIパパっと要約 & 感想ジェネレーター',
  description:
    'ニュース記事やブログのURLを入力するだけで、AIが即座に3行で要約し、SNS投稿用の感想コメントを3パターン生成します。',
  keywords: ['AI', '要約', '感想生成', 'SNS', 'タイパ'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'AIパパっと要約 & 感想ジェネレーター',
    description: 'AIが記事を3行で要約し、SNS投稿用の感想を3パターン生成',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                AIパパっと要約 & 感想ジェネレーター
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-sm text-gray-600">
                © 2025 AIパパっと要約 & 感想ジェネレーター. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
```

---

### ステップ 8: URL入力フォームコンポーネント

`src/components/UrlInputForm.tsx`を作成:

```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidUrl } from '@/lib/utils';

export interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    if (!isValidUrl(url)) {
      setError('有効なURLを入力してください');
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        placeholder="https://example.com/article"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={error}
        label="記事のURL"
        helperText="要約したい記事のURLを入力してください"
        fullWidth
        required
      />

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
        要約・感想を生成
      </Button>
    </form>
  );
}
```

---

### ステップ 9: 要約表示コンポーネント

`src/components/SummaryDisplay.tsx`を作成:

```typescript
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface SummaryDisplayProps {
  summary: {
    lines: string[];
    fullText: string;
  };
  article: {
    title: string;
    url: string;
    author?: string;
    publishedAt?: string;
  };
}

export function SummaryDisplay({ summary, article }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>要約</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{article.title}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-shrink-0"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>コピー済み</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>コピー</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {summary.lines.map((line, index) => (
            <div key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <p className="text-gray-800 leading-relaxed">{line}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            元の記事を読む →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### ステップ 10: 感想カードコンポーネント

`src/components/CommentCard.tsx`を作成:

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface CommentCardProps {
  comment: {
    id: number;
    text: string;
    tone: string;
    length: number;
  };
  index: number;
}

export function CommentCard({ comment, index }: CommentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(comment.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneLabels = {
    casual: 'カジュアル',
    formal: 'フォーマル',
    neutral: 'ニュートラル',
  };

  return (
    <Card variant="bordered">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              パターン {index + 1}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {toneLabels[comment.tone as keyof typeof toneLabels] || comment.tone}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>

        <p className="text-gray-800 leading-relaxed">{comment.text}</p>

        <div className="mt-3 text-xs text-gray-500">
          {comment.length}文字
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### ステップ 11: ホームページ実装

`src/app/page.tsx`を更新:

```typescript
'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/UrlInputForm';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { CommentCard } from '@/components/CommentCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface SummaryResult {
  article: {
    url: string;
    title: string;
    description?: string;
    publishedAt?: string;
    author?: string;
  };
  summary: {
    lines: string[];
    fullText: string;
  };
  comments: Array<{
    id: number;
    text: string;
    tone: string;
    length: number;
  }>;
  metadata: {
    generatedAt: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '要約生成に失敗しました');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          記事を3行で要約、SNS投稿用の感想を自動生成
        </h2>
        <p className="text-lg text-gray-600">
          URLを入力するだけで、AIが記事の本質を抽出し、投稿用の感想コメントを3パターン生成します
        </p>
      </div>

      {/* Input Form */}
      <Card variant="elevated">
        <CardContent className="p-6">
          <UrlInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600">AI処理中...しばらくお待ちください</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">エラーが発生しました</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <SummaryDisplay summary={result.summary} article={result.article} />

          {/* Comments */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              SNS投稿用の感想（3パターン）
            </h3>
            <div className="grid gap-4 md:grid-cols-1">
              {result.comments.map((comment, index) => (
                <CommentCard key={comment.id} comment={comment} index={index} />
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="text-center text-sm text-gray-500">
            処理時間: {(result.metadata.processingTime / 1000).toFixed(1)}秒 |
            使用トークン: {result.metadata.tokensUsed.toLocaleString()}
          </div>
        </div>
      )}

      {/* Features Section */}
      {!result && !isLoading && (
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">⚡ 高速処理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                最新のAI技術により、数秒で要約と感想を生成
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">📱 スマホ対応</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                モバイルでもPCでも快適に使用可能
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">🎯 3パターン生成</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                異なる視点の感想を3パターン提供
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
```

---

## レスポンシブデザイン対応

### ステップ 12: モバイル最適化確認

以下のブレークポイントで表示を確認:

- **モバイル**: 375px - 768px
- **タブレット**: 768px - 1024px
- **デスクトップ**: 1024px以上

Tailwindのレスポンシブクラスを活用:

```typescript
// モバイルファースト
<div className="text-base md:text-lg lg:text-xl">

// グリッドレイアウト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// パディング調整
<div className="px-4 md:px-6 lg:px-8">
```

---

## アクセシビリティ対応

### ステップ 13: ARIA属性の追加

すべてのコンポーネントで適切なARIA属性を確認:

```typescript
// ボタン
<button aria-label="コピー" aria-pressed={copied}>

// 入力フィールド
<input aria-invalid={error ? 'true' : 'false'} aria-describedby="error-msg">

// ローディング
<div role="status" aria-label="読み込み中">
```

---

## 動作確認

### ステップ 14: 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

### ステップ 15: UI確認項目

- [ ] ヘッダーが正しく表示される
- [ ] URL入力フォームが表示される
- [ ] プレースホルダーテキストが表示される
- [ ] ボタンをクリックできる
- [ ] レスポンシブデザインが機能する（モバイル・タブレット・デスクトップ）
- [ ] フォーカス状態が視覚的に分かる
- [ ] エラーメッセージが表示される

### ステップ 16: アクセシビリティテスト

1. **キーボード操作**:
   - Tabキーでフォーカス移動
   - Enterキーでフォーム送信
   - Escapeキーでモーダル閉じる

2. **スクリーンリーダー**:
   - NVDAまたはJAWSで読み上げテスト
   - すべての要素が適切に読み上げられるか確認

---

## 成果物チェックリスト

Phase 2完了時に以下をすべて確認:

### コンポーネント確認

- [ ] `Button` コンポーネントが動作する
- [ ] `Input` コンポーネントが動作する
- [ ] `Card` コンポーネントが動作する
- [ ] `Spinner` コンポーネントが動作する
- [ ] `UrlInputForm` コンポーネントが動作する
- [ ] `SummaryDisplay` コンポーネントが動作する
- [ ] `CommentCard` コンポーネントが動作する

### UI/UX確認

- [ ] ホームページが正しく表示される
- [ ] URL入力フォームが機能する
- [ ] バリデーションエラーが表示される
- [ ] ローディング状態が表示される
- [ ] レスポンシブデザインが機能する
- [ ] コピーボタンが機能する

### アクセシビリティ確認

- [ ] キーボード操作が可能
- [ ] フォーカス状態が視覚的に分かる
- [ ] ARIA属性が適切に設定されている
- [ ] スクリーンリーダーで読み上げ可能

---

## まとめ

Phase 2では、AIパパっと要約 & 感想ジェネレーターの完全なUIを実装しました。

**達成したこと:**
- 再利用可能な共通UIコンポーネントの作成
- ホームページのレイアウト実装
- URL入力フォームの実装
- 要約・感想表示エリアの実装
- レスポンシブデザイン対応
- アクセシビリティ対応

**次のステップ:**
Phase 3のドキュメント（`20251023_03-ai-integration.md`）を参照して、AI統合に進んでください。

---

**所要時間（実績）:** _____分
**遭遇した問題:** _______________
**メモ:** _______________

**Phase 2 完了日:** ___________
**次のPhase開始予定日:** ___________

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
