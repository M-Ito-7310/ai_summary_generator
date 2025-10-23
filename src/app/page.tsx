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
              SNS投稿用の感想(3パターン)
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
