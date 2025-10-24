'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { saveApiKey, getApiKey, deleteApiKey, maskApiKey } from '@/lib/storage/apiKey';
import { validateApiKey } from '@/lib/ai';
import { Key, Eye, EyeOff, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export interface ApiKeyInputProps {
  onApiKeySet?: (apiKey: string) => void;
}

export function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 初期化時に保存済みのAPIキーを読み込む
  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setSavedApiKey(stored);
      onApiKeySet?.(stored);
    }
  }, [onApiKeySet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!apiKey.trim()) {
      setError('APIキーを入力してください');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setError('無効なAPIキー形式です。Gemini APIキーは"AIza"で始まる39文字の文字列です。');
      return;
    }

    try {
      saveApiKey(apiKey);
      setSavedApiKey(apiKey);
      setApiKey('');
      setSuccess(true);
      onApiKeySet?.(apiKey);

      // 3秒後に成功メッセージを消す
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'APIキーの保存に失敗しました');
    }
  };

  const handleDelete = () => {
    try {
      deleteApiKey();
      setSavedApiKey(null);
      setApiKey('');
      setError('');
      setSuccess(false);
      onApiKeySet?.('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'APIキーの削除に失敗しました');
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Gemini APIキー設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 保存済みAPIキーの表示 */}
        {savedApiKey && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 font-medium">APIキーが設定されています</p>
                </div>
                <p className="text-green-700 text-sm font-mono">
                  {maskApiKey(savedApiKey)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* APIキー入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              error={error}
              label="Gemini APIキー"
              helperText="Google AI StudioでAPIキーを取得できます"
              fullWidth
              required={!savedApiKey}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              aria-label={showKey ? 'APIキーを隠す' : 'APIキーを表示'}
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">APIキーが保存されました</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="md" fullWidth>
            {savedApiKey ? 'APIキーを更新' : 'APIキーを保存'}
          </Button>
        </form>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">セキュリティに関する注意</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>APIキーはブラウザのローカルストレージに保存されます</li>
                <li>共有PCでは使用後に削除することをおすすめします</li>
                <li>APIキーは他人に共有しないでください</li>
              </ul>
            </div>
          </div>
        </div>

        {/* APIキー取得リンク */}
        <div className="text-center">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Google AI StudioでAPIキーを取得
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
