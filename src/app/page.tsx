export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AIパパっと要約 & 感想ジェネレーター
        </h1>
        <p className="text-center text-lg mb-4">
          ニュース記事やブログのURLから3行要約と感想コメント3パターンを生成
        </p>
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <p className="text-center text-sm text-gray-600">
            ✅ Phase 1: プロジェクトセットアップ完了
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Next.js 15 + React 19 + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
