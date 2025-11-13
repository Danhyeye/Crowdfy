"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import { CampaignFilters } from "@/lib/api/fetchCampaigns";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useFavorites, useToggleFavoriteMutation } from "@/hooks/useFavorites";
import { FilterPanel } from "./FilterPanel";
import { ExploreHeader } from "./ExploreHeader";
import { ViewTabs } from "./ViewTabs";
import { CampaignCard } from "./CampaignCard";
import { CampaignListItem } from "./CampaignListItem";
import { Pagination } from "@/components/common/Pagination";

export function ExploreContent() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "petitions" | "donations">("all");
  
  const {
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    page,
    pageSize,
    searchQuery,
    viewMode,
    setSortBy: setSortByFilter,
    setType,
    setViewMode,
    setPage,
  } = useFilterStore();

  const favorites = useFavorites();

  const filters: CampaignFilters = {
    page,
    pageSize,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    search: searchQuery || undefined,
    type: activeTab === "all" ? undefined : activeTab === "petitions" ? "petition" : "donation",
  };

  const { data, isLoading, error } = useCampaigns(filters);

  const favoriteMutation = useToggleFavoriteMutation();

  const campaigns = data?.campaigns || [];
  const totalPages = data && pageSize ? Math.ceil(data.total / pageSize) : 1;

  const handleFavoriteClick = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = favorites.includes(campaignId);
    favoriteMutation.mutate({ campaignId, isFavorite });
  };

  return (
    <div className="container w-full mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
      <ExploreHeader
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortByFilter}
        onFilterClick={() => setFilterPanelOpen(true)}
      />

      <div className="mb-8">
        <ViewTabs
          activeTab={activeTab}
          viewMode={viewMode}
          onTabChange={(value) => {
            setActiveTab(value);
            setType(value === "all" ? undefined : value === "petitions" ? "petition" : "donation");
          }}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Campaigns Display */}
      {isLoading ? (
        <div className="text-center py-12">Loading campaigns...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">Error loading campaigns. Please try again.</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No campaigns found.</div>
      ) : (
        <>
          {viewMode === "gallery" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isFavorite={favorites.includes(campaign.id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  isFavorite={favorites.includes(campaign.id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </div>
          )}
          <Pagination
            currentPage={page || 1}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <FilterPanel open={filterPanelOpen} onOpenChange={setFilterPanelOpen} />
    </div>
  );
}

