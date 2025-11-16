"use client";

import { Database } from "lucide-react";
import { ViewMode, SortBy, SortOrder } from "@/store/useFilterStore";
import { ExploreHeader } from "../ExploreHeader";
import { ViewTabs } from "../ViewTabs";

interface EmptyStateProps {
  searchQuery?: string;
  viewMode: ViewMode;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  activeTab: "all" | "petitions" | "donations";
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
  onTabChange: (value: "all" | "petitions" | "donations") => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function EmptyState({
  searchQuery,
  viewMode,
  sortBy,
  sortOrder,
  activeTab,
  onSortByChange,
  onFilterClick,
  onTabChange,
  onViewModeChange,
}: EmptyStateProps) {
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <Database size={48} strokeWidth={1.5} className="mx-auto text-[#84CC16]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No campaigns found
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filters to find more campaigns."
              : "There are no campaigns available at the moment. Check back later!"}
          </p>
        </div>
      </div>
    </>
  );
}

