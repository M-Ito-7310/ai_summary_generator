/**
 * ローカルストレージを使ったAPIキー管理ユーティリティ
 * セキュリティ上、APIキーはBase64エンコードして保存
 */

const STORAGE_KEY = 'gemini_api_key';

/**
 * 文字列をBase64エンコード
 */
function encode(str: string): string {
  if (typeof window === 'undefined') return str;
  return btoa(str);
}

/**
 * Base64デコード
 */
function decode(str: string): string {
  if (typeof window === 'undefined') return str;
  try {
    return atob(str);
  } catch (e) {
    console.error('Failed to decode API key:', e);
    return '';
  }
}

/**
 * APIキーをローカルストレージに保存
 */
export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;

  try {
    const encoded = encode(apiKey.trim());
    localStorage.setItem(STORAGE_KEY, encoded);
  } catch (e) {
    console.error('Failed to save API key:', e);
    throw new Error('APIキーの保存に失敗しました');
  }
}

/**
 * ローカルストレージからAPIキーを取得
 */
export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const encoded = localStorage.getItem(STORAGE_KEY);
    if (!encoded) return null;

    return decode(encoded);
  } catch (e) {
    console.error('Failed to get API key:', e);
    return null;
  }
}

/**
 * ローカルストレージからAPIキーを削除
 */
export function deleteApiKey(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to delete API key:', e);
    throw new Error('APIキーの削除に失敗しました');
  }
}

/**
 * APIキーが保存されているかチェック
 */
export function hasApiKey(): boolean {
  if (typeof window === 'undefined') return false;

  const apiKey = getApiKey();
  return apiKey !== null && apiKey.trim().length > 0;
}

/**
 * APIキーの一部をマスクして表示用に変換
 * 例: AIzaSyABC...xyz123 -> AIza****xyz123
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return '****';
  }

  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 6);
  return `${start}****${end}`;
}
