# Database Schema

## データベース概要

### 使用技術
- **データベース**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **マイグレーション**: Prisma Migrate

### 設計方針
- シンプルな構造（MVP段階）
- 将来的な拡張性を考慮
- パフォーマンスを意識したインデックス設計
- 適切な制約によるデータ整合性の確保

## テーブル設計

### 1. summaries（要約履歴テーブル）

記事の要約と生成された感想を保存します。

```prisma
model Summary {
  id            String   @id @default(cuid())
  url           String
  title         String
  description   String?
  content       String   @db.Text
  author        String?
  publishedAt   DateTime?

  // 要約データ
  summaryLines  String[]
  summaryText   String   @db.Text

  // メタデータ
  tokensUsed    Int
  processingTime Int     // ミリ秒

  // タイムスタンプ
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // リレーション
  comments      Comment[]

  // インデックス
  @@index([url])
  @@index([createdAt])
}
```

#### カラム説明

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー（CUID） |
| `url` | String | 記事のURL |
| `title` | String | 記事タイトル |
| `description` | String? | 記事の説明（OGP description） |
| `content` | Text | 記事本文 |
| `author` | String? | 著者名 |
| `publishedAt` | DateTime? | 公開日時 |
| `summaryLines` | String[] | 要約の各行（配列） |
| `summaryText` | Text | 要約全文（結合済み） |
| `tokensUsed` | Int | AI APIで使用したトークン数 |
| `processingTime` | Int | 処理時間（ミリ秒） |
| `createdAt` | DateTime | レコード作成日時 |
| `updatedAt` | DateTime | レコード更新日時 |

---

### 2. comments（感想コメントテーブル）

SNS投稿用の感想コメントを保存します。

```prisma
model Comment {
  id          String   @id @default(cuid())
  summaryId   String
  text        String   @db.Text
  tone        String   // 'casual' | 'formal' | 'neutral'
  length      Int
  position    Int      // 表示順序（1, 2, 3）

  // タイムスタンプ
  createdAt   DateTime @default(now())

  // リレーション
  summary     Summary  @relation(fields: [summaryId], references: [id], onDelete: Cascade)

  // インデックス
  @@index([summaryId])
  @@index([createdAt])
}
```

#### カラム説明

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー（CUID） |
| `summaryId` | String | 外部キー（summaries.id） |
| `text` | Text | 感想コメント本文 |
| `tone` | String | トーン（casual/formal/neutral） |
| `length` | Int | 文字数 |
| `position` | Int | 表示順序（1〜3） |
| `createdAt` | DateTime | レコード作成日時 |

---

### 3. analytics（統計情報テーブル）

日次の利用統計を保存します（将来実装予定）。

```prisma
model Analytics {
  id              String   @id @default(cuid())
  date            DateTime @unique @db.Date
  totalSummaries  Int      @default(0)
  totalComments   Int      @default(0)
  totalTokens     Int      @default(0)
  avgProcessingTime Float  @default(0)
  uniqueUrls      Int      @default(0)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([date])
}
```

#### カラム説明

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー（CUID） |
| `date` | Date | 集計日（UNIQUE） |
| `totalSummaries` | Int | 当日の要約生成数 |
| `totalComments` | Int | 当日の感想生成数 |
| `totalTokens` | Int | 当日の総トークン使用量 |
| `avgProcessingTime` | Float | 平均処理時間（ミリ秒） |
| `uniqueUrls` | Int | ユニークURL数 |
| `createdAt` | DateTime | レコード作成日時 |
| `updatedAt` | DateTime | レコード更新日時 |

---

### 4. users（ユーザーテーブル）

将来的なユーザー認証機能実装時に使用（現在は未実装）。

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}
```

---

## ER図

```
┌─────────────────────────────────┐
│         summaries               │
├─────────────────────────────────┤
│ id (PK)                         │
│ url                             │
│ title                           │
│ description                     │
│ content                         │
│ author                          │
│ publishedAt                     │
│ summaryLines                    │
│ summaryText                     │
│ tokensUsed                      │
│ processingTime                  │
│ createdAt                       │
│ updatedAt                       │
└─────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────┐
│         comments                │
├─────────────────────────────────┤
│ id (PK)                         │
│ summaryId (FK)                  │
│ text                            │
│ tone                            │
│ length                          │
│ position                        │
│ createdAt                       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         analytics               │
├─────────────────────────────────┤
│ id (PK)                         │
│ date (UNIQUE)                   │
│ totalSummaries                  │
│ totalComments                   │
│ totalTokens                     │
│ avgProcessingTime               │
│ uniqueUrls                      │
│ createdAt                       │
│ updatedAt                       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         users (未実装)           │
├─────────────────────────────────┤
│ id (PK)                         │
│ email (UNIQUE)                  │
│ name                            │
│ passwordHash                    │
│ createdAt                       │
│ updatedAt                       │
└─────────────────────────────────┘
```

## インデックス設計

### パフォーマンス最適化のためのインデックス

| テーブル | カラム | 目的 |
|---------|--------|------|
| summaries | url | URL検索の高速化 |
| summaries | createdAt | 新着順ソートの高速化 |
| comments | summaryId | リレーション検索の高速化 |
| comments | createdAt | 日付検索の高速化 |
| analytics | date | 日付範囲検索の高速化 |
| users | email | ログイン時の検索高速化 |

## Prismaスキーマ全体

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([email])
}
```

## データベース接続設定

### 環境変数

```env
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Direct URL (マイグレーション用)
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

### Prismaクライアント設定

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## マイグレーション

### 初期マイグレーション

```bash
# Prismaクライアント生成
npx prisma generate

# マイグレーション作成
npx prisma migrate dev --name init

# 本番環境へのデプロイ
npx prisma migrate deploy
```

### シードデータ

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 統計テーブルの初期データ
  await prisma.analytics.create({
    data: {
      date: new Date(),
      totalSummaries: 0,
      totalComments: 0,
      totalTokens: 0,
      avgProcessingTime: 0,
      uniqueUrls: 0,
    },
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed data creation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## データベース運用

### バックアップ

Neon PostgreSQLは自動バックアップ機能を提供。

- **Point-in-time Recovery (PITR)**: 過去7日間の任意の時点に復元可能
- **自動スナップショット**: 毎日実行

### モニタリング

- Neon Console: クエリパフォーマンス監視
- Prisma Studio: データベース内容の可視化
- Vercel Logs: アプリケーションログ

### データ保持ポリシー

- **要約履歴**: 無期限保持（ストレージ容量による制限あり）
- **統計データ**: 1年間保持
- **ログ**: 30日間保持

## 将来的な拡張

### パーティショニング
大量データ対応のため、日付ベースのパーティショニングを検討。

### レプリケーション
読み取り負荷分散のため、読み取りレプリカの追加を検討。

### キャッシュ層
頻繁にアクセスされるデータのキャッシュ（Redis/Upstash）。

### 全文検索
PostgreSQLのfull-text search機能、またはElasticsearchの導入。
