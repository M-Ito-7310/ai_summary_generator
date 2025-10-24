'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState, useCallback, memo } from 'react';

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

export const SummaryDisplay = memo(function SummaryDisplay({ summary, article }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(summary.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary.fullText]);

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
});
