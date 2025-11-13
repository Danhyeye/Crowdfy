"use client";

import { FilterControls } from "./FilterControls";
import { SortBy, SortOrder } from "@/lib/api/fetchCampaigns";

interface ExploreHeaderProps {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
}

export function ExploreHeader({
  sortBy,
  sortOrder,
  onSortByChange,
  onFilterClick,
}: ExploreHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">

        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Explore</h1>
          <p className="text-base sm:text-sm text-gray-600">Where do you want to help</p>
        </div>

        {/* Filter and Sort Buttons */}
        <FilterControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onFilterClick={onFilterClick}
        />
      </div>
    </div>
  );
}

