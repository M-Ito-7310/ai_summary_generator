# Phase 3: AI統合 - 詳細実装ガイド

**Phase**: 3/8
**推定時間**: 5時間
**前提条件**: Phase 1, 2完了、OpenAI APIキー取得済み
**次のPhase**: Phase 4 - データベース統合

---

## 目次

1. [概要](#概要)
2. [前提条件の確認](#前提条件の確認)
3. [記事取得機能の実装](#記事取得機能の実装)
4. [OpenAI API統合](#openai-api統合)
5. [要約生成API実装](#要約生成api実装)
6. [感想コメント生成](#感想コメント生成)
7. [エラーハンドリング](#エラーハンドリング)
8. [動作確認](#動作確認)
9. [トラブルシューティング](#トラブルシューティング)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 3では、AIパパっと要約 & 感想ジェネレーターのコア機能であるAI統合を実装します。記事のスクレイピング、OpenAI APIを使用した要約生成、そして感想コメント生成機能を構築します。

### このPhaseで実現すること

- Web記事の取得とパース（Cheerio使用）
- OpenAI APIクライアントのセットアップ
- 3行要約生成機能
- 3パターン感想コメント生成機能
- 包括的なエラーハンドリング
- プロンプトエンジニアリングの最適化

---

## 前提条件の確認

### 必要な準備

#### 1. OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウント作成またはログイン
3. API Keys セクションで新しいキーを作成
4. キーをコピーして`.env.local`に保存

#### 2. 環境変数の設定

`.env.local`ファイルに以下を追加:

```env
# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 3. 依存パッケージの確認

```bash
npm list openai cheerio
```

---

## 記事取得機能の実装

### ステップ 1: スクレイパーライブラリの作成

**ファイル**: `src/lib/scraper.ts`

```typescript
import * as cheerio from 'cheerio';

interface ArticleData {
  url: string;
  title: string;
  description?: string;
  content: string;
  publishedAt?: string;
  author?: string;
  ogImage?: string;
  favicon?: string;
}

export async function fetchArticle(url: string): Promise<ArticleData> {
  try {
    // URLのバリデーション
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.');
    }

    // 記事を取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Summary-Generator/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // メタデータの抽出
    const title = extractTitle($);
    const description = extractDescription($);
    const content = extractContent($);
    const publishedAt = extractPublishedDate($);
    const author = extractAuthor($);
    const ogImage = extractOGImage($);
    const favicon = extractFavicon($, url);

    // コンテンツのバリデーション
    if (!title || !content || content.length < 100) {
      throw new Error('Article content is too short or missing');
    }

    return {
      url,
      title,
      description,
      content,
      publishedAt,
      author,
      ogImage,
      favicon,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// タイトルの抽出
function extractTitle($: cheerio.CheerioAPI): string {
  return (
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text() ||
    $('h1').first().text() ||
    ''
  ).trim();
}

// 説明文の抽出
function extractDescription($: cheerio.CheerioAPI): string | undefined {
  const desc = (
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    ''
  ).trim();

  return desc || undefined;
}

// 本文の抽出
function extractContent($: cheerio.CheerioAPI): string {
  // 不要な要素を削除
  $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();

  // 本文候補の要素を探す
  const articleSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    'main',
    '#content',
  ];

  for (const selector of articleSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      const text = element.text().trim();
      if (text.length > 100) {
        return cleanText(text);
      }
    }
  }

  // フォールバック: bodyから抽出
  const bodyText = $('body').text().trim();
  return cleanText(bodyText);
}

// 公開日の抽出
function extractPublishedDate($: cheerio.CheerioAPI): string | undefined {
  const dateStr = (
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="publishdate"]').attr('content') ||
    $('time[datetime]').attr('datetime') ||
    ''
  ).trim();

  return dateStr || undefined;
}

// 著者の抽出
function extractAuthor($: cheerio.CheerioAPI): string | undefined {
  const author = (
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('.author').first().text() ||
    ''
  ).trim();

  return author || undefined;
}

// OG画像の抽出
function extractOGImage($: cheerio.CheerioAPI): string | undefined {
  const image = (
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    ''
  ).trim();

  return image || undefined;
}

// ファビコンの抽出
function extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  const favicon = $('link[rel="icon"]').attr('href') ||
                  $('link[rel="shortcut icon"]').attr('href');

  if (!favicon) return undefined;

  // 相対URLの場合、絶対URLに変換
  try {
    return new URL(favicon, baseUrl).href;
  } catch {
    return undefined;
  }
}

// テキストのクリーニング
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')  // 連続する空白を1つに
    .replace(/\n+/g, '\n') // 連続する改行を1つに
    .trim();
}
```

---

## OpenAI API統合

### ステップ 2: AI統合ライブラリの作成

**ファイル**: `src/lib/ai.ts`

```typescript
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
    const comments: string[] = parsed.comments?.map((c: any) => c.text) || [];

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
```

---

## プロンプト定義

### ステップ 3: プロンプトファイルの作成

**ファイル**: `src/lib/prompts.ts`

```typescript
export const SUMMARY_SYSTEM_PROMPT = `あなたは優秀な要約アシスタントです。以下の記事を3行で簡潔に要約してください。

【要約のルール】
1. 各行は1文で完結させてください
2. 記事の最も重要なポイントを抽出してください
3. 専門用語がある場合は、一般の人にもわかりやすく説明してください
4. 客観的な表現を心がけてください
5. 各行は40〜60文字程度にまとめてください

【出力形式】
以下のJSON形式で出力してください:
{
  "lines": ["1行目の要約", "2行目の要約", "3行目の要約"]
}`;

export const COMMENT_SYSTEM_PROMPT = `あなたはSNS投稿のアシスタントです。以下の記事について、SNS投稿用の感想コメントを3パターン生成してください。

【感想のルール】
1. 各感想は50〜80文字程度
2. 読者の共感を呼ぶ表現を心がける
3. 異なる視点や切り口で3パターン作成
4. トーンに応じた表現を使用:
   - casual: 親しみやすく、共感しやすい表現
   - formal: ビジネス的で丁寧な表現
   - neutral: 中立的で客観的な表現
5. 絵文字は使用しない
6. 具体的な数字や事実を含める

【出力形式】
以下のJSON形式で出力してください:
{
  "comments": [
    {"text": "1つ目の感想"},
    {"text": "2つ目の感想"},
    {"text": "3つ目の感想"}
  ]
}`;
```

---

## 要約生成API実装

### ステップ 4: APIルートの作成

**ファイル**: `src/app/api/summarize/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchArticle } from '@/lib/scraper';
import { generateSummary, generateComments, estimateTokens } from '@/lib/ai';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // リクエストボディの解析
    const body = await request.json();
    const { url, options } = body;

    // バリデーション
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_URL',
            message: '有効なURLを指定してください',
          },
        },
        { status: 400 }
      );
    }

    // オプションのデフォルト値
    const summaryLength = options?.summaryLength || 3;
    const commentCount = options?.commentCount || 3;
    const tone = options?.tone || 'casual';

    // 記事を取得
    const article = await fetchArticle(url);

    // 要約生成
    const summary = await generateSummary(article.title, article.content);

    // 感想コメント生成
    const comments = await generateComments(
      article.title,
      summary.fullText,
      tone
    );

    // トークン使用量の計算
    const tokensUsed = estimateTokens(article.content + summary.fullText);

    // 処理時間の計算
    const processingTime = Date.now() - startTime;

    // レスポンス返却
    return NextResponse.json({
      success: true,
      data: {
        article: {
          url: article.url,
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt,
          author: article.author,
        },
        summary: {
          lines: summary.lines,
          fullText: summary.fullText,
        },
        comments,
        metadata: {
          generatedAt: new Date().toISOString(),
          tokensUsed,
          processingTime,
        },
      },
    });
  } catch (error) {
    console.error('Error in /api/summarize:', error);

    // エラーコードの判定
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'サーバーエラーが発生しました';

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorCode = 'FETCH_FAILED';
        errorMessage = '記事の取得に失敗しました';
      } else if (error.message.includes('parse') || error.message.includes('content')) {
        errorCode = 'PARSING_FAILED';
        errorMessage = '記事の解析に失敗しました';
      } else if (error.message.includes('OpenAI') || error.message.includes('API')) {
        errorCode = 'AI_API_ERROR';
        errorMessage = 'AI処理中にエラーが発生しました';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
```

---

## 動作確認

### ステップ 5: テスト実行

#### 1. APIのテスト（curl）

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "options": {
      "tone": "casual"
    }
  }'
```

#### 2. フロントエンドからのテスト

**ファイル**: `src/app/test/page.tsx`（テストページ）

```typescript
'use client';

import { useState } from 'react';

export default function TestPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">AI統合テスト</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="記事のURLを入力"
          className="border p-2 w-full mb-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? '処理中...' : '要約生成'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">記事情報</h2>
            <p><strong>タイトル:</strong> {result.article.title}</p>
            <p><strong>URL:</strong> {result.article.url}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">3行要約</h2>
            <ol className="list-decimal list-inside space-y-1">
              {result.summary.lines.map((line: string, i: number) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">感想コメント</h2>
            {result.comments.map((comment: any) => (
              <div key={comment.id} className="border p-3 mb-2 rounded">
                <p>{comment.text}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {comment.length}文字 - {comment.tone}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">メタデータ</h2>
            <p><strong>トークン使用量:</strong> {result.metadata.tokensUsed}</p>
            <p><strong>処理時間:</strong> {result.metadata.processingTime}ms</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## トラブルシューティング

### よくある問題と解決策

#### 1. OpenAI APIエラー

**症状**: `Error: OpenAI API request failed`

**解決策**:
- APIキーが正しく設定されているか確認
- 課金設定を確認（無料枠を超えている可能性）
- ネットワーク接続を確認

#### 2. 記事取得失敗

**症状**: `FETCH_FAILED` エラー

**解決策**:
- URLが正しいか確認
- サイトがスクレイピングを許可しているか確認
- User-Agentヘッダーを調整

#### 3. JSON解析エラー

**症状**: `JSON.parse` エラー

**解決策**:
- プロンプトを見直す
- OpenAIのレスポンスをログ出力して確認
- temperatureを調整

---

## 成果物チェックリスト

### 実装完了の確認

- [ ] `src/lib/scraper.ts` 作成完了
- [ ] `src/lib/ai.ts` 作成完了
- [ ] `src/lib/prompts.ts` 作成完了
- [ ] `src/app/api/summarize/route.ts` 作成完了
- [ ] 環境変数 `OPENAI_API_KEY` 設定完了
- [ ] 記事取得機能が動作する
- [ ] 要約生成機能が動作する（3行出力）
- [ ] 感想コメント生成が動作する（3パターン出力）
- [ ] エラーハンドリングが適切に動作する
- [ ] テストページで動作確認完了

### 品質チェック

- [ ] TypeScriptエラーなし
- [ ] ESLint警告なし
- [ ] エラーメッセージが適切
- [ ] レスポンスタイムが5秒以内
- [ ] トークン使用量が妥当

---

**Phase 3完了！次はPhase 4: データベース統合に進みます。**
