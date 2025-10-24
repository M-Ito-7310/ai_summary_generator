import { NextRequest, NextResponse } from 'next/server';
import { fetchArticle } from '@/lib/scraper';
import { generateSummary, generateComments, estimateTokens } from '@/lib/ai';
import { saveSummary } from '@/lib/db/queries';
import { CustomError } from '@/types/errors';
import { handleApiError } from '@/lib/utils/errorHandler';
import { urlSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // リクエストボディの解析
    const body = await request.json();
    const { url, options } = body;

    // Zodバリデーション
    const validationResult = urlSchema.safeParse(url);
    if (!validationResult.success) {
      throw new CustomError(
        'INVALID_URL',
        validationResult.error.errors[0].message,
        undefined,
        false
      );
    }

    // オプションのデフォルト値
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

    // データベースに保存
    await saveSummary({
      url: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      author: article.author,
      publishedAt: article.publishedAt,
      summaryLines: summary.lines,
      summaryText: summary.fullText,
      comments: comments.map((c, i) => ({
        text: c.text,
        tone: c.tone,
        length: c.length,
        position: i + 1,
      })),
      tokensUsed,
      processingTime,
    });

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
    const appError = handleApiError(error);

    console.error('API Error:', {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
          retryable: appError.retryable,
        },
      },
      { status: appError.code === 'RATE_LIMIT_EXCEEDED' ? 429 : appError.code === 'INVALID_URL' ? 400 : 500 }
    );
  }
}
