import { GoogleGenerativeAI } from '@google/generative-ai';
import { SUMMARY_SYSTEM_PROMPT, COMMENT_SYSTEM_PROMPT } from './prompts';

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
  content: string,
  apiKey: string
): Promise<SummaryResult> {
  try {
    // Gemini APIクライアントの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    // プロンプト作成
    const prompt = `${SUMMARY_SYSTEM_PROMPT}

【記事タイトル】
${title}

【記事本文】
${content.substring(0, 4000)}`;

    // 生成実行
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error('No response from Gemini API');
    }

    // JSON形式のレスポンスをパース
    // Geminiのレスポンスはマークダウンコードブロック内にJSON形式で返される可能性があるため、
    // コードブロックを除去する処理を追加
    const cleanedResponse = responseText
      .replace(/```json\n/g, '')
      .replace(/```\n/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);
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
  apiKey: string,
  tone: 'casual' | 'formal' | 'neutral' = 'casual'
): Promise<CommentResult[]> {
  try {
    // Gemini APIクライアントの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      }
    });

    // プロンプト作成
    const prompt = `${COMMENT_SYSTEM_PROMPT}

【記事タイトル】
${title}

【記事要約】
${summary}

【トーン】
${tone}`;

    // 生成実行
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error('No response from Gemini API');
    }

    // JSON形式のレスポンスをパース
    const cleanedResponse = responseText
      .replace(/```json\n/g, '')
      .replace(/```\n/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);
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

/**
 * Gemini APIキーの形式検証
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Gemini APIキーは通常39文字で、"AIza"で始まる
  const trimmedKey = apiKey.trim();
  return trimmedKey.startsWith('AIza') && trimmedKey.length === 39;
}
