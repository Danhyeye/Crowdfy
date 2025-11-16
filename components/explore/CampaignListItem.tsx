"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Heart, Gift, MapPin, Award } from "lucide-react";
import Image from "next/image";
import { Campaign } from "@/types/campaigns";
import formatCurrency from "@/utils/number/price/formatCurrency";

interface CampaignListItemProps {
  campaign: Campaign;
  isFavorite: boolean;
  onFavoriteClick: (campaignId: string, e: React.MouseEvent) => void;
}

const campaignTypeLabels = {
  donation: "Donations",
  petition: "Petitions",
};

export function CampaignListItem({
  campaign,
  isFavorite,
  onFavoriteClick,
}: CampaignListItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl">
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        <CardContent className="relative w-40 h-52 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-56 lg:h-56 shrink-0">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
            loading="eager"
            className="object-cover rounded-2xl p-2"
          />
          {campaign.creator.verified && (
            <div className="absolute bottom-4 left-4 bg-[#f7fee7] text-[#65a30e] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              Verified
            </div>
          )}
        </CardContent>

        <CardContent className="flex-1 p-3 sm:p-4 md:p-2 lg:p-2 relative flex flex-col">
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm text-[#73ac2c] font-semibold">
                {campaignTypeLabels[campaign.type]}
              </span>

              <div className="md:hidden absolute top-3 right-3 sm:top-4 sm:right-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full shadow-md bg-white hover:bg-gray-50 ${
                    isFavorite ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={(e) => onFavoriteClick(campaign.id, e)}
                >
                  <Heart
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <h3 className="font-bold text-base sm:text-lg md:text-lg lg:text-xl line-clamp-2 pr-10 sm:pr-12 md:pr-12 lg:pr-0 md:mb-2">
                {campaign.title}
              </h3>

              <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 line-clamp-2 sm:line-clamp-2 leading-relaxed">
                {campaign.description}
              </p>
            </div>
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-2 lg:gap-3 mt-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="text-sm sm:text-base md:text-base lg:text-lg truncate">{campaign.location}</span>
              </div>

              <div className="space-y-3">
                  <span className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold">
                    {formatCurrency(
                      campaign.amount.raised,
                      campaign.amount.currency,
                      true
                    )}
                  </span>
              </div>
            </div>
              <Progress value={campaign.percentage} className="h-1 sm:h-1" />
          </div>
          <div className="hidden md:block absolute top-4 right-4 lg:top-5 lg:right-5">
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 lg:h-12 lg:w-12 rounded-lg shadow-md transition-all hover:bg-background/95 backdrop-blur-none supports-backdrop-filter:bg-background/60 ${
                isFavorite ? "text-red-500" : "text-foreground"
              }`}
              onClick={(e) => onFavoriteClick(campaign.id, e)}
            >
              <Heart
                className={`h-4 w-4 lg:h-6 lg:w-6 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
