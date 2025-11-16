import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignListItemSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="flex flex-col md:flex-row md:gap-4">
        <div className="relative w-full md:w-52 md:h-52 lg:w-56 lg:h-56 h-48 sm:h-56 shrink-0">
          <Skeleton className="h-full w-full rounded-2xl m-2" />
        </div>

        <CardContent className="flex-1 p-3 sm:p-4 md:p-2 lg:p-2 relative flex flex-col">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20 sm:w-24" />

            <div className="md:hidden absolute top-3 right-3 sm:top-4 sm:right-4">
              <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
            </div>

            <Skeleton className="h-5 sm:h-6 md:h-6 lg:h-7 w-full pr-10 sm:pr-12 md:pr-12 lg:pr-0 md:mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 md:gap-2 lg:gap-3 mt-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <Skeleton className="h-4 sm:h-5 md:h-5 lg:h-6 w-32 sm:w-40" />
              <Skeleton className="h-5 sm:h-6 md:h-6 lg:h-7 w-24 sm:w-32" />
            </div>
            <Skeleton className="h-1 sm:h-1.5 w-full" />
          </div>

          <div className="hidden md:block absolute top-4 right-4 lg:top-5 lg:right-5">
            <Skeleton className="h-9 w-9 lg:h-12 lg:w-12 rounded-lg" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

