# API Specifications

## API概要

### ベースURL
- **開発環境**: `http://localhost:3000/api`
- **本番環境**: `https://ai-summary-generator.vercel.app/api`

### レスポンス形式
すべてのAPIレスポンスはJSON形式で返却されます。

### エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報（オプション）"
  }
}
```

## エンドポイント一覧

### 1. 記事要約・感想生成 API

#### `POST /api/summarize`

記事URLを受け取り、3行要約とSNS投稿用感想3パターンを生成します。

**リクエスト**

```typescript
{
  url: string;           // 記事のURL（必須）
  options?: {
    summaryLength?: number;  // 要約の行数（デフォルト: 3）
    commentCount?: number;   // 感想の数（デフォルト: 3）
    tone?: 'casual' | 'formal' | 'neutral';  // トーン（デフォルト: 'neutral'）
  }
}
```

**リクエスト例**

```json
{
  "url": "https://example.com/article/tech-news",
  "options": {
    "summaryLength": 3,
    "commentCount": 3,
    "tone": "casual"
  }
}
```

**レスポンス（成功時）**

```typescript
{
  success: true;
  data: {
    article: {
      url: string;
      title: string;
      description?: string;
      publishedAt?: string;
      author?: string;
    };
    summary: {
      lines: string[];        // 3行の要約
      fullText: string;       // 結合したテキスト
    };
    comments: Array<{
      id: number;
      text: string;           // 感想コメント
      tone: string;           // トーン
      length: number;         // 文字数
    }>;
    metadata: {
      generatedAt: string;    // 生成日時（ISO 8601）
      tokensUsed: number;     // 使用トークン数
      processingTime: number; // 処理時間（ミリ秒）
    };
  }
}
```

**レスポンス例**

```json
{
  "success": true,
  "data": {
    "article": {
      "url": "https://example.com/article/tech-news",
      "title": "最新AI技術が変える未来",
      "description": "AIの最新動向について解説",
      "publishedAt": "2025-10-20T10:00:00Z",
      "author": "山田太郎"
    },
    "summary": {
      "lines": [
        "最新のAI技術により、業務効率が大幅に向上している。",
        "特に自然言語処理の分野では、人間レベルの理解が可能に。",
        "今後5年でAI市場は3倍に成長すると予測されている。"
      ],
      "fullText": "最新のAI技術により、業務効率が大幅に向上している。特に自然言語処理の分野では、人間レベルの理解が可能に。今後5年でAI市場は3倍に成長すると予測されている。"
    },
    "comments": [
      {
        "id": 1,
        "text": "AI技術の進化スピードに驚きました！特に自然言語処理の発展は、私たちの仕事にも大きな影響を与えそうですね。",
        "tone": "casual",
        "length": 68
      },
      {
        "id": 2,
        "text": "業務効率化の観点から見ても、AI導入は避けられない流れですね。早めに準備を始めたいと思います。",
        "tone": "casual",
        "length": 58
      },
      {
        "id": 3,
        "text": "市場が3倍成長というのは驚異的。この波に乗り遅れないよう、しっかり情報収集していきたいです。",
        "tone": "casual",
        "length": 56
      }
    ],
    "metadata": {
      "generatedAt": "2025-10-23T12:34:56Z",
      "tokensUsed": 1250,
      "processingTime": 3500
    }
  }
}
```

**エラーレスポンス**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "無効なURLです",
    "details": "URLの形式が正しくありません"
  }
}
```

**エラーコード一覧**

| コード | 説明 |
|--------|------|
| `INVALID_URL` | URLの形式が不正 |
| `FETCH_FAILED` | 記事の取得に失敗 |
| `PARSING_FAILED` | 記事の解析に失敗 |
| `AI_API_ERROR` | AI APIエラー |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 |
| `INTERNAL_ERROR` | サーバー内部エラー |

---

### 2. 記事取得 API

#### `POST /api/fetch-article`

URLから記事の基本情報を取得します（要約・感想生成なし）。

**リクエスト**

```typescript
{
  url: string;  // 記事のURL（必須）
}
```

**レスポンス（成功時）**

```typescript
{
  success: true;
  data: {
    url: string;
    title: string;
    description?: string;
    content: string;        // 記事本文
    publishedAt?: string;
    author?: string;
    ogImage?: string;       // OGP画像URL
    favicon?: string;       // ファビコンURL
  }
}
```

---

### 3. 履歴取得 API

#### `GET /api/history`

過去の要約履歴を取得します（将来実装予定の認証機能と連携）。

**クエリパラメータ**

