# Phase 1: プロジェクトセットアップ - 詳細実装ガイド

**Phase**: 1/4
**推定時間**: 1.5-2時間
**前提条件**: Node.js 18.x以上、Git、テキストエディタ
**次のPhase**: Phase 2 - UI実装

---

## 目次

1. [概要](#概要)
2. [前提条件の確認](#前提条件の確認)
3. [プロジェクト初期化](#プロジェクト初期化)
4. [依存パッケージのインストール](#依存パッケージのインストール)
5. [設定ファイルの作成](#設定ファイルの作成)
6. [ディレクトリ構造の作成](#ディレクトリ構造の作成)
7. [環境変数設定](#環境変数設定)
8. [データベースセットアップ](#データベースセットアップ)
9. [動作確認](#動作確認)
10. [トラブルシューティング](#トラブルシューティング)
11. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 1では、AIパパっと要約 & 感想ジェネレータープロジェクトの開発環境を構築します。Next.js 15をベースに、TypeScript、Tailwind CSS、OpenAI API、Neon PostgreSQLなどの必要な依存関係をインストールし、プロジェクトの基盤を整えます。

### このPhaseで実現すること

- Next.js 15プロジェクトの初期化
- すべての依存パッケージのインストール
- TypeScript、Tailwind CSS、ESLintの設定
- ディレクトリ構造の構築
- Neon PostgreSQLデータベースのセットアップ
- Prismaスキーマの作成とマイグレーション
- 開発サーバーの起動確認

---

## 前提条件の確認

### 必要なソフトウェア

#### 1. Node.js（バージョン 18.x 以上）

**確認コマンド:**
```bash
node --version
# 出力例: v18.17.0 または v20.x.x
```

**インストールが必要な場合:**
- 公式サイト: https://nodejs.org/
- 推奨: LTS版（Long Term Support）

#### 2. npm または yarn

**確認コマンド:**
```bash
npm --version
# 出力例: 9.6.7 以上
```

本ドキュメントでは`npm`を使用します。

#### 3. Git

**確認コマンド:**
```bash
git --version
# 出力例: git version 2.40.1
```

**インストールが必要な場合:**
- 公式サイト: https://git-scm.com/

#### 4. テキストエディタ

推奨: **Visual Studio Code**
- 公式サイト: https://code.visualstudio.com/
- 推奨拡張機能:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma
  - TypeScript and JavaScript Language Features

---

## プロジェクト初期化

### ステップ 1: 作業ディレクトリへ移動

```bash
# 既にプロジェクトディレクトリが存在する場合
cd c:/Users/mitoi/Desktop/Projects/ai-summary-generator
```

### ステップ 2: Next.js プロジェクト初期化確認

プロジェクトが既に存在する場合は、以下のファイルが存在するか確認:

```bash
ls -la
```

**期待される出力:**
```
package.json
tsconfig.json
next.config.js
tailwind.config.ts
src/
  app/
    layout.tsx
    page.tsx
    globals.css
```

プロジェクトが存在しない場合は、以下を実行:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

---

## 依存パッケージのインストール

### ステップ 3: 追加パッケージのインストール

#### プロダクション依存関係

```bash
npm install @prisma/client \
            openai \
            cheerio \
            zod \
            clsx tailwind-merge \
            lucide-react
```

**各パッケージの説明:**

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `@prisma/client` | 最新 | Prisma ORMクライアント |
| `openai` | ^4.x | OpenAI API統合 |
| `cheerio` | ^1.0.0 | HTML解析（記事取得用） |
| `zod` | ^3.x | バリデーションスキーマ |
| `clsx` | ^2.1.0 | 条件付きクラス名結合 |
| `tailwind-merge` | ^2.2.0 | Tailwindクラスのマージ |
| `lucide-react` | ^0.344.0 | アイコンライブラリ |

#### 開発依存関係

```bash
npm install -D prisma \
               @types/node \
               prettier \
               prettier-plugin-tailwindcss \
               tsx
```

**各パッケージの説明:**

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `prisma` | 最新 | Prisma CLI（スキーマ管理） |
| `@types/node` | ^20 | Node.js型定義 |
| `prettier` | ^3.2.5 | コードフォーマッター |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Tailwindクラスの自動ソート |
| `tsx` | ^4.x | TypeScriptスクリプト実行 |

#### インストール確認

```bash
npm list --depth=0
```

---

## 設定ファイルの作成

### ステップ 4: package.json の更新

`package.json`の`scripts`セクションを以下のように更新:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

**スクリプト解説:**

| スクリプト | コマンド | 説明 |
|-----------|---------|------|
| `dev` | `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `build` | `npm run build` | 本番ビルド |
| `type-check` | `npm run type-check` | TypeScript型チェック |
| `format` | `npm run format` | Prettierでコード整形 |
| `db:generate` | `npm run db:generate` | Prismaクライアント生成 |
| `db:push` | `npm run db:push` | スキーマをDBに反映 |
| `db:migrate` | `npm run db:migrate` | マイグレーション実行 |
| `db:studio` | `npm run db:studio` | Prisma Studio起動 |

---

### ステップ 5: tsconfig.json の確認

`tsconfig.json`が以下の内容を含んでいることを確認:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

---

### ステップ 6: tailwind.config.ts の設定

`tailwind.config.ts`を以下の内容で作成/更新:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### ステップ 7: Prettier設定ファイル

`.prettierrc.json`を新規作成:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`.prettierignore`も作成:

```
node_modules/
.next/
out/
dist/
build/
.env*
*.log
.DS_Store
coverage/
```

---

## ディレクトリ構造の作成

### ステップ 8: ディレクトリ構造の構築

以下のコマンドで必要なディレクトリをすべて作成:

```bash
# Windowsの場合（PowerShell）
mkdir -p src\app\api\summarize
mkdir -p src\app\api\history
mkdir -p src\components\ui
mkdir -p src\lib
mkdir -p prisma
mkdir -p public\images

# Unix系（Mac/Linux）の場合
mkdir -p src/app/api/summarize
mkdir -p src/app/api/history
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p prisma
mkdir -p public/images
```

### 完成したディレクトリ構造

```
ai-summary-generator/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # ルートレイアウト
│   │   ├── page.tsx                   # ホームページ
│   │   ├── globals.css                # グローバルCSS
│   │   └── api/
│   │       ├── summarize/
│   │       │   └── route.ts           # 要約・感想生成API
│   │       └── history/
│   │           └── route.ts           # 履歴取得API
│   ├── components/
│   │   ├── UrlInputForm.tsx           # URL入力フォーム
│   │   ├── SummaryDisplay.tsx         # 要約表示
│   │   ├── CommentCard.tsx            # 感想カード
│   │   └── ui/                        # 共通UIコンポーネント
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   ├── db.ts                      # Prismaクライアント
│   │   ├── ai.ts                      # AI API統合
│   │   ├── scraper.ts                 # 記事取得
│   │   ├── prompts.ts                 # AIプロンプト定義
│   │   └── utils.ts                   # 汎用ユーティリティ
│   └── types/
│       ├── api.ts                     # API型定義
│       └── database.ts                # DB型定義
├── prisma/
│   └── schema.prisma                  # Prismaスキーマ
├── public/
│   └── images/                        # 静的画像
├── .env.local                         # 環境変数（Gitにコミットしない）
├── .env.local.example                 # 環境変数テンプレート
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 環境変数設定

### ステップ 9: 環境変数テンプレート

`.env.local.example`を新規作成:

```bash
# データベース接続（Neon PostgreSQL）
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# OpenAI API
OPENAI_API_KEY="sk-..."

# アプリケーション設定
NEXT_PUBLIC_APP_NAME="AIパパっと要約 & 感想ジェネレーター"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

**実際の`.env.local`ファイルを作成:**

```bash
cp .env.local.example .env.local
```

**重要**: 次のステップで実際のAPIキーとデータベースURLに更新します。

---

## データベースセットアップ

### ステップ 10: Neon PostgreSQLアカウント作成

#### 10.1 Neonアカウント作成

1. ブラウザで [https://neon.tech](https://neon.tech) を開く
2. **Sign Up** ボタンをクリック
3. GitHubアカウントでサインアップ（推奨）

#### 10.2 プロジェクト作成

1. **Create a project** をクリック
2. プロジェクト設定を入力:

```yaml
Project name: ai-summary-generator
Region: US East (Ohio) - us-east-2
PostgreSQL version: 16 (デフォルト)
```

3. **Create Project** ボタンをクリック

#### 10.3 接続文字列の取得

1. プロジェクトダッシュボードの **Connection Details** セクションを開く
2. **Connection string** をコピー

**実際の例**:
```
postgresql://ai_summary_owner:AbCdEfGh1234567890@ep-cool-meadow-12345678.us-east-2.aws.neon.tech/ai_summary_generator?sslmode=require
```

#### 10.4 環境変数に設定

`.env.local` ファイルを開き、`DATABASE_URL`を更新:

```env
DATABASE_URL="postgresql://ai_summary_owner:AbCdEfGh1234567890@ep-cool-meadow-12345678.us-east-2.aws.neon.tech/ai_summary_generator?sslmode=require"
```

---

### ステップ 11: OpenAI APIキー取得

#### 11.1 OpenAIアカウント作成

1. [https://platform.openai.com](https://platform.openai.com) にアクセス
2. **Sign up** をクリックしてアカウント作成

#### 11.2 APIキー作成

1. ダッシュボードで **API keys** を開く
2. **Create new secret key** をクリック
3. 名前を入力: `ai-summary-generator`
4. APIキーをコピー（1度しか表示されない）

**例**:
```
sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

#### 11.3 環境変数に設定

`.env.local` ファイルに追加:

```env
OPENAI_API_KEY="sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
```

---

### ステップ 12: Prismaスキーマ作成

`prisma/schema.prisma`を新規作成:

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

---

### ステップ 13: Prismaマイグレーション実行

#### 13.1 Prismaクライアント生成

```bash
npm run db:generate
```

**期待される出力:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

#### 13.2 データベースにスキーマを反映

```bash
npm run db:push
```

**期待される出力:**
```
✔ Database synchronized with Prisma schema.
✔ Generated Prisma Client
```

#### 13.3 Prisma Studioで確認（オプション）

```bash
npm run db:studio
```

ブラウザで `http://localhost:5555` が開き、データベース内容を視覚的に確認できます。

---

### ステップ 14: Prismaクライアント設定

`src/lib/db.ts`を新規作成:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

### ステップ 15: ユーティリティ関数作成

`src/lib/utils.ts`を新規作成:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwindクラスを結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * URLの妥当性チェック
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * エラーメッセージの整形
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return '不明なエラーが発生しました';
}
```

---

## 動作確認

### ステップ 16: TypeScript型チェック

```bash
npm run type-check
```

**期待される出力:**
```
> type-check
> tsc --noEmit

# エラーがなければ何も表示されない
```

### ステップ 17: ESLintチェック

```bash
npm run lint
```

**期待される出力:**
```
> lint
> next lint

✔ No ESLint warnings or errors
```

### ステップ 18: 開発サーバー起動

```bash
npm run dev
```

**期待される出力:**
```
> dev
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

**ブラウザで確認:**
1. http://localhost:3000 を開く
2. Next.jsのデフォルトページが表示される

### ステップ 19: データベース接続テスト

簡易テストスクリプト `scripts/test-db.ts`を作成:

```typescript
import { prisma } from '../src/lib/db';

async function testConnection() {
  try {
    console.log('🔌 データベース接続テスト開始...\n');

    // 接続テスト
    await prisma.$connect();
    console.log('✅ データベース接続成功!\n');

    // テーブル確認
    const summaryCount = await prisma.summary.count();
    console.log(`📊 Summary テーブル: ${summaryCount}件`);

    const commentCount = await prisma.comment.count();
    console.log(`💬 Comment テーブル: ${commentCount}件`);

    console.log('\n🎉 すべてのテストが成功しました!');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ エラー発生:', error);
    process.exit(1);
  }
}

testConnection();
```

実行:

```bash
npx tsx scripts/test-db.ts
```

---

## トラブルシューティング

### 問題1: `npm install`が失敗する

**症状:**
```
npm ERR! code ERESOLVE
```

**解決策:**
```bash
# パッケージロックファイルを削除
rm package-lock.json
rm -rf node_modules

# クリーンインストール
npm install
```

---

### 問題2: Prismaマイグレーションが失敗

**症状:**
```
Error: P1001: Can't reach database server
```

**解決策:**

1. `.env.local`の`DATABASE_URL`が正しいか確認
2. Neonダッシュボードでデータベースが**Active**状態か確認
3. インターネット接続を確認

---

### 問題3: OpenAI APIキーエラー

**症状:**
```
Error: Invalid API key
```

**解決策:**

1. `.env.local`の`OPENAI_API_KEY`が正しいか確認
2. OpenAIダッシュボードでAPIキーが有効か確認
3. 開発サーバーを再起動

---

## 成果物チェックリスト

Phase 1完了時に以下をすべて確認:

### ファイル確認

- [ ] `package.json` が正しく設定されている
- [ ] `tsconfig.json` が正しく設定されている
- [ ] `next.config.js` が存在する
- [ ] `tailwind.config.ts` が正しく設定されている
- [ ] `.prettierrc.json` が作成されている
- [ ] `prisma/schema.prisma` が作成されている
- [ ] `.env.local` が作成され、APIキーが設定されている
- [ ] `.gitignore` に `.env.local` が含まれている

### ディレクトリ確認

- [ ] `src/app/api/summarize/` ディレクトリが存在
- [ ] `src/app/api/history/` ディレクトリが存在
- [ ] `src/components/` ディレクトリが存在
- [ ] `src/lib/` ディレクトリが存在
- [ ] `prisma/` ディレクトリが存在

### コマンド確認

- [ ] `npm run dev` が正常に起動
- [ ] `npm run type-check` がエラーなし
- [ ] `npm run lint` が警告なし
- [ ] `npm run db:generate` が成功
- [ ] `npm run db:push` が成功
- [ ] http://localhost:3000 でページが表示

### 環境変数確認

- [ ] `DATABASE_URL` が設定されている
- [ ] `OPENAI_API_KEY` が設定されている
- [ ] データベース接続テストが成功

---

## 次のPhaseへの準備

Phase 1が完了したら、Phase 2（UI実装）に進みます。

### Phase 2で実施すること

1. **ホームページUI実装**
   - URL入力フォーム
   - 結果表示エリア
   - レスポンシブデザイン

2. **共通UIコンポーネント作成**
   - ボタン
   - 入力フィールド
   - カード
   - ローディングスピナー

---

## まとめ

Phase 1では、AIパパっと要約 & 感想ジェネレータープロジェクトの開発環境を完全にセットアップしました。

**達成したこと:**
- Next.js 15プロジェクトの初期化
- TypeScript、Tailwind CSS、ESLintの設定
- 必要な依存パッケージのインストール
- Neon PostgreSQLデータベースのセットアップ
- Prismaスキーマの作成とマイグレーション
- OpenAI APIキーの設定
- ディレクトリ構造の構築
- 開発サーバーの起動確認

**次のステップ:**
Phase 2のドキュメント（`20251023_02-ui-implementation.md`）を参照して、UI実装に進んでください。

---

**所要時間（実績）:** _____分
**遭遇した問題:** _______________
**メモ:** _______________

**Phase 1 完了日:** ___________
**次のPhase開始予定日:** ___________

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
