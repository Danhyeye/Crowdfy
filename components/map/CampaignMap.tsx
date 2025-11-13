"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Campaign } from "@/types/campaigns";
import { CampaignCard } from "@/components/explore/CampaignCard";

interface CampaignMapProps {
  campaigns: Campaign[];
  selectedCampaignId?: string;
  onCampaignClick?: (campaign: Campaign) => void;
  favorites?: string[];
  onFavoriteClick?: (campaignId: string, e: React.MouseEvent) => void;
}


// Component to handle map bounds fitting
function MapBoundsFitter({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    let hasValidBounds = false;

    campaigns.forEach((campaign) => {
      if (campaign.latitude && campaign.longitude) {
        bounds.extend({
          lat: campaign.latitude,
          lng: campaign.longitude,
        });
        hasValidBounds = true;
      }
    });

    if (hasValidBounds) {
      map.fitBounds(bounds);
    }
  }, [map, campaigns]);

  return null;
}

// Individual Marker Component
function CampaignMarker({
  campaign,
  isSelected,
  isInfoWindowOpen,
  onMarkerClick,
  isFavorite,
  onFavoriteClick,
}: {
  campaign: Campaign;
  isSelected: boolean;
  isInfoWindowOpen: boolean;
  onMarkerClick: () => void;
  isFavorite: boolean;
  onFavoriteClick: (campaignId: string, e: React.MouseEvent) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (!campaign.latitude || !campaign.longitude) return null;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: campaign.latitude, lng: campaign.longitude }}
        title={campaign.title}
        onClick={onMarkerClick}
      >
        <div
          style={{
            width: isSelected ? "20px" : "14px",
            height: isSelected ? "20px" : "14px",
            borderRadius: "50%",
            backgroundColor: isSelected ? "#84CC16" : "#73ac2c",
            border: "2px solid #ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        />
      </AdvancedMarker>
      {isInfoWindowOpen && marker && (
        <InfoWindow
          anchor={marker}
          disableAutoPan={false}
        >
          <div 
            style={{ 
              width: "280px", 
              maxWidth: "calc(100vw - 40px)",
              padding: 0,
              margin: 0
            }}
            className="info-window-content"
          >
            <CampaignCard
              campaign={campaign}
              isFavorite={isFavorite}
              onFavoriteClick={onFavoriteClick}
              size="map"
            />
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function CampaignMap({
  campaigns,
  selectedCampaignId,
  onCampaignClick,
  favorites = [],
  onFavoriteClick,
}: CampaignMapProps) {
  const [openInfoWindowId, setOpenInfoWindowId] = useState<string | null>(null);
  const map = useMap();

  // Filter campaigns with valid coordinates
  const validCampaigns = useMemo(
    () => campaigns.filter((c) => c.latitude && c.longitude),
    [campaigns]
  );

  const handleFavoriteClick = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(campaignId, e);
    }
  };

  // Auto-open info window when campaign is selected from list
  useEffect(() => {
    if (selectedCampaignId && map) {
      const campaign = validCampaigns.find((c) => c.id === selectedCampaignId);
      if (campaign) {
        setOpenInfoWindowId(selectedCampaignId);
        // Pan to marker
        map.panTo({
          lat: campaign.latitude!,
          lng: campaign.longitude!,
        });
      }
    }
  }, [selectedCampaignId, map, validCampaigns]);

  // Close info window when clicking on the map
  useEffect(() => {
    if (!map) return;

    const handleMapClick = () => {
      setOpenInfoWindowId(null);
    };

    const listener = google.maps.event.addListener(
      map,
      "click",
      handleMapClick
    ) as unknown as google.maps.MapsEventListener | null;

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [map]);

  const handleMarkerClick = (campaign: Campaign) => {
    setOpenInfoWindowId(campaign.id);
    if (onCampaignClick) {
      onCampaignClick(campaign);
    }
  };

  return (
    <>
      <MapBoundsFitter campaigns={validCampaigns} />
      {validCampaigns.map((campaign) => (
        <CampaignMarker
          key={campaign.id}
          campaign={campaign}
          isSelected={campaign.id === selectedCampaignId}
          isInfoWindowOpen={openInfoWindowId === campaign.id}
          onMarkerClick={() => handleMarkerClick(campaign)}
          isFavorite={favorites.includes(campaign.id)}
          onFavoriteClick={handleFavoriteClick}
        />
      ))}
    </>
  );
}

