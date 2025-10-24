import { CustomError } from '@/types/errors';

export function handleApiError(error: unknown): CustomError {
  // ネットワークエラー
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new CustomError(
      'NETWORK_ERROR',
      'ネットワーク接続を確認してください。',
      undefined,
      true
    );
  }

  // カスタムエラー
  if (error instanceof CustomError) {
    return error;
  }

  // レスポンスエラー
  if (error instanceof Response) {
    if (error.status === 429) {
      return new CustomError(
        'RATE_LIMIT_EXCEEDED',
        'リクエスト制限に達しました。',
        undefined,
        true
      );
    }
    if (error.status >= 500) {
      return new CustomError(
        'INTERNAL_ERROR',
        'サーバーエラーが発生しました。',
        `Status: ${error.status}`,
        true
      );
    }
  }

  // その他のエラー
  return new CustomError(
    'INTERNAL_ERROR',
    'エラーが発生しました。',
    error instanceof Error ? error.message : String(error),
    false
  );
}

export function isRetryableError(error: CustomError): boolean {
  return error.retryable || false;
}
