// types/campaign.ts
export type CampaignType = 'donation' | 'petition';

export interface Campaign {
  id: string;
  type: CampaignType;
  title: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  image: string;
  amount: {
    raised: number;
    currency: string;
  };
  percentage: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  supporters?: number; // for petitions (signatures)
  createdAt: string; // ISO date string
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}