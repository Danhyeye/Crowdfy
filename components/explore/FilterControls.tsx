"use client";

import { ArrowUp, ArrowDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortBy, SortOrder } from "@/store/useFilterStore";

interface FilterControlsProps {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
}

export function FilterControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onFilterClick,
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortByChange("price")}
        className={`text-xs sm:text-sm px-2 sm:px-3 ${sortBy === "price" ? "bg-gray-100" : ""}`}
      >
        {sortOrder === "asc" && sortBy === "price" ? (
          <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
        )}
        Price
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortByChange("date")}
        className={`text-xs sm:text-sm px-2 sm:px-3 ${sortBy === "date" ? "bg-gray-100" : ""}`}
      >
        {sortOrder === "asc" && sortBy === "date" ? (
          <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
        )}
        Date
      </Button>
      <Button
        variant="default"
        size="sm"
        className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-white text-xs sm:text-sm px-2 sm:px-3"
        onClick={onFilterClick}
      >
        <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Show filters</span>
        <span className="sm:hidden">Filters</span>
      </Button>
    </div>
  );
}

