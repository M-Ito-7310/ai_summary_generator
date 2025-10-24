import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIパパっと要約 & 感想ジェネレーター',
  description:
    'ニュース記事やブログのURLを入力するだけで、AIが即座に3行で要約し、SNS投稿用の感想コメントを3パターン生成します。',
  keywords: ['AI', '要約', '感想生成', 'SNS', 'タイパ'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'AIパパっと要約 & 感想ジェネレーター',
    description: 'AIが記事を3行で要約し、SNS投稿用の感想を3パターン生成',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              {/* Header */}
              <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    AIパパっと要約 & 感想ジェネレーター
                  </h1>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

              {/* Footer */}
              <footer className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 py-6">
                  <p className="text-center text-sm text-gray-600">
                    © 2025 AIパパっと要約 & 感想ジェネレーター. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
