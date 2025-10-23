# AIパパっと要約 & 感想ジェネレーター

**信頼できる要約と、すぐに使える感想コメントが、一瞬で。**

AIパパっと要約 & 感想ジェネレーターは、ニュース記事やブログのURLをペーストするだけで、AIが即座に3行で要約し、SNS投稿用の感想コメント3パターンを生成するWebアプリケーションです。

## 特徴

- **3行要約**: 記事の本質を3行で簡潔に要約
- **感想3パターン**: SNS投稿に最適な感想コメントを3種類生成
- **高速処理**: 数秒で結果を表示
- **スマホ対応**: モバイルファーストのレスポンシブデザイン
- **シンプルUI**: 直感的で使いやすいインターフェース

## なぜこのツールが必要か

### 情報過多時代のニーズ
- 毎日大量の記事を読む必要があるが、時間が足りない
- **タイパ（タイムパフォーマンス）** を重視するユーザーが増加
- 記事の要点を素早く把握したいというニーズ

### SNS投稿のハードル
- 情報はわかるが、自分の意見を言語化するのが苦手
- 適切な表現やトーンを考える時間が取れない
- 「要約はできても、感想を書くのが難しい」という課題

### デモのしやすさ
- その場でURLをペーストして、即座に価値を実感
- 交流会や商談で「すごい」と思わせられる
- 口コミで広がりやすい即効性

## 想定ユーザー

### 個人ユーザー
- **ビジネスパーソン**: 日々の情報収集を効率化
- **SNSユーザー**: 記事をシェアする際のコメント作成を支援
- **学生**: レポート作成時の情報整理

### 企業ユーザー
- **マーケティング・広報担当**: 競合リサーチの効率化
- **オウンドメディア運営**: 記事のSNS拡散に活用
- **教育機関**: 情報リテラシー向上支援

## 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### バックエンド
- **Next.js API Routes** (サーバーレス)
- **OpenAI API** (GPT-4)
- **Prisma ORM**

### データベース
- **Neon PostgreSQL** (サーバーレス)

### デプロイ
- **Vercel**

## セットアップ

### 前提条件

- Node.js 18.x以上
- npm 9.x以上
- OpenAI APIキー
- Neon PostgreSQL アカウント

### インストール

#### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/ai-summary-generator.git
cd ai-summary-generator
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、必要な値を設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` ファイルを編集:

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url_here
DIRECT_URL=your_neon_direct_url_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 4. データベースのセットアップ

```bash
# Prismaクライアント生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# シードデータ投入（オプション）
npm run db:seed
```

#### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintチェック |
| `npm run type-check` | TypeScript型チェック |
| `npm run format` | Prettierでフォーマット |
| `npm run db:generate` | Prismaクライアント生成 |
| `npm run db:push` | スキーマをDBに反映 |
| `npm run db:migrate` | マイグレーション実行 |
| `npm run db:studio` | Prisma Studio起動 |
| `npm run db:seed` | シードデータ投入 |

## プロジェクト構造

```
ai-summary-generator/
├── docs/                    # ドキュメント
│   ├── idea/               # アイデア・企画ドキュメント
│   │   ├── 01-project-overview.md
│   │   ├── 02-architecture.md
│   │   ├── 03-api-specifications.md
│   │   └── 04-database-schema.md
│   └── implementation/     # 実装ドキュメント
├── prisma/                 # Prismaスキーマ・マイグレーション
│   ├── schema.prisma
│   └── migrations/
├── public/                 # 静的ファイル
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # Reactコンポーネント
│   ├── lib/              # ユーティリティ・ビジネスロジック
│   └── types/            # TypeScript型定義
├── .env.local.example     # 環境変数テンプレート
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 主要機能

### 1. URL入力
- シンプルで直感的なURL入力フォーム
- ペースト操作に最適化
- スマホでの操作性を重視

### 2. AI要約生成
- 記事を3行で簡潔に要約
- 重要なポイントを自動抽出
- 読みやすい日本語表現

### 3. 感想コメント生成
- SNS投稿に適した長さとトーン
- 異なる視点・切り口で3パターン生成
- ワンクリックでコピー可能

### 4. 結果表示
- 見やすいカード形式
- コピー＆ペーストで即座に使用可能
- レスポンシブデザイン

## API仕様

### POST /api/summarize

記事URLを受け取り、要約と感想を生成します。

**リクエスト**

```json
{
  "url": "https://example.com/article"
}
```

**レスポンス**

```json
{
  "success": true,
  "data": {
    "article": {
      "url": "https://example.com/article",
      "title": "記事タイトル"
    },
    "summary": {
      "lines": ["1行目", "2行目", "3行目"],
      "fullText": "要約全文"
    },
    "comments": [
      {
        "id": 1,
        "text": "感想コメント1",
        "tone": "casual"
      },
      {
        "id": 2,
        "text": "感想コメント2",
        "tone": "casual"
      },
      {
        "id": 3,
        "text": "感想コメント3",
        "tone": "casual"
      }
    ]
  }
}
```

詳細は [API仕様書](docs/idea/03-api-specifications.md) を参照してください。

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリと連携
2. Vercelプロジェクト作成
3. 環境変数を設定
4. デプロイ

```bash
# Vercel CLIを使用する場合
npm install -g vercel
vercel
```

環境変数の設定:
- `OPENAI_API_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_APP_URL`

## ドキュメント

### プロジェクトドキュメント
- [プロジェクト概要](docs/idea/01-project-overview.md)
- [アーキテクチャ設計](docs/idea/02-architecture.md)
- [API仕様](docs/idea/03-api-specifications.md)
- [データベーススキーマ](docs/idea/04-database-schema.md)

## 開発ロードマップ

### Phase 1: MVP開発 ✅
- [x] プロジェクト初期化
- [x] ドキュメント作成
- [ ] UI実装
- [ ] AI統合
- [ ] データベース統合
- [ ] デプロイ

### Phase 2: 機能拡張（将来計画）
- [ ] ユーザー認証
- [ ] 履歴管理
- [ ] お気に入り機能
- [ ] トーン調整機能
- [ ] 複数言語対応

### Phase 3: エンタープライズ対応
- [ ] カスタマイズ版
- [ ] API提供
- [ ] ホワイトラベル版

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

MIT

## お問い合わせ

- **GitHub Issues**: [問題報告](https://github.com/yourusername/ai-summary-generator/issues)
- **メール**: your-email@example.com

---

**AIパパっと要約 & 感想ジェネレーター** - タイパ重視の時代に、必要な情報をすばやく。
