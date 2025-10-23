# Architecture

## システムアーキテクチャ概要

### アーキテクチャパターン
- **フロントエンド**: Next.js App Router（サーバーコンポーネント + クライアントコンポーネント）
- **バックエンド**: Next.js API Routes（サーバーレス）
- **データベース**: Neon PostgreSQL（サーバーレスDB）
- **AI統合**: OpenAI API / Claude API
- **デプロイ**: Vercel Edge Network

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        User Device                          │
│                    (スマホ / PC / タブレット)                │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 14/15 (App Router)                   │   │
│  │  ┌──────────────────┐  ┌──────────────────┐         │   │
│  │  │  Server          │  │  Client          │         │   │
│  │  │  Components      │  │  Components      │         │   │
│  │  └──────────────────┘  └──────────────────┘         │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────┐       │   │
│  │  │         API Routes (Serverless)          │       │   │
│  │  │  • /api/summarize                        │       │   │
│  │  │  • /api/generate-comments                │       │   │
│  │  │  • /api/fetch-article                    │       │   │
│  │  │  • /api/history                          │       │   │
│  │  └──────────────────────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬───────────────────────┬─────────────────────────┘
             │                       │
             ▼                       ▼
┌────────────────────────┐  ┌──────────────────────┐
│   AI API Services      │  │  Neon PostgreSQL     │
│  • OpenAI GPT-4        │  │  (Serverless DB)     │
│  • Claude API          │  │  • 履歴テーブル      │
│  (要約・感想生成)       │  │  • 統計テーブル      │
└────────────────────────┘  └──────────────────────┘
```

## 技術スタック詳細

### フロントエンド

#### フレームワーク・ライブラリ
- **Next.js 14/15**
  - App Router
  - Server Components（パフォーマンス最適化）
  - Client Components（インタラクティブUI）
  - Streaming SSR

- **React 18/19**
  - Hooks
  - Suspense
  - Error Boundaries

- **TypeScript 5**
  - 型安全性
  - コード補完
  - バグの早期発見

#### UI・スタイリング
- **Tailwind CSS**
  - ユーティリティファーストCSS
  - レスポンシブデザイン
  - カスタムテーマ

- **shadcn/ui（検討中）**
  - 再利用可能なUIコンポーネント
  - アクセシビリティ対応
  - カスタマイズ性

#### その他ライブラリ
- **lucide-react**: アイコン
- **clsx / tailwind-merge**: クラス名の結合
- **zod**: バリデーション

### バックエンド

#### API Routes
- **Next.js API Routes**
  - サーバーレス関数
  - Edge Runtime（高速レスポンス）
  - 自動スケーリング

#### AI統合
- **OpenAI API**
  - GPT-4 / GPT-3.5-turbo
  - ストリーミングレスポンス対応
  - トークン管理

- **Claude API（代替案）**
  - Claude 3 Sonnet/Opus
  - 長文処理に強い
  - 日本語精度

#### Web Scraping / Article Fetching
- **Cheerio**: HTML解析
- **node-html-parser**: 軽量パーサー
- **puppeteer（必要に応じて）**: 動的コンテンツ対応

### データベース

#### Neon PostgreSQL
- **特徴**
  - サーバーレスPostgreSQL
  - 自動スケーリング
  - 無料枠あり（0.5GB）
  - Vercelとの親和性が高い

- **ORM: Prisma**
  - 型安全なクエリ
  - マイグレーション管理
  - Prisma Studio（DB管理GUI）

#### データベーススキーマ（概要）
- `summaries`: 要約履歴
- `comments`: 生成された感想
- `analytics`: 利用統計

### デプロイ・ホスティング

#### Vercel
- **利点**
  - Next.jsとの完全統合
  - 自動CI/CD
  - Edge Network（高速配信）
  - プレビューデプロイメント
  - 無料枠（Hobby Plan）

- **環境変数管理**
  - 本番環境用
  - プレビュー環境用
  - 開発環境用

## システムフロー

### 1. 記事要約・感想生成フロー

```
[ユーザー]
    │
    │ 1. URLを入力
    ▼
[フロントエンド: URL入力フォーム]
    │
    │ 2. POST /api/summarize
    ▼
[API Routes: /api/summarize]
    │
    ├─ 3a. 記事取得
    │   └─→ [Web Scraping: Cheerio]
    │
    ├─ 3b. AI要約生成
    │   └─→ [OpenAI API: GPT-4]
    │        (プロンプト: 3行要約)
    │
    ├─ 3c. AI感想生成
    │   └─→ [OpenAI API: GPT-4]
    │        (プロンプト: 3パターン感想)
    │
    └─ 3d. データベース保存
        └─→ [Neon PostgreSQL]
             (履歴テーブルに保存)
    │
    │ 4. レスポンス返却
    ▼
[フロントエンド: 結果表示画面]
    │
    │ 5. 要約・感想を表示
    ▼
[ユーザー]
```

### 2. 履歴表示フロー

```
[ユーザー]
    │
    │ 1. 履歴ページアクセス
    ▼
[フロントエンド: 履歴ページ]
    │
    │ 2. GET /api/history
    ▼
