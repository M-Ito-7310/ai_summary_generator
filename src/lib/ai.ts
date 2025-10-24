import OpenAI from 'openai';
import { SUMMARY_SYSTEM_PROMPT, COMMENT_SYSTEM_PROMPT } from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface SummaryResult {
  lines: string[];
  fullText: string;
}

export interface CommentResult {
  id: number;
  text: string;
  tone: string;
  length: number;
}

/**
 * 記事の3行要約を生成
 */
export async function generateSummary(
  title: string,
  content: string
): Promise<SummaryResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `【記事タイトル】\n${title}\n\n【記事本文】\n${content.substring(0, 4000)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI API');
    }

    // JSON形式のレスポンスをパース
    const parsed = JSON.parse(responseText);
    const lines: string[] = parsed.lines || [];

    if (lines.length !== 3) {
      throw new Error('Expected 3 summary lines');
    }

    return {
      lines,
      fullText: lines.join(' '),
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * SNS投稿用の感想コメントを3パターン生成
 */
export async function generateComments(
  title: string,
  summary: string,
  tone: 'casual' | 'formal' | 'neutral' = 'casual'
): Promise<CommentResult[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: COMMENT_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `【記事タイトル】\n${title}\n\n【記事要約】\n${summary}\n\n【トーン】\n${tone}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI API');
    }

    // JSON形式のレスポンスをパース
    const parsed = JSON.parse(responseText);
    const comments: string[] = parsed.comments?.map((c: { text: string }) => c.text) || [];

    if (comments.length !== 3) {
      throw new Error('Expected 3 comments');
    }

    return comments.map((text, index) => ({
      id: index + 1,
      text,
      tone,
      length: text.length,
    }));
  } catch (error) {
    console.error('Error generating comments:', error);
    throw new Error(`Failed to generate comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * トークン使用量の推定
 */
export function estimateTokens(text: string): number {
  // 簡易的な推定: 日本語は約1文字=2トークン、英語は約4文字=1トークン
  const japaneseChars = (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g) || []).length;
  const otherChars = text.length - japaneseChars;

  return Math.ceil(japaneseChars * 2 + otherChars / 4);
}
