# Phase 04: データベース統合

**Status**: 🔴 未着手
**Priority**: High
**Estimated Time**: 3時間
**Actual Time**: -
**Assigned**: AI Agent

---

## 📝 Description

Neon PostgreSQLとPrismaを使用して、要約履歴の保存・取得機能を実装します。

### 目標
- Prismaスキーマの最終確認と調整
- データベースマイグレーションの実行
- 履歴保存機能の実装
- 履歴取得APIの実装

---

## ✅ Checklist

### Prismaスキーマ設計
- [ ] `prisma/schema.prisma` の確認
- [ ] Summaryモデルの定義確認
- [ ] インデックス設定の確認
- [ ] リレーション設定（将来的なユーザー機能に備える）

### データベースマイグレーション
- [ ] マイグレーションファイルの生成
- [ ] Neon PostgreSQL接続確認
- [ ] マイグレーション実行: `npm run db:migrate`
- [ ] Prisma Studioでテーブル確認

### 履歴保存機能
- [ ] 要約生成時に自動保存する処理追加
- [ ] `src/lib/db/summary.ts` の実装
- [ ] createSummary関数の実装
- [ ] トランザクション処理の実装（必要に応じて）

### 履歴取得API
- [ ] `src/app/api/history/route.ts` の実装
- [ ] GETエンドポイント実装（直近N件取得）
- [ ] ページネーション実装（オプション）
- [ ] 日付フィルタリング（オプション）

### データ整合性
- [ ] 必須フィールドのバリデーション
- [ ] 文字数制限の確認
- [ ] URLの一意性チェック（重複登録の扱い）

### エラーハンドリング
- [ ] DB接続エラーのハンドリング
- [ ] 書き込みエラーのハンドリング
- [ ] ロールバック処理（必要に応じて）

---

## 🧪 Test Plan

1. **マイグレーションテスト**
   - マイグレーションが正常に実行される
   - テーブルが正しく作成される
   - インデックスが適用される

2. **データ保存テスト**
   - 要約生成後にDBに保存される
   - 全フィールドが正しく保存される
   - タイムスタンプが自動設定される

3. **データ取得テスト**
   - 履歴APIが正常に動作
   - 正しい順序でデータが取得される
   - 存在しないデータへのリクエスト処理

4. **パフォーマンステスト**
   - クエリのレスポンス時間測定
   - 大量データでの動作確認

---

## 📌 Acceptance Criteria

- [ ] Prismaスキーマが正しく定義されている
- [ ] マイグレーションが成功している
- [ ] 要約生成時にデータがDBに保存される
- [ ] 履歴取得APIが正常に動作する
- [ ] エラーが適切にハンドリングされる
- [ ] Prisma Studioでデータが確認できる
- [ ] localhost でDB連携の動作確認済み
- [ ] リントエラーがゼロ
- [ ] 型エラーがゼロ

---

## 📎 Related

- **Implementation Guide**: [docs/implementation/04-database-integration.md](../../implementation/04-database-integration.md)
- **Database Schema**: [docs/idea/04-database-schema.md](../../idea/04-database-schema.md)
- **Previous Phase**: [phase-03-ai-integration.md](./phase-03-ai-integration.md)
- **Next Phase**: [phase-05-error-handling-ux.md](./phase-05-error-handling-ux.md)

---

## 💭 Memo

### スキーマ変更履歴
<!-- スキーマの変更があれば記録 -->

### パフォーマンスメモ
<!-- クエリパフォーマンスの気づき -->

### 完了時のGitコミットハッシュ
<!-- 完了時に記録 -->

---

**Created**: 2025-10-23
**Last Updated**: 2025-10-23
