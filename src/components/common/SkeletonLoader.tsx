import { Skeleton } from "../ui/skeleton";

type SkeletonVariant = 'text' | 'heading' | 'card';

interface SkeletonLoaderProps {
  variant: SkeletonVariant;
  count?: number;
}

export function SkeletonLoader({ variant, count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return <Skeleton className="h-4 w-full" />;
      
      case 'heading':
        return (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        );
      
      case 'card':
        return (
          <div className="border border-slate-200 p-6 space-y-4" style={{ borderRadius: '12px' }}>
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
