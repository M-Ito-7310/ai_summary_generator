# パフォーマンス最適化ガイド

**作成日**: 2025年10月23日
**Phase**: 6 - パフォーマンス最適化
**所要時間**: 2時間

---

## 目次

1. [Phase概要](#1-phase概要)
2. [前提条件](#2-前提条件)
3. [バンドルサイズ最適化](#3-バンドルサイズ最適化)
4. [レンダリング最適化](#4-レンダリング最適化)
5. [データ取得最適化](#5-データ取得最適化)
6. [画像最適化](#6-画像最適化)
7. [キャッシング戦略](#7-キャッシング戦略)
8. [コード分割](#8-コード分割)
9. [Lighthouse最適化](#9-lighthouse最適化)
10. [完了チェックリスト](#10-完了チェックリスト)

---

## 1. Phase概要

### 1.1 目的

アプリケーションのパフォーマンスを最適化し、高速なユーザー体験を提供します。特に初回ロード時間、インタラクティブまでの時間を短縮します。

### 1.2 達成目標

- [ ] Lighthouse Performance スコア90以上
- [ ] 初回ロード時間2秒以内
- [ ] Time to Interactive (TTI) 3秒以内
- [ ] バンドルサイズの削減
- [ ] API レスポンスタイムの最適化

### 1.3 成果物

- 最適化されたNext.js設定
- パフォーマンス改善コード
- キャッシング実装
- Lighthouseレポート

---

## 2. 前提条件

### 2.1 完了していること

- [ ] Phase 5（エラーハンドリング & UX改善）が完了している
- [ ] 全ての主要機能が実装されている
- [ ] 基本的なUI/UXが完成している

### 2.2 測定ツール

```bash
# Lighthouse CLI インストール
npm install -g lighthouse

# Bundle Analyzer インストール
npm install --save-dev @next/bundle-analyzer
```

---

## 3. バンドルサイズ最適化

### 3.1 Bundle Analyzer設定

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWCミニファイヤー有効化（高速化）
  swcMinify: true,

  // 本番ビルドでソースマップを無効化
  productionBrowserSourceMaps: false,

  // 画像最適化設定
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // 実験的機能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

### 3.2 バンドル分析実行

```bash
# バンドル分析を実行
ANALYZE=true npm run build

# ブラウザが開き、バンドルサイズの視覚化が表示されます
```

### 3.3 不要なパッケージの削除

```bash
# 使用していないパッケージを確認
npm ls

# 不要なパッケージを削除
npm uninstall <package-name>

# 依存関係を整理
npm prune
```

### 3.4 軽量パッケージへの置き換え

```typescript
// 重い: moment.js (約300KB)
import moment from 'moment';

// 軽い: date-fns (約5KB、必要な関数のみインポート)
import { format, parseISO } from 'date-fns';

// 使用例
const formattedDate = format(new Date(), 'yyyy-MM-dd');
```

### 3.5 Tree Shakingの活用

```typescript
// 悪い例: ライブラリ全体をインポート
import * as icons from 'lucide-react';

// 良い例: 必要なアイコンのみインポート
import { Copy, Check, AlertCircle } from 'lucide-react';
```

---

## 4. レンダリング最適化

### 4.1 React.memoの活用

```typescript
// src/components/SummaryDisplay.tsx
import { memo } from 'react';

interface SummaryDisplayProps {
  summary: {
    lines: string[];
    fullText: string;
  };
}

export const SummaryDisplay = memo(function SummaryDisplay({
  summary,
}: SummaryDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">要約</h2>
      <div className="space-y-2">
        {summary.lines.map((line, index) => (
          <p key={index} className="text-gray-700">
            {index + 1}. {line}
          </p>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // カスタム比較関数: 要約が変わっていなければ再レンダリングしない
  return prevProps.summary.fullText === nextProps.summary.fullText;
});
```

### 4.2 useMemoの活用

```typescript
// src/components/CommentList.tsx
'use client';

import { useMemo } from 'react';

interface Comment {
  id: number;
  text: string;
  tone: string;
  length: number;
}

export function CommentList({ comments }: { comments: Comment[] }) {
  // 重い計算をメモ化
  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => b.length - a.length);
  }, [comments]);

  // トーン別にグループ化（メモ化）
  const commentsByTone = useMemo(() => {
    return comments.reduce((acc, comment) => {
      if (!acc[comment.tone]) {
        acc[comment.tone] = [];
      }
      acc[comment.tone].push(comment);
      return acc;
    }, {} as Record<string, Comment[]>);
  }, [comments]);

  return (
    <div className="space-y-4">
      {sortedComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

### 4.3 useCallbackの活用

```typescript
// src/app/page.tsx
'use client';

import { useState, useCallback } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  // コールバック関数をメモ化
  const handleSummarize = useCallback(async (inputUrl: string) => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: inputUrl }),
    });

    const data = await response.json();
    setResult(data);
  }, []);

  // URL変更ハンドラーもメモ化
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  return (
    <div>
      <UrlInputForm
        value={url}
        onChange={handleUrlChange}
        onSubmit={handleSummarize}
      />
      {result && <SummaryDisplay summary={result.summary} />}
    </div>
  );
}
```

### 4.4 仮想化（長いリスト用）

```typescript
// src/components/HistoryList.tsx (仮想化実装)
'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 各アイテムの推定高さ
    overscan: 5, // 表示領域外に追加でレンダリングする数
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <HistoryCard item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. データ取得最適化

### 5.1 API ルートの最適化

```typescript
// src/app/api/summarize/route.ts (最適化版)
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Edge Runtimeを使用（高速化）
export const runtime = 'edge';

// キャッシュ設定
export const revalidate = 3600; // 1時間キャッシュ

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 並列処理でパフォーマンス向上
    const [article, summaryResult] = await Promise.all([
      fetchArticle(body.url),
      // 他の非同期処理
    ]);

    // 要約と感想を並列生成
    const [summary, comments] = await Promise.all([
      generateSummary(article.content),
      generateComments(article.content),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        article,
        summary,
        comments,
        metadata: {
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
```

### 5.2 並列処理パターン

```typescript
// src/lib/ai.ts (並列処理版)
export async function generateSummaryAndComments(content: string) {
  // 並列実行で時間短縮
  const [summary, comments] = await Promise.all([
    openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content },
      ],
    }),
    openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: COMMENT_PROMPT },
        { role: 'user', content },
      ],
    }),
  ]);

  return {
    summary: parseSummary(summary),
    comments: parseComments(comments),
  };
}
```

### 5.3 リクエストのデバウンス

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用例
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // APIリクエストは500ms後に実行
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

---

## 6. 画像最適化

### 6.1 Next.js Imageコンポーネントの使用

```typescript
// src/components/ArticlePreview.tsx
import Image from 'next/image';

export function ArticlePreview({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {article.ogImage && (
        <div className="relative w-full h-48">
          <Image
            src={article.ogImage}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false} // 遅延ロード
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // 低品質プレースホルダー
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold">{article.title}</h3>
      </div>
    </div>
  );
}
```

### 6.2 ファビコン・ロゴの最適化

```typescript
// public/images内の画像を最適化
// - SVGフォーマットを優先使用
// - PNGの場合はTinyPNGで圧縮
// - WebP/AVIFフォーマットを提供
```

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};
```

---

## 7. キャッシング戦略

### 7.1 サーバーサイドキャッシング

```typescript
// src/lib/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // TTL チェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = new SimpleCache();
```

### 7.2 記事取得のキャッシング

```typescript
// src/lib/scraper.ts (キャッシング追加版)
import { cache } from './cache';

export async function fetchArticle(url: string) {
  // キャッシュチェック
  const cacheKey = `article:${url}`;
  const cached = cache.get<ArticleData>(cacheKey);

  if (cached) {
    console.log('Cache hit:', url);
    return cached;
  }

  // キャッシュミス: 記事を取得
  console.log('Cache miss:', url);
  const article = await scrapeArticle(url);

  // キャッシュに保存（1時間）
  cache.set(cacheKey, article, 3600000);

  return article;
}
```

### 7.3 クライアントサイドキャッシング（SWR）

```bash
npm install swr
```

```typescript
// src/hooks/useSummaryHistory.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSummaryHistory() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/history',
    fetcher,
    {
      revalidateOnFocus: false, // フォーカス時の再検証を無効化
      revalidateOnReconnect: true, // 再接続時は再検証
      dedupingInterval: 60000, // 60秒間は重複リクエストを排除
    }
  );

  return {
    history: data?.data?.items || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// 使用例
function HistoryPage() {
  const { history, isLoading, refresh } = useSummaryHistory();

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <button onClick={refresh}>更新</button>
      <HistoryList items={history} />
    </div>
  );
}
```

### 7.4 HTTP キャッシュヘッダー

```typescript
// src/app/api/history/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const data = await getHistoryData();

  const response = NextResponse.json({
    success: true,
    data,
  });

  // キャッシュヘッダーを設定
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  return response;
}
```

---

## 8. コード分割

### 8.1 動的インポート

```typescript
// src/app/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 動的インポート（遅延ロード）
const SummaryDisplay = dynamic(
  () => import('@/components/SummaryDisplay').then((mod) => mod.SummaryDisplay),
  {
    loading: () => <SummaryResultSkeleton />,
    ssr: false, // クライアントサイドのみでレンダリング
  }
);

const CommentList = dynamic(
  () => import('@/components/CommentList'),
  {
    loading: () => <div>読み込み中...</div>,
  }
);

export default function HomePage() {
  const [showResult, setShowResult] = useState(false);

  return (
    <div>
      <UrlInputForm onSubmit={handleSummarize} />

      {showResult && (
        <Suspense fallback={<SummaryResultSkeleton />}>
          <SummaryDisplay summary={result.summary} />
          <CommentList comments={result.comments} />
        </Suspense>
      )}
    </div>
  );
}
```

### 8.2 ルートベースのコード分割

Next.jsは自動的にページごとにコードを分割しますが、さらに最適化できます:

```typescript
// src/app/history/page.tsx
// この部分は /history ルートにアクセスしたときのみロードされる

import { HistoryList } from '@/components/HistoryList';

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div>
      <h1>履歴</h1>
      <HistoryList items={history} />
    </div>
  );
}
```

### 8.3 フォント最適化

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

// フォントをサブセット化して最適化
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT（Flash of Unstyled Text）を防ぐ
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

---

## 9. Lighthouse最適化

### 9.1 Lighthouse実行

```bash
# ローカルで開発サーバー起動
npm run dev

