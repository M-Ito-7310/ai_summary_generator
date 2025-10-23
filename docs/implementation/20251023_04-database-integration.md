# Phase 4: データベース統合 - 詳細実装ガイド

**Phase**: 4/8
**推定時間**: 3時間
**前提条件**: Phase 1, 2, 3完了、Neon PostgreSQLアカウント作成済み
**次のPhase**: Phase 5 - エラーハンドリング＆UX改善

---

## 目次

1. [概要](#概要)
2. [前提条件の確認](#前提条件の確認)
3. [Neon PostgreSQLセットアップ](#neon-postgresqlセットアップ)
4. [Prisma設定](#prisma設定)
5. [履歴保存機能の実装](#履歴保存機能の実装)
6. [履歴取得API実装](#履歴取得api実装)
7. [統計情報収集](#統計情報収集)
8. [動作確認](#動作確認)
9. [トラブルシューティング](#トラブルシューティング)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 4では、要約・感想生成の履歴をNeon PostgreSQLデータベースに保存する機能を実装します。Prisma ORMを使用して型安全なデータベース操作を実現します。

### このPhaseで実現すること

- Neon PostgreSQLの接続設定
- Prismaスキーマの確認とマイグレーション
- 要約履歴の保存機能
- 履歴取得・削除API
- 統計情報の収集
- データベースクエリの最適化

---

## 前提条件の確認

### 必要な準備

#### 1. Neon PostgreSQLアカウント

1. [Neon Console](https://console.neon.tech/)にアクセス
2. アカウント作成またはログイン
3. 新しいプロジェクトを作成
4. データベース接続文字列をコピー

#### 2. 環境変数の設定

`.env.local`ファイルに以下を追加:

```env
# Neon PostgreSQL
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**注意**: `DATABASE_URL`と`DIRECT_URL`は通常同じ値です。

---

## Neon PostgreSQLセットアップ

### ステップ 1: Neonプロジェクト作成

1. Neon Consoleで「Create Project」をクリック
2. プロジェクト名を入力（例: `ai-summary-generator`）
3. リージョンを選択（推奨: US East）
4. データベース名を設定（デフォルト: `neondb`）
5. 「Create Project」をクリック

### ステップ 2: 接続文字列の取得

1. プロジェクトダッシュボードで「Connection String」をクリック
2. 「Pooled connection」を選択
3. 接続文字列をコピー
4. `.env.local`にペースト

---

## Prisma設定

### ステップ 3: Prismaスキーマの確認

**ファイル**: `prisma/schema.prisma`（既に存在するはず）

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Summary {
  id             String    @id @default(cuid())
  url            String
  title          String
  description    String?
  content        String    @db.Text
  author         String?
  publishedAt    DateTime?

  summaryLines   String[]
  summaryText    String    @db.Text

  tokensUsed     Int
  processingTime Int

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  comments       Comment[]

  @@index([url])
  @@index([createdAt])
}

model Comment {
  id         String   @id @default(cuid())
  summaryId  String
  text       String   @db.Text
  tone       String
  length     Int
  position   Int

  createdAt  DateTime @default(now())

  summary    Summary  @relation(fields: [summaryId], references: [id], onDelete: Cascade)

  @@index([summaryId])
  @@index([createdAt])
}

model Analytics {
  id                String   @id @default(cuid())
  date              DateTime @unique @db.Date
  totalSummaries    Int      @default(0)
  totalComments     Int      @default(0)
  totalTokens       Int      @default(0)
  avgProcessingTime Float    @default(0)
  uniqueUrls        Int      @default(0)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([date])
}
```

### ステップ 4: マイグレーションの実行

```bash
# Prismaクライアントの生成
npx prisma generate

# マイグレーションの作成と実行
npx prisma migrate dev --name init

# データベースの確認（Prisma Studio）
npx prisma studio
```

**期待される出力**:
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-xxx.us-east-2.aws.neon.tech:5432"

Applying migration `20251023000000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20251023000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.x.x) to .\node_modules\@prisma\client in XXXms
```

---

## 履歴保存機能の実装

### ステップ 5: データベースユーティリティの作成

**ファイル**: `src/lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### ステップ 6: 履歴保存関数の作成

**ファイル**: `src/lib/db/queries.ts`

```typescript
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
          increment: 0, // 後で実装
        },
        uniqueUrls: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
    // 統計エラーは無視（メイン処理に影響させない）
  }
}
```

---

## 履歴取得API実装

### ステップ 7: APIルートの作成

**ファイル**: `src/app/api/history/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSummaries } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await getSummaries(limit, offset);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in /api/history:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '履歴の取得に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}
```

**ファイル**: `src/app/api/history/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSummaryById, deleteSummary } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const summary = await getSummaryById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    await deleteSummary(params.id);

    return NextResponse.json({
      success: true,
      data: {
        message: '履歴が削除されました',
        deletedId: params.id,
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
```

### ステップ 8: 要約API に履歴保存を追加

**ファイル**: `src/app/api/summarize/route.ts`（既存ファイルを更新）

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchArticle } from '@/lib/scraper';
import { generateSummary, generateComments, estimateTokens } from '@/lib/ai';
import { saveSummary } from '@/lib/db/queries'; // 追加

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { url, options } = body;

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

    const tokensUsed = estimateTokens(article.content + summary.fullText);
    const processingTime = Date.now() - startTime;

    // データベースに保存（追加）
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

### ステップ 9: テスト実行

#### 1. データベース接続の確認

```bash
npx prisma studio
```

ブラウザで `http://localhost:5555` が開き、Prisma Studioが起動すればOK

#### 2. 履歴保存のテスト

要約生成APIを実行後、Prisma Studioで`Summary`テーブルと`Comment`テーブルにデータが保存されていることを確認

#### 3. 履歴取得APIのテスト

```bash
curl http://localhost:3000/api/history
```

**期待されるレスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

## トラブルシューティング

### よくある問題と解決策

#### 1. データベース接続エラー

**症状**: `Can't reach database server`

**解決策**:
- `.env.local`の`DATABASE_URL`を確認
- Neon Consoleでデータベースがアクティブか確認
- ファイアウォール設定を確認

#### 2. マイグレーションエラー

**症状**: `Migration failed`

**解決策**:
```bash
# マイグレーションをリセット
npx prisma migrate reset

# 再度マイグレーション
npx prisma migrate dev --name init
```

#### 3. Prismaクライアントエラー

**症状**: `PrismaClient is not defined`

**解決策**:
```bash
# Prismaクライアントを再生成
npx prisma generate
```

---

## 成果物チェックリスト

### 実装完了の確認

- [ ] Neon PostgreSQL接続設定完了
- [ ] Prismaスキーマ確認済み
- [ ] マイグレーション実行完了
- [ ] `src/lib/db.ts` 作成完了
- [ ] `src/lib/db/queries.ts` 作成完了
- [ ] `src/app/api/history/route.ts` 作成完了
- [ ] `src/app/api/history/[id]/route.ts` 作成完了
- [ ] `/api/summarize` に履歴保存機能追加完了
- [ ] 履歴保存が正常に動作する
- [ ] 履歴取得が正常に動作する
- [ ] 履歴削除が正常に動作する
- [ ] Prisma Studioでデータ確認完了

### 品質チェック

- [ ] TypeScriptエラーなし
- [ ] データベースクエリが最適化されている
- [ ] インデックスが適切に設定されている
- [ ] エラーハンドリングが適切

---

**Phase 4完了！次はPhase 5: エラーハンドリング＆UX改善に進みます。**
