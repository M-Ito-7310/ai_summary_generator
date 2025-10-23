# チケット管理システム

AIパパっと要約 & 感想ジェネレータープロジェクトの開発進捗を管理するためのチケットシステムです。

## 📁 ディレクトリ構造

```
docs/ticket/
├── README.md                    # このファイル
├── PROGRESS.md                  # 全体の進捗状況
├── phase/                       # Phase別チケット（Phase 1-8）
│   ├── README.md
│   ├── PROGRESS.md
│   ├── phase-01-project-setup.md
│   ├── phase-02-ui-implementation.md
│   ├── phase-03-ai-integration.md
│   ├── phase-04-database-integration.md
│   ├── phase-05-error-handling-ux.md
│   ├── phase-06-performance-optimization.md
│   ├── phase-07-testing-qa.md
│   └── phase-08-deployment.md
├── bug/                         # バグ修正チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── bug-{番号}-{説明}.md
├── feature/                     # 機能追加チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── feature-{番号}-{説明}.md
└── enhancement/                 # 改善チケット
    ├── README.md
    ├── PROGRESS.md
    └── enhancement-{番号}-{説明}.md
```

## 📊 チケットカテゴリ

### 🏗️ [phase/](phase/) - Phase別チケット

プロジェクトの開発フェーズ（Phase 1-8）ごとの実装チケットです。

- **対象**: Phase 1-8の開発タスク
- **状態**: 進行中
- **参照**: [phase/README.md](phase/README.md)

**Phaseリスト:**
- **Phase 1**: プロジェクトセットアップ（2時間）
- **Phase 2**: UI実装（4時間）
- **Phase 3**: AI統合（5時間）
- **Phase 4**: データベース統合（3時間）
- **Phase 5**: エラーハンドリング＆UX改善（3時間）
- **Phase 6**: パフォーマンス最適化（2時間）
- **Phase 7**: テスト＆QA（3時間）
- **Phase 8**: Vercelデプロイ＆プレリリース（2時間）

### 🐛 [bug/](bug/) - バグ修正チケット

本番環境や開発中に発見されたバグの修正を管理します。

- **命名規則**: `bug-001-description.md`
- **優先度**: Critical / High / Medium / Low
- **参照**: [bug/README.md](bug/README.md)

### ✨ [feature/](feature/) - 機能追加チケット

新しい機能の追加や要望を管理します。

- **命名規則**: `feature-001-description.md`
- **優先度**: High / Medium / Low
- **参照**: [feature/README.md](feature/README.md)

### 🔧 [enhancement/](enhancement/) - 改善チケット

既存機能の改善・最適化・リファクタリングを管理します。

- **命名規則**: `enhancement-001-description.md`
- **カテゴリ**: Performance / Refactoring / UX / Security / Code Quality
- **参照**: [enhancement/README.md](enhancement/README.md)

## 📊 チケットステータス

各チケットは以下のステータスを持ちます：

- 🔴 **未着手 (TODO)**: まだ開始していない
- 🟡 **進行中 (IN PROGRESS)**: 現在作業中
- 🟢 **完了 (DONE)**: 実装・テスト完了
- 🔵 **レビュー待ち (REVIEW)**: レビュー依頼中
- ⚫ **ブロック (BLOCKED)**: 他の作業待ち

## 🚀 使い方

### 1. 新しいチケットの作成

#### Phase開発の場合
1. `docs/ticket/phase/` ディレクトリで該当Phaseのチケットを開く
2. タスクリストを確認
3. `phase/PROGRESS.md` を更新

#### バグを発見した場合
1. `docs/ticket/bug/` ディレクトリに移動
2. 最新の番号を確認（例: bug-001.md が最新なら次は bug-002）
3. `bug-{番号}-{簡潔な説明}.md` を作成
4. [bug/README.md](bug/README.md) のテンプレートに従って記入
5. `bug/PROGRESS.md` を更新

