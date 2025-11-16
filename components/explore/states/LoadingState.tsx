"use client";

import { ViewMode, SortBy, SortOrder } from "@/store/useFilterStore";
import { ExploreHeader } from "../ExploreHeader";
import { ViewTabs } from "../ViewTabs";
import { CampaignCardSkeleton } from "../CampaignCardSkeleton";
import { CampaignListItemSkeleton } from "../CampaignListItemSkeleton";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface LoadingStateProps {
  viewMode: ViewMode;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  activeTab: "all" | "petitions" | "donations";
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
  onTabChange: (value: "all" | "petitions" | "donations") => void;
  onViewModeChange: (mode: ViewMode) => void;
  onTypeChange: (type: "all" | "petitions" | "donations") => void;
}

export function LoadingState({
  viewMode,
  sortBy,
  sortOrder,
  activeTab,
  onSortByChange,
  onFilterClick,
  onTabChange,
  onViewModeChange,
  onTypeChange,
}: LoadingStateProps) {
  if (viewMode === "maps") {
    return (
      <>
        {/* Mobile/Tablet View (sm/md) */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="shrink-0">
            <ExploreHeader
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={onSortByChange}
              onFilterClick={onFilterClick}
            />
            <div className="mb-4">
              <ViewTabs
                activeTab={activeTab}
                viewMode={viewMode}
                onTabChange={onTabChange}
                onViewModeChange={onViewModeChange}
              />
            </div>
          </div>
          <div className="h-[400px] min-h-[400px] shrink-0 rounded-2xl overflow-hidden bg-muted animate-pulse" />
          <div className="flex-1 min-h-[800px] max-h-[900px] overflow-y-auto scrollbar-hidden space-y-4 p-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <CampaignListItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Desktop View (lg+) */}
        <div className="hidden lg:block h-[calc(100vh-200px)] min-h-[800px]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={50} maxSize={70}>
              <div className="flex flex-col h-full overflow-hidden px-2 py-2">
                <div className="mb-4 shrink-0">
                  <ExploreHeader
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortByChange={onSortByChange}
                    onFilterClick={onFilterClick}
                  />
                  <div className="mb-4">
                    <ViewTabs
                      activeTab={activeTab}
                      viewMode={viewMode}
                      onTabChange={onTabChange}
                      onViewModeChange={onViewModeChange}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-4 p-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <CampaignListItemSkeleton key={i} />
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30} maxSize={50}>
              <div className="h-full min-h-[400px] rounded-2xl overflow-hidden p-2 bg-muted animate-pulse" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </>
    );
  }

  return (
    <>
      <ExploreHeader
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={onSortByChange}
        onFilterClick={onFilterClick}
      />
      <div className="mb-8">
        <ViewTabs
          activeTab={activeTab}
          viewMode={viewMode}
          onTabChange={onTabChange}
          onViewModeChange={onViewModeChange}
        />
      </div>
      {viewMode === "gallery" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <CampaignListItemSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
}

