import apiService, { RequestParams } from '@/lib/core';
import { CampaignsResponse, CampaignType } from '@/types/campaigns';

export type SortBy = 'price' | 'date';

export type SortOrder = 'asc' | 'desc';

export interface CampaignFilters {
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  type?: CampaignType;
  search?: string;
}

const convertCampaignFilters = (filters?: CampaignFilters): RequestParams => {
  if (!filters) return {};

  const params: RequestParams = {}; 
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.pageSize = filters.pageSize;
    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters?.type) params.type = filters.type;
    if (filters?.search) params.search = filters.search;
    return params;
}

export const campaignsService = {
  getAll: async (filters?: CampaignFilters): Promise<CampaignsResponse> => {
    const params = convertCampaignFilters(filters);
    const response = await apiService.get<CampaignsResponse>('/campaigns', params);
    return response.data;
  },
  
  toggleFavorite: async (campaignId: string, isFavorite: boolean): Promise<void> => {
    if (isFavorite) {
      await apiService.delete(`/campaigns/${campaignId}/favorite`);
    } else {
      await apiService.post(`/campaigns/${campaignId}/favorite`);
    }
  },

  deleteFavorite: async (campaignId: string): Promise<void> => {
    await apiService.delete(`/campaigns/${campaignId}/favorite`);
  },
  
  getFavorites: async (): Promise<string[]> => {
    const response = await apiService.get<{ favorites: string[] }>('/campaigns/favorites');
    return response.data.favorites;
  },
};

