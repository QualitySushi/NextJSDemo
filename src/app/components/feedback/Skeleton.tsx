interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-border/60 dark:bg-border/40 rounded-lg ${className}`} 
      aria-hidden="true"
    />
  );
}

// Pre-built Product Card Skeleton matching your ProductCard layout
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm flex flex-col">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      {/* Details placeholder */}
      <div className="p-4 space-y-3 flex flex-col grow">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        
        {/* Rating placeholder */}
        <Skeleton className="h-4 w-28" />

        {/* Price placeholder */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Stepper & Button footer */}
        <div className="pt-2 mt-auto border-t border-border flex items-center justify-between gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}