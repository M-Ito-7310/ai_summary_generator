export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200
        rounded
        ${className}
      `}
    />
  );
}

// 要約結果のスケルトン
export function SummaryResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* 記事情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* 要約 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* 感想コメント */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
