import type { ErrorCode } from '@/types/errors';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_URL: '無効なURLです。正しいURL形式で入力してください。',
  INVALID_API_KEY: '無効なGemini APIキーです。正しいAPIキーを設定してください。',
  FETCH_FAILED: '記事の取得に失敗しました。URLを確認してください。',
  PARSING_FAILED: '記事の解析に失敗しました。別の記事をお試しください。',
  AI_API_ERROR: 'AI処理でエラーが発生しました。しばらく待ってから再試行してください。',
  RATE_LIMIT_EXCEEDED: 'リクエスト制限に達しました。しばらく待ってから再試行してください。',
  INTERNAL_ERROR: 'サーバーエラーが発生しました。時間をおいて再試行してください。',
  NETWORK_ERROR: 'ネットワーク接続を確認してください。',
  DATABASE_ERROR: 'データの保存に失敗しました。再試行してください。',
};

export function getErrorMessage(code: ErrorCode, customMessage?: string): string {
  return customMessage || ERROR_MESSAGES[code];
}
