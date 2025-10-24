'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidUrl } from '@/lib/utils';

export interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    if (!isValidUrl(url)) {
      setError('有効なURLを入力してください');
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        placeholder="https://example.com/article"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={error}
        label="記事のURL"
        helperText="要約したい記事のURLを入力してください"
        fullWidth
        required
      />

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
        要約・感想を生成
      </Button>
    </form>
  );
}