[API Routes: /api/history]
    │
    │ 3. データベースクエリ
    ▼
[Neon PostgreSQL]
    │
    │ 4. 履歴データ返却
    ▼
[フロントエンド: 履歴リスト表示]
    │
    │ 5. 履歴を表示
    ▼
[ユーザー]
```

## ディレクトリ構造

```
ai-summary-generator/
├── .claude/                    # Claude Code設定
│   └── settings.local.json
│
├── docs/                       # ドキュメント
│   ├── idea/                   # アイデア・企画ドキュメント
│   │   ├── 01-project-overview.md
│   │   ├── 02-architecture.md
│   │   ├── 03-api-specifications.md
│   │   └── 04-database-schema.md
│   └── implementation/         # 実装ドキュメント
│
├── prisma/                     # Prismaスキーマ
│   ├── schema.prisma
│   └── migrations/
│
├── public/                     # 静的ファイル
│   ├── favicon.ico
│   └── images/
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── api/               # API Routes
│   │   │   ├── summarize/
│   │   │   │   └── route.ts
│   │   │   ├── generate-comments/
│   │   │   │   └── route.ts
│   │   │   ├── fetch-article/
│   │   │   │   └── route.ts
│   │   │   └── history/
│   │   │       └── route.ts
│   │   ├── history/           # 履歴ページ
│   │   │   └── page.tsx
│   │   └── globals.css
│   │
│   ├── components/             # Reactコンポーネント
│   │   ├── ui/                # 基本UIコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── UrlInputForm.tsx   # URL入力フォーム
│   │   ├── SummaryDisplay.tsx # 要約表示
│   │   ├── CommentCard.tsx    # 感想カード
│   │   └── HistoryList.tsx    # 履歴リスト
│   │
│   ├── lib/                    # ユーティリティ・ビジネスロジック
│   │   ├── db.ts              # Prismaクライアント
│   │   ├── ai.ts              # AI API統合
│   │   ├── scraper.ts         # 記事取得
│   │   ├── prompts.ts         # AIプロンプト定義
│   │   └── utils.ts           # 汎用ユーティリティ
│   │
│   └── types/                  # TypeScript型定義
│       ├── api.ts             # API型定義
│       ├── database.ts        # DB型定義
│       └── index.ts
│
├── .env.local.example          # 環境変数テンプレート
├── .env.local                  # 環境変数（git除外）
├── .eslintrc.json              # ESLint設定
├── .gitignore
├── .prettierrc.json            # Prettier設定
├── .prettierignore
├── next.config.js              # Next.js設定
├── package.json
├── postcss.config.js           # PostCSS設定
├── tailwind.config.ts          # Tailwind CSS設定
├── tsconfig.json               # TypeScript設定
└── README.md
```

## パフォーマンス最適化戦略

### 1. フロントエンド最適化
- **Server Components優先**: 可能な限りサーバーコンポーネントを使用
- **コード分割**: 動的インポートで必要なコードのみ読み込み
- **画像最適化**: Next.js Imageコンポーネント活用
- **キャッシング**: SWRまたはReact Queryでデータキャッシュ

### 2. API最適化
- **Edge Runtime**: API Routesでエッジランタイム使用
- **ストリーミングレスポンス**: AI生成結果をストリーミングで返却
- **レート制限**: 過度なAPI呼び出しを防止
- **エラーリトライ**: AI API失敗時の再試行ロジック

### 3. データベース最適化
- **インデックス**: よく検索されるカラムにインデックス
- **クエリ最適化**: N+1問題の回避
- **コネクションプーリング**: Prismaのコネクション管理

## セキュリティ対策

### 1. API保護
- **レート制限**: IP単位での制限
- **入力バリデーション**: Zodスキーマによる検証
- **URLホワイトリスト**: 信頼できるドメインのみ許可（オプション）

### 2. データ保護
- **環境変数**: APIキーの安全な管理
- **データサニタイズ**: XSS対策
- **HTTPS**: 通信の暗号化（Vercel標準）

### 3. AIプロンプト保護
- **プロンプトインジェクション対策**: ユーザー入力の制限
- **トークン制限**: 過度な利用の防止

## スケーラビリティ

### 水平スケーリング
- Vercelの自動スケーリング
- Edge Networkによる地理的分散
- サーバーレスアーキテクチャ

### 垂直スケーリング
- Neon PostgreSQLの自動スケーリング
- AI APIの並列処理

## 監視・ロギング

### ツール
- **Vercel Analytics**: パフォーマンス監視
- **Vercel Logs**: エラーログ
- **Prisma Studio**: データベース監視

### メトリクス
- API レスポンスタイム
- エラー率
- AI API使用量
- データベースクエリパフォーマンス

## 将来的な技術拡張

### 機能拡張時の技術選択
- **認証**: NextAuth.js
- **キャッシュ**: Redis（Upstash）
- **ファイルストレージ**: Vercel Blob / AWS S3
- **リアルタイム更新**: Server-Sent Events / WebSocket
- **バッチ処理**: Vercel Cron Jobs

### スケール時の検討事項
- マイクロサービス化
- CDN最適化
- データベース読み取りレプリカ
- AI APIのセルフホスト検討
