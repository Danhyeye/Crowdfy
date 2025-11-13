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
}

export function CampaignCard({ campaign, isFavorite, onFavoriteClick }: CampaignCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-lg">
      <div className="relative aspect-video w-full">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white">
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white ${isFavorite ? "text-red-500" : ""}`}
            onClick={(e) => onFavoriteClick(campaign.id, e)}
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
            <AvatarImage src={campaign.creator.avatar} alt={campaign.creator.name} />
            <AvatarFallback className="text-xs">{campaign.creator.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm text-gray-600 truncate">{campaign.creator.name}</span>
        </div>

        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 line-clamp-2">{campaign.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{campaign.description}</p>

        <div className="space-y-2 sm:space-y-3">
          <Progress value={campaign.percentage} className="h-1 sm:h-1" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 shrink-0" />
              <span className="text-sm sm:text-base md:text-lg truncate">{formatCurrency(campaign.amount.raised, campaign.amount.currency)}</span>
            </div>
            <span className="text-sm sm:text-base md:text-lg shrink-0">{campaign.percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