# 別ターミナルでLighthouse実行
lighthouse http://localhost:3000 --view

# または本番ビルドでテスト
npm run build
npm start
lighthouse http://localhost:3000 --view --preset=desktop
```

### 9.2 Performance メトリクス目標

| メトリクス | 目標値 | 説明 |
|----------|-------|------|
| First Contentful Paint (FCP) | < 1.8秒 | 最初のコンテンツが表示されるまで |
| Largest Contentful Paint (LCP) | < 2.5秒 | 最大コンテンツが表示されるまで |
| Total Blocking Time (TBT) | < 200ms | メインスレッドのブロック時間 |
| Cumulative Layout Shift (CLS) | < 0.1 | レイアウトのずれ |
| Speed Index | < 3.4秒 | ページ表示の視覚的な完成度 |

### 9.3 Lighthouse スコア改善チェックリスト

#### Performance

- [ ] 画像を最適化（WebP/AVIF）
- [ ] 未使用のJavaScriptを削除
- [ ] テキスト圧縮を有効化（gzip/brotli）
- [ ] 効率的なキャッシュポリシー
- [ ] レンダリングをブロックするリソースを排除
- [ ] 遅延ロードを実装
- [ ] サードパーティコードの影響を最小化

#### Accessibility

- [ ] 画像にalt属性を追加
- [ ] 十分なカラーコントラスト
- [ ] フォームにlabelを追加
- [ ] ARIA属性を適切に使用
- [ ] キーボードナビゲーション対応

#### Best Practices

- [ ] HTTPS使用
- [ ] コンソールエラーなし
- [ ] 廃止予定のAPIを使用していない
- [ ] 適切なドキュメントタイプ宣言
- [ ] 適切な画像アスペクト比

#### SEO

- [ ] metaタグ設定
- [ ] 有効なrobots.txt
- [ ] 構造化データ（JSON-LD）
- [ ] 適切な見出し階層
- [ ] モバイルフレンドリー

### 9.4 SEO最適化

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AIパパっと要約 & 感想ジェネレーター',
    template: '%s | AI要約',
  },
  description: 'ニュース記事やブログのURLをペーストするだけで、AIが即座に3行で要約し、SNS投稿用の感想コメントを3パターン生成します。',
  keywords: ['AI', '要約', 'SNS', '感想', 'ジェネレーター', 'ニュース'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ai-summary-generator.vercel.app',
    title: 'AIパパっと要約 & 感想ジェネレーター',
    description: 'AIが記事を3行で要約し、SNS投稿用の感想を自動生成',
    siteName: 'AI要約ジェネレーター',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI要約ジェネレーター',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIパパっと要約 & 感想ジェネレーター',
    description: 'AIが記事を3行で要約し、SNS投稿用の感想を自動生成',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
```

