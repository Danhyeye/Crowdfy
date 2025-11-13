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
    <div className="mb-4 sm:mb-6 md:mb-8 flex items-start justify-between sm:justify-between md:justify-between w-full">
      <div className="mb-3 sm:mb-4 ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
          Explore
        </h1>
        <p className="text-base sm:text-sm text-gray-600">
          Where do you want to help
        </p>
      </div>

        <FilterControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onFilterClick={onFilterClick}
        />
    </div>
  );
}