import apiService, { RequestParams } from '@/lib/core';
import { CampaignsResponse, CampaignFilters } from '@/types/campaigns';



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
    if (filters?.latitude) params.latitude = filters.latitude;
    if (filters?.longitude) params.longitude = filters.longitude;
    return params;
}

export const campaignsService = {
  getAll: async (filters?: CampaignFilters): Promise<CampaignsResponse> => {
    const params = convertCampaignFilters(filters);
    const response = await apiService.get<CampaignsResponse>('/campaigns', params);
    return response.data;
  },
};

