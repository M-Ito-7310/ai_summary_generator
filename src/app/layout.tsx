import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIパパっと要約 & 感想ジェネレーター',
  description: 'ニュース記事やブログのURLから3行要約と感想コメント3パターンを生成',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
