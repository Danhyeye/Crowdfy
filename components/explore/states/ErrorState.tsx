"use client";

import { ViewMode, SortBy, SortOrder } from "@/store/useFilterStore";
import { ExploreHeader } from "../ExploreHeader";
import { ViewTabs } from "../ViewTabs";
import { Database, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | unknown;
  viewMode: ViewMode;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  activeTab: "all" | "petitions" | "donations";
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
  onTabChange: (value: "all" | "petitions" | "donations") => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ErrorState({
  error,
  viewMode,
  sortBy,
  sortOrder,
  activeTab,
  onSortByChange,
  onFilterClick,
  onTabChange,
  onViewModeChange,
}: ErrorStateProps) {
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
      <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
        <Database size={48} strokeWidth={1.5} color="red" />
        <div className="text-center">
          <div className="my-4">
            <h3 className="text-lg font-semibold text-foreground">
              Error loading campaigns
            </h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
          </div>
          <Button variant="default" onClick={() => window.location.reload()}>
            <RefreshCcw size={16} />
            Reload Page
          </Button>
        </div>
      </div>
    </>
  );
}
