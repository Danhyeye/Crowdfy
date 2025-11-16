"use client";

import { RefObject, useEffect } from "react";
import { ViewMode, SortBy, SortOrder } from "@/store/useFilterStore";
import { Campaign } from "@/types/campaigns";
import { ExploreHeader } from "./ExploreHeader";
import { ViewTabs } from "./ViewTabs";
import { CampaignListItem } from "./CampaignListItem";
import { Pagination } from "@/components/common/Pagination";
import { CampaignMap } from "../map/CampaignMap";
import { GoogleMapsLoader } from "../map/GoogleMapsLoader";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface MapsViewDesktopProps {
  campaigns: Campaign[];
  favorites: string[];
  selectedCampaignId?: string;
  campaignRefs: RefObject<Map<string, HTMLDivElement>>;
  listContainerRef: RefObject<HTMLDivElement | null>;
  onCampaignClick: (campaign: Campaign) => void;
  onFavoriteClick: (campaignId: string, e: React.MouseEvent) => void;
  onCampaignSelect: (campaignId: string) => void;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  activeTab: "all" | "petitions" | "donations";
  viewMode: ViewMode;
  onSortByChange: (sortBy: SortBy) => void;
  onFilterClick: () => void;
  onTabChange: (value: "all" | "petitions" | "donations") => void;
  onViewModeChange: (mode: ViewMode) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MapsViewDesktop({
  campaigns,
  favorites,
  selectedCampaignId,
  campaignRefs,
  listContainerRef,
  onCampaignClick,
  onFavoriteClick,
  onCampaignSelect,
  sortBy,
  sortOrder,
  activeTab,
  viewMode,
  onSortByChange,
  onFilterClick,
  onTabChange,
  onViewModeChange,
  currentPage,
  totalPages,
  onPageChange,
}: MapsViewDesktopProps) {
  // Scroll to selected campaign when selectedCampaignId changes
  useEffect(() => {
    if (!selectedCampaignId) return;

    const campaignElement = campaignRefs.current.get(selectedCampaignId);
    if (campaignElement && listContainerRef.current) {
      setTimeout(() => {
        campaignElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
    }
  }, [selectedCampaignId]);

  return (
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

            {/* Campaigns List */}
            <div
              ref={listContainerRef}
              className="flex-1 overflow-y-auto scrollbar-hidden space-y-4 p-1"
            >
              {campaigns.map((campaign, index) => {
                const campaignId = campaign?.id || `campaign-${index}`;
                return (
                  <div
                    key={campaignId}
                    ref={(el) => {
                      if (el && campaign?.id && campaignRefs.current) {
                        campaignRefs.current.set(campaign.id, el);
                      } else if (!el && campaign?.id && campaignRefs.current) {
                        campaignRefs.current.delete(campaign.id);
                      }
                    }}
                    onClick={() => campaign?.id && onCampaignSelect(campaign.id)}
                    className={`cursor-pointer transition-all ${
                      selectedCampaignId === campaign?.id
                        ? "ring-1 ring-[#84CC16] rounded-2xl"
                        : ""
                    }`}
                  >
                    <CampaignListItem
                      campaign={campaign}
                      isFavorite={campaign?.id ? favorites.includes(campaign.id) : false}
                      onFavoriteClick={onFavoriteClick}
                    />
                  </div>
                );
              })}
            </div>
            <div className="pt-4 shrink-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
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
                  onCampaignClick={onCampaignClick}
                  favorites={favorites}
                  onFavoriteClick={onFavoriteClick}
                />
              </GoogleMap>
            </GoogleMapsLoader>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

