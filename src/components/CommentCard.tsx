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
