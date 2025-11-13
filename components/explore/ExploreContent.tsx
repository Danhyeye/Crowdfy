"use client";

import { useState, useRef, useEffect } from "react";
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
import { CampaignMap } from "../map/CampaignMap";
import { GoogleMapsLoader } from "../map/GoogleMapsLoader";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import { Campaign } from "@/types/campaigns";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

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
    type:
      activeTab === "all"
        ? undefined
        : activeTab === "petitions"
        ? "petition"
        : "donation",
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

  return (
    <div className="container w-full mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
      {/* Campaigns Display */}
      {isLoading ? (
        <div className="text-center py-12">Loading campaigns...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error loading campaigns. Please try again.
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No campaigns found.
        </div>
      ) : (
        <>
          {viewMode === "maps" ? (
            <>
              {/* Mobile/Tablet View (sm/md) - Flex Column Layout */}
              <div className="lg:hidden flex flex-col gap-4">
                  {/* Header and Tabs */}
                  <div className="shrink-0">
                    <ExploreHeader
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortByChange={setSortByFilter}
                      onFilterClick={() => setFilterPanelOpen(true)}
                    />
                    <div className="mb-4">
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

                {/* Map */}
                <div className="h-[400px] min-h-[400px] shrink-0 rounded-2xl overflow-hidden">
                  <GoogleMapsLoader>
                    <GoogleMap
                      defaultZoom={2}
                      defaultCenter={{ lat: 20, lng: 0 }}
                      mapId="campaign-map"
                      mapTypeControl={false}
                      streetViewControl={false}
                      fullscreenControl={true}
                      className="w-full h-full"
                    >
                      <CampaignMap
                        campaigns={campaigns}
                        selectedCampaignId={selectedCampaignId}
                        onCampaignClick={handleCampaignClick}
                        favorites={favorites}
                        onFavoriteClick={handleFavoriteClick}
                      />
                    </GoogleMap>
                  </GoogleMapsLoader>
                </div>

                {/* Campaigns List */}
                  <div
                    ref={listContainerRef}
                    className="flex-1 min-h-[800px] max-h-[900px] overflow-y-auto scrollbar-hidden space-y-4 p-1"
                  >
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        ref={(el) => {
                          if (el) {
                            campaignRefs.current.set(campaign.id, el);
                          } else {
                            campaignRefs.current.delete(campaign.id);
                          }
                        }}
                        onClick={() => setSelectedCampaignId(campaign.id)}
                        className={`cursor-pointer transition-all ${
                          selectedCampaignId === campaign.id
                            ? "ring-1 ring-[#84CC16] rounded-lg"
                            : ""
                        }`}
                      >
                        <CampaignListItem
                          campaign={campaign}
                          isFavorite={favorites.includes(campaign.id)}
                          onFavoriteClick={handleFavoriteClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-4 pt-4 border-t shrink-0 sticky top-0">
                  <Pagination
                    currentPage={page || 1}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>               
              </div>

              {/* Desktop View (lg+) - Resizable Panel Layout */}
              <div className="hidden lg:block h-[calc(100vh-200px)] min-h-[800px]">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Campaigns List - Left Side */}
                  <ResizablePanel defaultSize={50} minSize={50} maxSize={70}>
                    <div className="flex flex-col h-full overflow-hidden px-2 py-2">
                      {/* Header and Tabs - Left Side */}
                      <div className="mb-4 shrink-0">
                        <ExploreHeader
                          sortBy={sortBy}
                          sortOrder={sortOrder}
                          onSortByChange={setSortByFilter}
                          onFilterClick={() => setFilterPanelOpen(true)}
                        />
                        <div className="mb-4">
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
                      </div>

                      {/* Campaigns List */}
                      <div
                        ref={listContainerRef}
                        className="flex-1 overflow-y-auto scrollbar-hidden space-y-4 p-1"
                      >
                        {campaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            ref={(el) => {
                              if (el) {
                                campaignRefs.current.set(campaign.id, el);
                              } else {
                                campaignRefs.current.delete(campaign.id);
                              }
                            }}
                            onClick={() => setSelectedCampaignId(campaign.id)}
                            className={`cursor-pointer transition-all ${
                              selectedCampaignId === campaign.id
                                ? "ring-1 ring-[#84CC16] rounded-lg"
                                : ""
                            }`}
                          >
                            <CampaignListItem
                              campaign={campaign}
                              isFavorite={favorites.includes(campaign.id)}
                              onFavoriteClick={handleFavoriteClick}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t shrink-0">
                        <Pagination
                          currentPage={page || 1}
                          totalPages={totalPages}
                          onPageChange={setPage}
                        />
                      </div>
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Map - Right Side */}
                  <ResizablePanel defaultSize={50} minSize={30} maxSize={50}>
                    <div className="h-full min-h-[400px] rounded-2xl overflow-hidden p-2">
                      <GoogleMapsLoader>
                        <GoogleMap
                          defaultZoom={2}
                          defaultCenter={{ lat: 20, lng: 0 }}
                          mapId="campaign-map"
                          mapTypeControl={false}
                          streetViewControl={false}
                          fullscreenControl={true}
                          className="w-full h-full"
                        >
                          <CampaignMap
                            campaigns={campaigns}
                            selectedCampaignId={selectedCampaignId}
                            onCampaignClick={handleCampaignClick}
                          />
                        </GoogleMap>
                      </GoogleMapsLoader>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
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
                    {campaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        isFavorite={favorites.includes(campaign.id)}
                        onFavoriteClick={handleFavoriteClick}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={page || 1}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <>
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
                  <Pagination
                    currentPage={page || 1}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
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
