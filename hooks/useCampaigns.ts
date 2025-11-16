import { useQuery } from "@tanstack/react-query";
import { campaignsService } from "@/lib/api/fetchCampaigns";
import { CampaignFilters } from "@/types/campaigns";

export function normalizeFilters(filters: CampaignFilters): CampaignFilters {
  const normalized: CampaignFilters = {};
  
  if (filters.page !== undefined) normalized.page = filters.page;
  if (filters.pageSize !== undefined) normalized.pageSize = filters.pageSize;
  if (filters.minPrice !== undefined) normalized.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) normalized.maxPrice = filters.maxPrice;
  if (filters.sortBy !== undefined) normalized.sortBy = filters.sortBy;
  if (filters.sortOrder !== undefined) normalized.sortOrder = filters.sortOrder;
  if (filters.type !== undefined) normalized.type = filters.type;
  if (filters.search !== undefined) normalized.search = filters.search;
  if (filters.latitude !== undefined) normalized.latitude = filters.latitude;
  if (filters.longitude !== undefined) normalized.longitude = filters.longitude;
  
  return normalized;
}

export function useCampaigns(filters: CampaignFilters, enabled: boolean = true) {
  const normalizedFilters = normalizeFilters(filters);
  
  return useQuery({
    queryKey: ["campaigns", normalizedFilters],
    queryFn: () => campaignsService.getAll(filters),
    enabled,
  });
}

