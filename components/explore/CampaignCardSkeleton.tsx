import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg">
      <div className="relative aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
          <Skeleton className="h-4 w-24 sm:w-32" />
        </div>

        <Skeleton className="h-5 sm:h-6 md:h-7 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3 sm:mb-4" />

        <div className="space-y-2 sm:space-y-3">
          <Skeleton className="h-1 sm:h-1.5 w-full" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-5 sm:h-6 md:h-7 w-24 sm:w-32" />
            <Skeleton className="h-5 sm:h-6 md:h-7 w-12 sm:w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

