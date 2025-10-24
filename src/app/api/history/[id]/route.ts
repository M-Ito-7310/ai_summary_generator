import { NextRequest, NextResponse } from 'next/server';
import { getSummaryById, deleteSummary } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const summary = await getSummaryById(id);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error in /api/history/[id]:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '履歴が見つかりませんでした',
        },
      },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteSummary(id);

    return NextResponse.json({
      success: true,
      data: {
        message: '履歴が削除されました',
        deletedId: id,
      },
    });
  } catch (error) {
    console.error('Error in /api/history/[id] DELETE:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: '履歴の削除に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}