| パラメータ | 型 | 説明 | デフォルト |
|-----------|-----|------|-----------|
| `limit` | number | 取得件数 | 10 |
| `offset` | number | オフセット | 0 |
| `sortBy` | string | ソート順（`createdAt`, `title`） | `createdAt` |
| `order` | string | 昇順/降順（`asc`, `desc`） | `desc` |

**リクエスト例**

```
GET /api/history?limit=20&offset=0&sortBy=createdAt&order=desc
```

**レスポンス（成功時）**

```typescript
{
  success: true;
  data: {
    items: Array<{
      id: string;
      url: string;
      title: string;
      summary: {
        lines: string[];
        fullText: string;
      };
      comments: Array<{
        id: number;
        text: string;
        tone: string;
      }>;
      createdAt: string;  // ISO 8601形式
    }>;
    pagination: {
      total: number;      // 総件数
      limit: number;
      offset: number;
      hasMore: boolean;   // 次のページがあるか
    };
  }
}
```

---

### 4. 履歴削除 API

#### `DELETE /api/history/:id`

指定した履歴を削除します。

**パスパラメータ**

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `id` | string | 履歴ID |

**レスポンス（成功時）**

```json
{
  "success": true,
  "data": {
    "message": "履歴が削除されました",
    "deletedId": "abc123"
  }
}
```

---

### 5. 統計情報取得 API

#### `GET /api/stats`

利用統計を取得します（管理者用、将来実装予定）。

**レスポンス（成功時）**

```typescript
{
  success: true;
  data: {
    totalSummaries: number;      // 総要約数
    totalComments: number;       // 総感想数
    averageProcessingTime: number; // 平均処理時間（ミリ秒）
    totalTokensUsed: number;     // 総トークン使用量
    topDomains: Array<{
      domain: string;
      count: number;
    }>;
    dailyStats: Array<{
      date: string;
      count: number;
    }>;
  }
}
```

---

## AIプロンプト仕様

### 要約生成プロンプト

```
あなたは優秀な要約アシスタントです。以下の記事を3行で簡潔に要約してください。

【要約のルール】
1. 各行は1文で完結させてください
2. 記事の最も重要なポイントを抽出してください
3. 専門用語がある場合は、一般の人にもわかりやすく説明してください
4. 客観的な表現を心がけてください
5. 各行は40〜60文字程度にまとめてください

【記事タイトル】
{title}

【記事本文】
{content}

【出力形式】
以下のJSON形式で出力してください:
{
  "lines": ["1行目の要約", "2行目の要約", "3行目の要約"]
}
```

### 感想生成プロンプト

```
あなたはSNS投稿のアシスタントです。以下の記事について、SNS投稿用の感想コメントを3パターン生成してください。

【感想のルール】
1. 各感想は50〜80文字程度
2. 読者の共感を呼ぶ表現を心がける
3. 異なる視点や切り口で3パターン作成
4. トーン: {tone} （casual=親しみやすい、formal=ビジネス的、neutral=中立的）
5. 絵文字は使用しない
6. 具体的な数字や事実を含める

【記事タイトル】
{title}

【記事要約】
{summary}

【出力形式】
以下のJSON形式で出力してください:
{
  "comments": [
    {"text": "1つ目の感想"},
    {"text": "2つ目の感想"},
    {"text": "3つ目の感想"}
  ]
}
```

## レート制限

### 制限内容

| エンドポイント | 制限 |
|---------------|------|
| `/api/summarize` | 10リクエスト/分、100リクエスト/日 |
| `/api/fetch-article` | 20リクエスト/分 |
| `/api/history` | 30リクエスト/分 |

### レート制限超過時のレスポンス

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超えました",
    "details": "1分後に再試行してください",
    "retryAfter": 60
  }
}
```

## HTTPステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 400 | リクエストが不正 |
| 429 | レート制限超過 |
| 500 | サーバーエラー |
| 503 | サービス一時停止 |

## CORS設定

開発環境では全てのオリジンを許可。本番環境では特定のドメインのみ許可。

```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://ai-summary-generator.vercel.app'
    : '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## バージョニング

現在のバージョン: `v1`

将来的なバージョンアップ時は、URLに `/v2/` などを含めることで対応。

```
/api/v1/summarize
/api/v2/summarize
```

## 認証（将来実装予定）

将来的にユーザー認証を実装する際は、以下の仕様を想定:

### Bearerトークン認証

```
Authorization: Bearer <token>
```

### リフレッシュトークン

```
POST /api/auth/refresh
{
  "refreshToken": "..."
}
```

## Webhook（将来実装予定）

要約・感想生成完了時に、指定したURLにWebhookを送信する機能。

```
POST {webhookUrl}
{
  "event": "summary.completed",
  "data": { ... }
}
```
