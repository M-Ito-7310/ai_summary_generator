'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/CopyButton';

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
  const toneLabels = {
    casual: 'カジュアル',
    formal: 'フォーマル',
    neutral: 'ニュートラル',
  };

  return (
    <Card
      variant="bordered"
      className="
        transition-all duration-200
        hover:border-blue-300 hover:shadow-md
        hover:-translate-y-1
      "
      role="article"
      aria-label={`感想コメント パターン ${index + 1}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              パターン {index + 1}
            </span>
            <span
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              aria-label={`トーン: ${toneLabels[comment.tone as keyof typeof toneLabels] || comment.tone}`}
            >
              {toneLabels[comment.tone as keyof typeof toneLabels] || comment.tone}
            </span>
          </div>
          <CopyButton text={comment.text} label="コピー" />
        </div>

        <p className="text-gray-800 leading-relaxed">{comment.text}</p>

        <div className="mt-3 text-xs text-gray-500" aria-label={`文字数: ${comment.length}文字`}>
          {comment.length}文字
        </div>
      </CardContent>
    </Card>
  );
}
