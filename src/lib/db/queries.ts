import { prisma } from '@/lib/db';

export interface SaveSummaryData {
  url: string;
  title: string;
  description?: string;
  content: string;
  author?: string;
  publishedAt?: string;
  summaryLines: string[];
  summaryText: string;
  comments: Array<{
    text: string;
    tone: string;
    length: number;
    position: number;
  }>;
  tokensUsed: number;
  processingTime: number;
}

/**
 * 要約履歴を保存
 */
export async function saveSummary(data: SaveSummaryData) {
  try {
    const summary = await prisma.summary.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description,
        content: data.content,
        author: data.author,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        summaryLines: data.summaryLines,
        summaryText: data.summaryText,
        tokensUsed: data.tokensUsed,
        processingTime: data.processingTime,
        comments: {
          create: data.comments.map((comment) => ({
            text: comment.text,
            tone: comment.tone,
            length: comment.length,
            position: comment.position,
          })),
        },
      },
      include: {
        comments: true,
      },
    });

    // 統計情報を更新
    await updateAnalytics(data);

    return summary;
  } catch (error) {
    console.error('Error saving summary:', error);
    throw new Error('Failed to save summary to database');
  }
}

/**
 * 履歴を取得
 */
export async function getSummaries(limit = 10, offset = 0) {
  try {
    const [summaries, total] = await Promise.all([
      prisma.summary.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          comments: {
            orderBy: { position: 'asc' },
          },
        },
      }),
      prisma.summary.count(),
    ]);

    return {
      items: summaries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  } catch (error) {
    console.error('Error fetching summaries:', error);
    throw new Error('Failed to fetch summaries from database');
  }
}

/**
 * 特定の履歴を取得
 */
export async function getSummaryById(id: string) {
  try {
    const summary = await prisma.summary.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!summary) {
      throw new Error('Summary not found');
    }

    return summary;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

/**
 * 履歴を削除
 */
export async function deleteSummary(id: string) {
  try {
    await prisma.summary.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting summary:', error);
    throw new Error('Failed to delete summary');
  }
}

/**
 * 統計情報を更新
 */
async function updateAnalytics(data: SaveSummaryData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.analytics.upsert({
      where: { date: today },
      create: {
        date: today,
        totalSummaries: 1,
        totalComments: data.comments.length,
        totalTokens: data.tokensUsed,
        avgProcessingTime: data.processingTime,
        uniqueUrls: 1,
      },
      update: {
        totalSummaries: { increment: 1 },
        totalComments: { increment: data.comments.length },
        totalTokens: { increment: data.tokensUsed },
        avgProcessingTime: {
          // 平均を再計算
          increment: 0,
        },
        uniqueUrls: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
    // 統計エラーは無視（メイン処理に影響させない）
  }
}
