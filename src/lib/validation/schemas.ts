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