### 9.5 構造化データ（JSON-LD）

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AIパパっと要約 & 感想ジェネレーター',
    description: 'AIが記事を3行で要約し、SNS投稿用の感想を自動生成するWebアプリケーション',
    url: 'https://ai-summary-generator.vercel.app',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 10. 完了チェックリスト

### 10.1 バンドルサイズ最適化

- [ ] Bundle Analyzerで分析
- [ ] 不要なパッケージを削除
- [ ] 軽量パッケージに置き換え
- [ ] Tree Shakingを活用

### 10.2 レンダリング最適化

- [ ] React.memoを実装
- [ ] useMemoを実装
- [ ] useCallbackを実装
- [ ] 長いリストに仮想化を実装

### 10.3 データ取得最適化

- [ ] API ルートの最適化
- [ ] 並列処理パターンの実装
- [ ] デバウンスの実装

### 10.4 画像最適化

- [ ] Next.js Imageコンポーネントを使用
- [ ] WebP/AVIF フォーマットを提供
- [ ] 適切なsizes属性を設定
- [ ] 遅延ロードを実装

### 10.5 キャッシング

- [ ] サーバーサイドキャッシングを実装
- [ ] クライアントサイドキャッシング（SWR）を実装
- [ ] HTTPキャッシュヘッダーを設定

### 10.6 コード分割

- [ ] 動的インポートを実装
- [ ] ルートベースのコード分割を確認
- [ ] フォント最適化を実装

### 10.7 Lighthouse最適化

- [ ] Lighthouse Performance 90以上
- [ ] Lighthouse Accessibility 90以上
- [ ] Lighthouse Best Practices 90以上
- [ ] Lighthouse SEO 90以上

### 10.8 測定結果

```bash
# 最終確認
npm run build
npm start

# Lighthouse実行
lighthouse http://localhost:3000 --view

# スコアを記録
Performance: ___ / 100
Accessibility: ___ / 100
Best Practices: ___ / 100
SEO: ___ / 100
```

---

## まとめ

Phase 6では、バンドルサイズ最適化、レンダリング最適化、データ取得最適化、画像最適化、キャッシング戦略、コード分割、Lighthouse最適化を実装しました。これにより、アプリケーションのパフォーマンスが大幅に向上し、高速なユーザー体験を提供できます。

### 次のステップ

次は **Phase 7: テスト & QA** に進みます。

```bash
# 次のドキュメント
docs/implementation/20251023_07-testing-qa.md
```

---

**作成者**: Claude
**最終更新**: 2025年10月23日
