"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Heart, Gift } from "lucide-react";
import Image from "next/image";
import { Campaign } from "@/types/campaigns";
import formatCurrency from "@/utils/number/price/formatCurrency";

interface CampaignCardProps {
  campaign: Campaign;
  isFavorite: boolean;
  onFavoriteClick: (campaignId: string, e: React.MouseEvent) => void;
  size?: "default" | "compact" | "map";
}

export function CampaignCard({ campaign, isFavorite, onFavoriteClick, size = "default" }: CampaignCardProps) {
  const isCompact = size === "compact" || size === "map";
  const isMap = size === "map";

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow rounded-lg ${isCompact ? "w-full" : ""}`}>
      <div className={`relative ${isMap ? "aspect-4/3" : "aspect-video"} w-full`}>
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className={`absolute ${isMap ? "bottom-1.5 right-1.5 flex gap-1" : "bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-1.5 sm:gap-2"}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isMap ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8"} bg-white/80 hover:bg-white`}
          >
            <Upload className={isMap ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${isMap ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8"} bg-white/80 hover:bg-white ${isFavorite ? "text-red-500" : ""}`}
            onClick={(e) => onFavoriteClick(campaign.id, e)}
          >
            <Heart className={`${isMap ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
      <CardContent className={isMap ? "p-3" : "p-4 sm:p-5"}>
        <div className={`flex items-center gap-2 ${isMap ? "mb-1.5" : "mb-2 sm:mb-3"}`}>
          <Avatar className={isMap ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"}>
            <AvatarImage src={campaign.creator.avatar} alt={campaign.creator.name} />
            <AvatarFallback className={isMap ? "text-[10px]" : "text-xs"}>{campaign.creator.name[0]}</AvatarFallback>
          </Avatar>
          <span className={`${isMap ? "text-[10px]" : "text-xs sm:text-sm"} text-gray-600 truncate`}>{campaign.creator.name}</span>
        </div>

        <h3 className={`font-bold ${isMap ? "text-xs mb-1" : "text-base sm:text-lg md:text-xl mb-2"} line-clamp-2`}>{campaign.title}</h3>
        <p className={`${isMap ? "text-[10px] mb-2" : "text-xs sm:text-sm mb-3 sm:mb-4"} text-gray-600 line-clamp-2`}>{campaign.description}</p>

        <div className={isMap ? "space-y-1.5" : "space-y-2 sm:space-y-3"}>
          <Progress value={campaign.percentage} className={isMap ? "h-0.5" : "h-1 sm:h-1"} />

          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isMap ? "gap-1 text-xs" : "gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg"}`}>
              <Gift className={`${isMap ? "h-3 w-3" : "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"} shrink-0`} />
              <span className={`${isMap ? "text-xs" : "text-sm sm:text-base md:text-lg"} truncate`}>{formatCurrency(campaign.amount.raised, campaign.amount.currency)}</span>
            </div>
            <span className={`${isMap ? "text-xs" : "text-sm sm:text-base md:text-lg"} shrink-0`}>{campaign.percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

