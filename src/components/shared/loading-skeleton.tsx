export function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 animate-pulse space-y-3">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

export function PageSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full px-4 md:px-20 py-10">
      <div className="h-8 bg-muted rounded w-1/4 mb-8 animate-pulse" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
