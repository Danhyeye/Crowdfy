"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import { CampaignFilters } from "@/types/campaigns";
import { useCampaigns, normalizeFilters } from "@/hooks/useCampaigns";
import { useFavorites, useToggleFavoriteMutation } from "@/hooks/useFavorites";
import { FilterPanel } from "./FilterPanel";
import { ExploreHeader } from "./ExploreHeader";
import { ViewTabs } from "./ViewTabs";
import { CampaignCard } from "./CampaignCard";
import { CampaignListItem } from "./CampaignListItem";
import { Pagination } from "@/components/common/Pagination";
import { Campaign } from "@/types/campaigns";
import { LoadingState } from "./states/LoadingState";
import { ErrorState } from "./states/ErrorState";
import { EmptyState } from "./states/EmptyState";
import { MapsViewMobile } from "./MapsViewMobile";
import { MapsViewDesktop } from "./MapsViewDesktop";

export function ExploreContent() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "petitions" | "donations">(
    "all"
  );
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    string | undefined
  >();
  const campaignRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const listContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef<boolean>(false);

  const {
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    page,
    pageSize,
    searchQuery,
    viewMode,
    _hasHydrated,
    setSortBy: setSortByFilter,
    setType,
    setViewMode,
    setPage,
  } = useFilterStore();

  const favorites = useFavorites();

  const filters: CampaignFilters = useMemo(() => {
    const filterObj: CampaignFilters = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      search: searchQuery || undefined,
      type:
        activeTab === "all"
          ? undefined
          : activeTab === "petitions"
          ? "petition"
          : "donation",
    };
    
    return normalizeFilters(filterObj);
  }, [page, pageSize, sortBy, sortOrder, minPrice, maxPrice, searchQuery, activeTab]);

  const { data, isLoading, error } = useCampaigns(filters, _hasHydrated);

  const favoriteMutation = useToggleFavoriteMutation();
  const campaigns = Array.isArray(data?.campaigns) ? data.campaigns.filter(campaign => campaign && campaign.id) : [];
  const totalPages = data && pageSize ? Math.ceil(data.total / pageSize) : 1;

  const handleFavoriteClick = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = favorites.includes(campaignId);
    favoriteMutation.mutate({ campaignId, isFavorite });
  };

  const handleCampaignClick = (campaign: Campaign) => {
    shouldScrollRef.current = true;
    setSelectedCampaignId(campaign.id);

    // Scroll to the campaign item in the list
    const campaignElement = campaignRefs.current.get(campaign.id);
    if (campaignElement && listContainerRef.current) {
      setTimeout(() => {
        campaignElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        shouldScrollRef.current = false;
      }, 100);
    }
  };

  // Scroll to selected campaign when selectedCampaignId changes (from map marker click or auto-selection)
  useEffect(() => {
    if (!selectedCampaignId || viewMode !== "maps" || !shouldScrollRef.current)
      return;

    const campaignElement = campaignRefs.current.get(selectedCampaignId);
    if (campaignElement && listContainerRef.current) {
      setTimeout(() => {
        campaignElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        shouldScrollRef.current = false;
      }, 300);
    }
  }, [selectedCampaignId, viewMode]);

  const handleTabChange = (value: "all" | "petitions" | "donations") => {
    setActiveTab(value);
    setType(
      value === "all"
        ? undefined
        : value === "petitions"
        ? "petition"
        : "donation"
    );
  };

  return (
    <div className="container w-full mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
      {/* Campaigns Display */}
      {isLoading ? (
        <LoadingState
          viewMode={viewMode}
          sortBy={sortBy}
          sortOrder={sortOrder}
          activeTab={activeTab}
          onSortByChange={setSortByFilter}
          onFilterClick={() => setFilterPanelOpen(true)}
          onTabChange={handleTabChange}
          onViewModeChange={setViewMode}
          onTypeChange={handleTabChange}
        />
      ) : error ? (
        <ErrorState
          error={error}
          viewMode={viewMode}
          sortBy={sortBy}
          sortOrder={sortOrder}
          activeTab={activeTab}
          onSortByChange={setSortByFilter}
          onFilterClick={() => setFilterPanelOpen(true)}
          onTabChange={handleTabChange}
          onViewModeChange={setViewMode}
        />
      ) : campaigns.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          viewMode={viewMode}
          sortBy={sortBy}
          sortOrder={sortOrder}
          activeTab={activeTab}
          onSortByChange={setSortByFilter}
          onFilterClick={() => setFilterPanelOpen(true)}
          onTabChange={handleTabChange}
          onViewModeChange={setViewMode}
        />
      ) : (
        <>
          {viewMode === "maps" ? (
            <>
              <MapsViewMobile
                campaigns={campaigns}
                favorites={favorites}
                selectedCampaignId={selectedCampaignId}
                campaignRefs={campaignRefs}
                listContainerRef={listContainerRef}
                onCampaignClick={handleCampaignClick}
                onFavoriteClick={handleFavoriteClick}
                onCampaignSelect={setSelectedCampaignId}
                sortBy={sortBy}
                sortOrder={sortOrder}
                activeTab={activeTab}
                viewMode={viewMode}
                onSortByChange={setSortByFilter}
                onFilterClick={() => setFilterPanelOpen(true)}
                onTabChange={handleTabChange}
                onViewModeChange={setViewMode}
                currentPage={page || 1}
                totalPages={totalPages}
                onPageChange={setPage}
              />
              <MapsViewDesktop
                campaigns={campaigns}
                favorites={favorites}
                selectedCampaignId={selectedCampaignId}
                campaignRefs={campaignRefs}
                listContainerRef={listContainerRef}
                onCampaignClick={handleCampaignClick}
                onFavoriteClick={handleFavoriteClick}
                onCampaignSelect={setSelectedCampaignId}
                sortBy={sortBy}
                sortOrder={sortOrder}
                activeTab={activeTab}
                viewMode={viewMode}
                onSortByChange={setSortByFilter}
                onFilterClick={() => setFilterPanelOpen(true)}
                onTabChange={handleTabChange}
                onViewModeChange={setViewMode}
                currentPage={page || 1}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <>
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
                    setType(
                      value === "all"
                        ? undefined
                        : value === "petitions"
                        ? "petition"
                        : "donation"
                    );
                  }}
                  onViewModeChange={setViewMode}
                />
              </div>

              {viewMode === "gallery" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign, index) => (
                      <CampaignCard
                        key={campaign?.id || `campaign-${index}`}
                        campaign={campaign}
                        isFavorite={campaign?.id ? favorites.includes(campaign.id) : false}
                        onFavoriteClick={handleFavoriteClick}
                      />
                    ))}
                  </div>
                  <div className="p-4 sm:p-6 shrink-0">
                    <Pagination
                      currentPage={page || 1}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    {campaigns.map((campaign, index) => (
                      <CampaignListItem
                        key={campaign?.id || `campaign-${index}`}
                        campaign={campaign}
                        isFavorite={campaign?.id ? favorites.includes(campaign.id) : false}
                        onFavoriteClick={handleFavoriteClick}
                      />
                    ))}
                  </div>
                  <div className="border-t p-4 sm:p-6 shrink-0">
                  <Pagination
                    currentPage={page || 1}
                    totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      <FilterPanel open={filterPanelOpen} onOpenChange={setFilterPanelOpen} />
    </div>
  );
}