#### 新機能を追加する場合
1. `docs/ticket/feature/` ディレクトリに移動
2. 最新の番号を確認
3. `feature-{番号}-{簡潔な説明}.md` を作成
4. [feature/README.md](feature/README.md) のテンプレートに従って記入
5. `feature/PROGRESS.md` を更新

#### 既存機能を改善する場合
1. `docs/ticket/enhancement/` ディレクトリに移動
2. 最新の番号を確認
3. `enhancement-{番号}-{簡潔な説明}.md` を作成
4. [enhancement/README.md](enhancement/README.md) のテンプレートに従って記入
5. `enhancement/PROGRESS.md` を更新

### 2. チケットの更新

1. 該当するチケットファイルを開く
2. ステータスを更新（🔴 → 🟡 → 🟢）
3. タスクチェックリストを更新
4. 進捗メモを追記
5. 完了時は実績時間を記録
6. 対応するPROGRESS.mdを更新

### 3. 進捗の確認

- **カテゴリ別進捗**: 各ディレクトリの `PROGRESS.md` を確認
- **全体進捗**: `docs/ticket/PROGRESS.md` を確認

## 📝 チケット番号の採番ルール

各カテゴリで独立した連番を使用します：

```
bug-001-url-validation-error.md
bug-002-summary-generation-failed.md
feature-001-dark-mode.md
feature-002-multi-language-support.md
enhancement-001-performance-optimization.md
enhancement-002-refactor-api-routes.md
```

## 🔄 ワークフロー

### Phase開発フロー
1. Phase開始 → ステータス更新 (🔴 → 🟡 進行中)
2. タスク実装 → チェックリスト更新
3. テスト → 問題なければ完了
4. 完了 → ステータス更新 (🟡 → 🟢 完了)
5. PROGRESS.md更新

### バグ修正フロー
1. バグ発見 → チケット作成 (🔴 未着手)
2. 再現確認・原因分析 → ステータス更新 (🟡 進行中)
3. 修正実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

### 機能追加フロー
1. 要望受付 → チケット作成 (🔴 未着手)
2. 仕様検討・設計 → ステータス更新 (🟡 進行中)
3. 実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

### 改善フロー
1. 改善点発見 → チケット作成 (🔴 未着手)
2. 影響範囲調査・方法検討 → ステータス更新 (🟡 進行中)
3. 実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

## 📞 エスカレーション

問題が発生した場合：
1. チケットのステータスを ⚫ **ブロック** に変更
2. メモセクションに問題の詳細を記載
3. 関連する依存関係を記録
4. プロジェクトマネージャーに報告

## 🎯 進捗管理のベストプラクティス

1. **こまめな更新**: タスク完了時は即座にチェック
2. **詳細な記録**: メモセクションに問題点や解決策を記録
3. **実績時間の記録**: 見積精度向上のため実績時間を記録
4. **定期レビュー**: 週次でPROGRESS.mdを確認
5. **優先度の見直し**: 状況に応じて優先度を調整

## 📈 統計情報の確認

各カテゴリの `PROGRESS.md` で以下の情報を確認できます：

- 全体進捗率
- カテゴリ別/優先度別の件数
- 平均対応時間
- 現在対応中のタスク
- 完了済みタスク

## 🔗 関連ドキュメント

- [Phase別チケット](phase/README.md) - Phase 1-8の開発チケット
- [バグ修正チケット](bug/README.md) - バグ管理ガイド
- [機能追加チケット](feature/README.md) - 機能追加ガイド
- [改善チケット](enhancement/README.md) - 改善管理ガイド
- [全体進捗](PROGRESS.md) - プロジェクト全体の進捗状況

## 📊 プロジェクト概要

### 目標
AIパパっと要約 & 感想ジェネレーターの開発と本番リリース

### 技術スタック
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + OpenAI API
- **Database**: Neon PostgreSQL + Prisma
- **Deploy**: Vercel

### 開発期間
- **見積**: 24時間（Phase 1-8）
- **バッファ**: 5時間
- **合計**: 約29時間

---

**🤖 このチケットシステムはプロジェクトの円滑な進行をサポートします**
