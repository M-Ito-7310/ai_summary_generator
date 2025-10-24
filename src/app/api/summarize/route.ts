import { NextRequest, NextResponse } from 'next/server';
import { fetchArticle } from '@/lib/scraper';
import { generateSummary, generateComments, estimateTokens } from '@/lib/ai';
import { saveSummary } from '@/lib/db/queries';

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
