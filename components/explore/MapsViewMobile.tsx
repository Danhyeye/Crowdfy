"use client";

import { RefObject, useState, useEffect } from "react";
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ChevronUp } from "lucide-react";

interface MapsViewMobileProps {
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

export function MapsViewMobile({
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
}: MapsViewMobileProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMarkerClick = (campaign: Campaign) => {
    setDrawerOpen(true);
    onCampaignClick(campaign);
  };

  // Scroll to selected campaign when drawer opens and selectedCampaignId is set
  useEffect(() => {
    if (!selectedCampaignId || !drawerOpen) return;

    // Wait for drawer animation to complete and DOM to update
    const timeoutId = setTimeout(() => {
      const campaignElement = campaignRefs.current.get(selectedCampaignId);
      if (campaignElement && listContainerRef.current) {
        campaignElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 400); // Delay to account for drawer animation

    return () => clearTimeout(timeoutId);
  }, [selectedCampaignId, drawerOpen]);

  return (
    <div className="lg:hidden flex flex-col gap-4">
      {/* Header and Tabs */}
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

      {/* Map */}
      <div className="h-[400px] min-h-[400px] shrink-0 rounded-2xl overflow-hidden relative">
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
              onCampaignClick={handleMarkerClick}
              favorites={favorites}
              onFavoriteClick={onFavoriteClick}
            />
          </GoogleMap>
        </GoogleMapsLoader>
        
        {/* Drawer Trigger Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-colors z-10"
        >
          <ChevronUp className="h-5 w-5" />
          <span>View Campaigns ({campaigns.length})</span>
        </button>
      </div>

      {/* Drawer for Campaigns List */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex justify-center text-2xl font-semibold">
            <DrawerTitle className="text-center">Campaigns</DrawerTitle>
          </DrawerHeader>
          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hidden space-y-4 p-4"
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
                  onClick={() => {
                    campaign?.id && onCampaignSelect(campaign.id);
                    setDrawerOpen(false);
                  }}
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
          
          {/* Pagination */}
          <div className="border-t p-4 shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
